import Model from "../Model/Model";
import * as View from "../View/View";
import { Connection } from "./IConnection";

import Server from "./Server";
import LocalTestServer from "./LocalTestServer";
import { ServerGameMessage } from "./ICommunication";

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
	}

	/*if (tmp++ > 42) {
		View.stopDrawLoop();
	}//*/
}

function serverUpdateHandler(data:ServerGameMessage):void {
	if (model) {
		model.updateData(data);
	}
}

function test() {
	connection.connect();

	model = new Model({
		type: 0,
		n: 1,	// number of players
		i: 0,	// player index
		t: -3,	// time
		names: ["Bob"]
	});

	/*model.onUserInputChange = (pressed: boolean) => {
		connection.sendInput(pressed);
	}*/
}