import Model from "../Model/Model";
import * as View from "../View/View";
import { Connection } from "./IConnection";

import * as UserInput from "./UserInput";

import Server from "./Server";
import LocalTestServer from "./LocalTestServer";
import { IServerGameStateUpdate, IServerGameStart } from "./ICommunication";

var connection: Connection = new LocalTestServer();
var model: Model = null;

//var tmp: number = 0;
var tmpStart:number;

window.addEventListener("load", () => {

	connection.connect().then(() => {
		return connection.waitForStart();
	}).then((data:IServerGameStart) => {
		console.log("Starting game!");

		model = new Model(data);
		tmpStart = Date.now();

		View.init(model, mainloop);

		mainloop();
		
		View.startDrawLoop();
	});
	
});

function mainloop() {
	if (model) {
		model.update();

		if (model.Player.Alive) {
			model.Player.Force = UserInput.isPressed();
		}

		//TODO: remove this tmp code
		model.updateData({
			type: "state",
			time: Date.now() - tmpStart,
			pdata: [{
				pos: { x: 0, y: 0 },
				vel: { x: 0, y: 0 },
				alv: true
			}],
			rotation: 0
		});
	}

	/*if (tmp++ > 42) {
		View.stopDrawLoop();
	}//*/
}