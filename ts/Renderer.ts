import { createProgramFromSource } from "./ShaderTools";

declare function require(name: string): any;

var gl: WebGLRenderingContext = null;

export function init(canvas: HTMLCanvasElement):void {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch (e) {
		console.warn("Error initializing webgl.");
	}

	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		return;
	}

	let p: WebGLProgram = createProgramFromSource(
		gl,
		require("../shader/map.vert"),
		require("../shader/map.frag")
	);
}

export function draw() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	//gl.bindBuffer(gl.ARRAY_BUFFER, model.Map.VertexBuffer);
	//gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	//setMatrixUniforms();
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	/* draw the tail:
	 * var buffer = gl.createBuffer();
	 * gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	 * gl.bufferData(gl.ARRAY_BUFFER, player.Tail.buffer, gl.STATIC_DRAW);
	 */
}