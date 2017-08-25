//import { createProgramFromSource } from "./ShaderTools";
import Model from "../Model/Model";
import Matrix from "../Model/Matrix";

import * as MapRenderer from "./MapRenderer";
import * as PlayerRenderer from "./PlayerRenderer";

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

	resize(window.innerWidth, window.innerHeight);

	// init map renderer
	MapRenderer.init(gl);
	PlayerRenderer.init(gl);
}

export function setModel(m: Model) {
	model = m;
	MapRenderer.setModelMap(model.Map);
}

export function draw() {
	if (model === null) { return; }
	
	MapRenderer.draw(projMatrix);
	
	model.Players.forEach(player => { PlayerRenderer.draw(projMatrix, player); });

	//gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	//setMatrixUniforms();
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	/* draw the tail:
	 * var buffer = gl.createBuffer();
	 * gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	 * gl.bufferData(gl.ARRAY_BUFFER, player.Tail.buffer, gl.STATIC_DRAW);
	 */
}

export function resize(width:number, height:number): void {
	// assume projMatrix is (scaled) identity

	if (width > height) {
		projMatrix.makeScale(height/width, 1.0, 1.0, false);
	} else {
		projMatrix.makeScale(1.0, width/height, 1.0, false);
	}

	gl.viewport(0, 0, width, height);
}