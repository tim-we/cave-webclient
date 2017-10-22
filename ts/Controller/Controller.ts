import * as Model from "../Model/Model";
import Game from "../Model/Game";
import * as View from "../View/View";
import { Connection } from "./IConnection";

import * as UserInput from "./UserInput";
import * as GameLog from "../View/GameLog";

import Server from "./Server";
//import LocalTestServer from "./LocalTestServer";
import {
	IServerMessage,
	IServerGameStart
} from "../Protocol/ICommunication";

var connection: Connection = new Server();
//var connection: Connection = new LocalTestServer();

window.addEventListener("load", () => {

	GameLog.log("Inititalizing view components...");
	View.init(mainloop);

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

			Model.newGame(data);

			mainloop();
			
			View.startDrawLoop();
		}).catch((reason) => {
			GameLog.error("Something went wrong: " + reason);
		});
	
});

function mainloop() {
	let game: Game = Model.getGame();

	if (game) {
		game.Player.setForce(UserInput.isPressed());

		if (game.aliveCount() > 0) {
			game.update();
		}
	}
}

function serverUpdateHandler(data: IServerMessage) {
	let game: Game = Model.getGame();

	if(game) {
		game.updateData(data);
	}
}