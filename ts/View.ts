import Model from "./Model";
import * as Renderer from "./Renderer";

var canvas: HTMLCanvasElement;

export function init() {
	//Renderer.init();
	canvas = <HTMLCanvasElement>document.getElementById("game");

	Renderer.init(canvas);
}

export function draw(model:Model): void {

	
	Renderer.draw();
}