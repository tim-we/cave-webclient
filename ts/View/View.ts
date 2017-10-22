import * as Model from "../Model/Model";
import Game from "../Model/Game";
import * as Renderer from "./Renderer";
import * as FPS from "./FPS";

var canvas: HTMLCanvasElement;
var drawAgain: boolean = false;
var afterDraw: () => void;

export function init(afterDrawHook:() => void) {
	canvas = <HTMLCanvasElement>document.getElementById("game");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	afterDraw = afterDrawHook;

	Renderer.init(canvas);

	window.addEventListener("resize", function () {
		let w: number = window.innerWidth;
		let h: number = window.innerHeight;

		canvas.width = w;
		canvas.height = h;

		Renderer.resize(w, h);
		//if (!drawAgain) { Renderer.draw(); }
	});

	FPS.enable();
}

export function notifyGameChanged(): void {
	Renderer.setGame(Model.getGame());
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

	FPS.frame();

	afterDraw();
}