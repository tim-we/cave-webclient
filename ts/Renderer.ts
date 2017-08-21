import { createProgramFromSource } from "./ShaderTools";
import Model from "./Model";
import Matrix from "./Matrix";

declare function require(name: string): any;

var gl: WebGLRenderingContext = null;
var model: Model = null;

var mapBuffer: WebGLBuffer = null;
var mapProgram: WebGLProgram = null;
var mapVertexPosAttrib: number = null;

var projMatrix: Matrix = new Matrix();
var pMUniform: WebGLUniformLocation = null;

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

	mapBuffer = gl.createBuffer();

	// map program
		mapProgram = createProgramFromSource(
			gl,
			require("../shader/map.vert"),
			require("../shader/map.frag")
		);

		mapVertexPosAttrib = gl.getAttribLocation(mapProgram, "aVertexPosition");
		gl.enableVertexAttribArray(mapVertexPosAttrib);

		pMUniform = gl.getUniformLocation(mapProgram, "uPMatrix");

	gl.clearColor(0.0, 1.0, 0.0, 1.0);
}

export function setModel(m: Model) {
	model = m;
}

export function draw() {
	if (model === null) { return; }

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(mapProgram);

	gl.bindBuffer(gl.ARRAY_BUFFER, mapBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, model.Map.data, gl.STREAM_DRAW);
	
	gl.vertexAttribPointer(mapVertexPosAttrib, 3, gl.FLOAT, false, 0, 0);

	projMatrix.uniform(gl, pMUniform);
	gl.drawArrays(gl.TRIANGLES, 0, model.Map.numTriangles()); // TRIANGLE_STRIP is more efficient
	// https://en.wikipedia.org/wiki/Triangle_strip

	//gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	//setMatrixUniforms();
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	/* draw the tail:
	 * var buffer = gl.createBuffer();
	 * gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	 * gl.bufferData(gl.ARRAY_BUFFER, player.Tail.buffer, gl.STATIC_DRAW);
	 */
}