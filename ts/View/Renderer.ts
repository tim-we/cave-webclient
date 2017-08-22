//import { createProgramFromSource } from "./ShaderTools";
import Model from "../Model/Model";
import Matrix from "../Model/Matrix";

import * as MapRenderer from "./MapRenderer";

//declare function require(name: string): any;

var gl: WebGLRenderingContext = null;
var model: Model = null;

var projMatrix: Matrix = new Matrix();

export function init(canvas: HTMLCanvasElement):void {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch (e) {
		console.warn("Error initializing webgl.");
		return;
	}

	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		return;
	}

	resize();

	// init map renderer
	MapRenderer.init(gl);
	
}

export function setModel(m: Model) {
	model = m;
}

export function draw() {
	if (model === null) { return; }
	
	MapRenderer.draw(projMatrix);

	//gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	//setMatrixUniforms();
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	/* draw the tail:
	 * var buffer = gl.createBuffer();
	 * gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	 * gl.bufferData(gl.ARRAY_BUFFER, player.Tail.buffer, gl.STATIC_DRAW);
	 */
}

export function resize(): void {
	let w: number = gl.drawingBufferWidth;
	let h: number = gl.drawingBufferHeight;
	
	// assume projMatrix is (scaled) identity

	if (w > h) {
		projMatrix.makeScale(h/w, 1.0, 1.0, false);
	} else {
		projMatrix.makeScale(1.0, w/h, 1.0, false);
	}
}