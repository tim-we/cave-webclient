declare function require(name: string): any;

import { createProgramFromSource } from "./ShaderTools";
import { Transition, CircleReveal } from "../Model/Transitions";

var gl: WebGLRenderingContext = null;
var buffer: WebGLBuffer = null;
var program: WebGLProgram = null;
var vertexPosAttrib: number = -1;

var uniformTarget: WebGLUniformLocation = null;
var uniformProgress: WebGLUniformLocation = null;
var uniformRatio: WebGLUniformLocation = null;

export function init(_gl: WebGLRenderingContext) {
	gl = _gl;

	// create program
	program = createProgramFromSource(
		gl,
		require("../../shader/transitions/circlereveal.vert"),
		require("../../shader/transitions/circlereveal.frag")
	);

	// get vertex attrib location
	vertexPosAttrib = gl.getAttribLocation(program, "aPosition");

	// get uniform locations
	uniformTarget = gl.getUniformLocation(program, "uPosition");
	uniformProgress = gl.getUniformLocation(program, "progress");
	uniformRatio = gl.getUniformLocation(program, "aspectRatio");

	// init vertex buffer
	buffer = gl.createBuffer();
	let data = new Float32Array(4 * 2);
	data[0] = -1.0; data[1] = -1.0;
	data[2] = -1.0; data[3] =  1.0;
	data[4] =  1.0; data[5] = -1.0;
	data[6] =  1.0; data[7] =  1.0;

	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
}

export function draw(transition: Transition): void {
	if (transition instanceof CircleReveal) {
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
		gl.useProgram(program);
		gl.enableVertexAttribArray(vertexPosAttrib);
		gl.vertexAttribPointer(vertexPosAttrib, 2, gl.FLOAT, false, 2 * 4, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	
		// no stencil
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
		gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
	
		// send uniforms
		gl.uniform2f(uniformTarget, transition.x, transition.y);
		gl.uniform1f(uniformProgress, transition.getProgress());
		gl.uniform1f(uniformRatio, gl.drawingBufferHeight / gl.drawingBufferWidth);
		
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // 2 triangles

		gl.disable(gl.BLEND);
	}
}