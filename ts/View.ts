import Model from "./Model";
import * as Renderer from "./Renderer";

var canvas: HTMLCanvasElement;

export function init(model:Model) {
	canvas = <HTMLCanvasElement>document.getElementById("game");

	Renderer.init(canvas);
	Renderer.setModel(model);
}

export function draw(): void {

	
	Renderer.draw();
}