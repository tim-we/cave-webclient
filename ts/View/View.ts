import Model from "../Model/Model";
import * as Renderer from "./Renderer";

var canvas: HTMLCanvasElement;

export function init(model:Model) {
	canvas = <HTMLCanvasElement>document.getElementById("game");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	Renderer.init(canvas);
	Renderer.setModel(model);

	window.addEventListener("resize", function () {
		let w: number = window.innerWidth;
		let h: number = window.innerHeight;

		canvas.width = w;
		canvas.height = h;

		Renderer.resize(w, h);
		Renderer.draw();
	});
}

export function draw(): void {

	
	Renderer.draw();

	//window.requestAnimationFrame(draw);
}