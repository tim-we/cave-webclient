import Model from "../Model/Model";
import * as View from "../View/View";
import { Connection } from "./IConnection";

import * as UserInput from "./UserInput";
import * as GameLog from "../View/GameLog";

import Server from "./Server";
//import LocalTestServer from "./LocalTestServer";
import {
	IServerMessage,
	IServerGameStart
} from "./ICommunication";

var connection: Connection = new Server();
//var connection: Connection = new LocalTestServer();
var model: Model = null;

//var tmp: number = 0;

window.addEventListener("load", () => {

	GameLog.log("Connecting...");

	connection.connect("Ulysses")
		.then(() => {
			GameLog.log("Waiting for round to start...");
			return connection.waitForStart();
		}, (reason) => {
			GameLog.error("Connection failed: " + reason);
		})
		.then((data:IServerGameStart) => {
			connection.setUpdateListener(serverUpdateHandler);
			GameLog.log("Starting game!");

			model = new Model(data);

			View.init(model, mainloop);

			mainloop();
			
			View.startDrawLoop();
		}).catch((reason) => {
			GameLog.error("Something went wrong: " + reason);
		});
	
});

function mainloop() {
	if (model) {
		model.Player.Force = UserInput.isPressed();

		if (model.aliveCount() > 0) {
			model.update();
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