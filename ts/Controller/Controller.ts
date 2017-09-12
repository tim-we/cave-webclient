import Model from "../Model/Model";
import * as View from "../View/View";
import { Connection } from "./IConnection";

import * as UserInput from "./UserInput";

import Server from "./Server";
import LocalTestServer from "./LocalTestServer";
import {
	IServerMessage,
	IServerGameStateUpdate,
	IServerGameStart
} from "./ICommunication";

var connection: Connection = new Server(); //new LocalTestServer();
var model: Model = null;

//var tmp: number = 0;

window.addEventListener("load", () => {

	connection.connect()
	 .then(() => connection.waitForStart(), (reason) => {
		 console.log("Connection failed: " + reason);
	 })
	 .then((data:IServerGameStart) => {
		console.log("Starting game!");

		model = new Model(data);

		connection.setStateUpdateListener(stateUpdateHandler);

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

function stateUpdateHandler(data:IServerMessage) {
	if(data.type === "state") {
		if(model) {
			model.updateData(<IServerGameStateUpdate>data);
		}
	}
}