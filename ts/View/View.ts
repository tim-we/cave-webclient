import Model from "../Model/Model";
import * as Renderer from "./Renderer";

var canvas: HTMLCanvasElement;
var drawAgain: boolean = false;
var afterDraw: () => void;

export function init(model:Model, afterDrawHook:() => void) {
	canvas = <HTMLCanvasElement>document.getElementById("game");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	afterDraw = afterDrawHook;

	Renderer.init(canvas);
	Renderer.setModel(model);

	window.addEventListener("resize", function () {
		let w: number = window.innerWidth;
		let h: number = window.innerHeight;

		canvas.width = w;
		canvas.height = h;

		Renderer.resize(w, h);
		if (!drawAgain) { Renderer.draw(); }
	});
}

export function startDrawLoop(drawLoop:boolean = true) {
	drawAgain = drawLoop;
	draw();
}

export function stopDrawLoop() {
	drawAgain = false;
}

function draw(): void {
	Renderer.draw();

	if (drawAgain) {
		window.requestAnimationFrame(draw);
	}

	afterDraw();
}