import Model from "../Model/Model";
import Matrix from "../Model/Matrix";

import * as MapRenderer from "./MapRenderer";
import * as PlayerRenderer from "./PlayerRenderer";

//declare var WebGLDebugUtils;

var gl: WebGLRenderingContext = null;
var model: Model = null;

var projMatrix: Matrix = new Matrix();
var viewMatrix: Matrix = new Matrix();
var transformMatrix: Matrix = new Matrix();

export function init(canvas: HTMLCanvasElement):void {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		//gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
	} catch (e) {
		console.warn("Error initializing webgl.");
		return;
	}

	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		return;
	}

	// map z to w
	projMatrix.setEntry(3, 2, 1.0);
	projMatrix.setEntry(3, 3, 0.0);

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
	
	updateTransformation();

	gl.clear(gl.COLOR_BUFFER_BIT);

	MapRenderer.draw(transformMatrix);
	
	model.OnlinePlayers.forEach(player => { PlayerRenderer.draw(transformMatrix, player); });
	PlayerRenderer.draw(transformMatrix, model.Player);
}

export function resize(width:number, height:number): void {
	// assume projMatrix is (scaled) identity

	if (width > height) {
		projMatrix.makeScale(height/width, 1.0, 1.0, false);
	} else {
		projMatrix.makeScale(1.0, width/height, 1.0, false);
	}

	projMatrix.setEntry(3, 2, 1.0);

	gl.viewport(0, 0, width, height);
}

function updateTransformation(): void {
	// assume model != null
	model.Camera.setViewMatrix(viewMatrix, model);
	Matrix.multiply(projMatrix, viewMatrix, transformMatrix);
}