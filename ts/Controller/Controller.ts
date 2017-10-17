import Model from "../Model/Model";
import * as View from "../View/View";
import { Connection } from "./IConnection";

import * as UserInput from "./UserInput";

import Server from "./Server";
import LocalTestServer from "./LocalTestServer";
import {
	IServerMessage,
	IServerGameStart
} from "./ICommunication";

//var connection: Connection = new Server();
var connection: Connection = new LocalTestServer();
var model: Model = null;

//var tmp: number = 0;

window.addEventListener("load", () => {

	connection.connect("Ulysses")
	 .then(() => connection.waitForStart(), (reason) => {
		 console.log("Connection failed: " + reason);
	 })
	 .then((data:IServerGameStart) => {
		connection.setUpdateListener(serverUpdateHandler);
		console.log("Starting game!");

		model = new Model(data);

		View.init(model, mainloop);

		mainloop();
		
		View.startDrawLoop();
	}).catch((reason) => {
		console.log("Something went wrong: " + reason);
	});
	
});

function mainloop() {
	if (model) {
		model.update();

		if (model.Player.Alive) {
			model.Player.Force = UserInput.isPressed();
		}
	}

	/*if (tmp++ > 42) {
		View.stopDrawLoop();
	}//*/
}

function serverUpdateHandler(data:IServerMessage) {
	if(model) {
		model.updateData(data);
	}
}