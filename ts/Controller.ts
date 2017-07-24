import Model from "./Model";
import * as View from "./View";

var ws: WebSocket = null;
var model: Model = null;

function connect() {
	ws = new WebSocket("ws://destroids.io:8000");
}

window.addEventListener("load", () => {
	View.init();

	test();
});

function mainloop() {
	if (model) {
		View.draw(model);

		model.update();
	}

	window.requestAnimationFrame(mainloop);
}

function test() {
	model = new Model({
		type: 0,
		n: 1,
		i: 0,
		t: -3,
		names: ["Bob"]
	});
}