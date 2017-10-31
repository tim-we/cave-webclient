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

	startGame();
});

function mainloop() {
	let game: Game = Model.getGame();

	if (game) {
		game.Player.setForce(UserInput.isPressed());
	}

	Model.update();
}

function serverUpdateHandler(data: IServerMessage) {
	let game: Game = Model.getGame();

	if(game) {
		game.updateData(data);
	}
}

function startGame() {
	GameLog.log("Connecting...");
	
	connection.connect("Ulysses")
		.then(() => {
			GameLog.log("Waiting for round to start...");
			return connection.waitForStart();
		})
		.then(roundController)
		.catch((reason) => {
			GameLog.error(reason);
		});
}

function roundController(data:IServerGameStart) {
	connection.setUpdateListener(serverUpdateHandler);
	GameLog.log("Starting game!");

	Model.newGame(data);

	mainloop();
	
	View.startDrawLoop();

	Model.getGame().Countdown.addListener(t => {
		GameLog.log(`${t}...`);
	});

	return Model.getGame().Countdown
		.waitForGameStart()
		.then(() => {
			GameLog.log("Go!");

			setTimeout(() => {
				Model.getGame().Player.setFirstInputReceived();
			}, 1000);

			return Model.getGame().waitForEnd();
		})
		.then(() => {
			GameLog.log("Game has ended.", true);

			return wait(1000);
		})
		.then(() => {
			GameLog.log("Waiting for next round...");

			return connection.waitForStart();
		}).then(roundController);
}

function wait(time: number):Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
}