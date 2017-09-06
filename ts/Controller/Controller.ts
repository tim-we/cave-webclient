import Model from "../Model/Model";
import * as View from "../View/View";
import { Connection } from "./IConnection";

import * as UserInput from "./UserInput";

import Server from "./Server";
import LocalTestServer from "./LocalTestServer";
import { IServerGameStateUpdate } from "./ICommunication";

var connection: Connection = new LocalTestServer(serverUpdateHandler);
var model: Model = null;

var tmp: number = 0;

window.addEventListener("load", () => {
	test();
	
	View.init(model, mainloop);

	mainloop();

	View.startDrawLoop();
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

function serverUpdateHandler(data:IServerGameStateUpdate):void {
	if (model) {
		model.updateData(data);
	}
}

function test() {
	connection.connect();

	model = new Model({
		type: "start",
		index: 0,	// player index
		time: -3,
		playerInitData: [
			{ name: "Bob", color: 0 }
		]
	});

	/*model.onUserInputChange = (pressed: boolean) => {
		connection.sendInput(pressed);
	}*/
}