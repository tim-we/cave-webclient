import Model from "./Model";
import * as View from "./View";

var ws: WebSocket;

function connect() {
	ws = new WebSocket("ws://destroids.io:8000");
}

window.addEventListener("load", () => {
	let canvas:HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("game");

	View.setCanvas(canvas);
});