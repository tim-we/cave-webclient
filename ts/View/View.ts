import Model from "../Model/Model";
import * as Renderer from "./Renderer";

var canvas: HTMLCanvasElement;

export function init(model:Model) {
	canvas = <HTMLCanvasElement>document.getElementById("game");

	Renderer.init(canvas);
	Renderer.setModel(model);

	document.addEventListener("resize", function () {
		Renderer.resize();
	});
}

export function draw(): void {

	
	Renderer.draw();
}