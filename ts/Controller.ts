import Model from "./Model";
import * as View from "./View";
import { Connection } from "./IConnection";

import Server from "./Server";
import LocalTestServer from "./LocalTestServer";

var connection: Connection = null;
var model: Model = null;

window.addEventListener("load", () => {
	View.init();

	test();

	mainloop();
});

function mainloop() {
	if (model) {
		View.draw(model);

		model.update();
	}

	window.requestAnimationFrame(mainloop);
}

function test() {
	connection = new LocalTestServer();

	model = new Model({
		type: 0,
		n: 1,	// number of players
		i: 0,	// player index
		t: -3,	// time
		names: ["Bob"]
	});

	model.onUserInputChange = (pressed: boolean) => {
		connection.sendInput(pressed);
	}
}