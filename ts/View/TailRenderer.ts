declare function require(name: string): any;

import { createProgramFromSource } from "./ShaderTools";
import Color from "./Color";
import AbstractPlayer from "../Model/AbstractPlayer";
import Matrix from "../Model/Matrix";
import { layerGetZ } from "./Tools";

var gl: WebGLRenderingContext = null;
var buffer: WebGLBuffer = null;
var program: WebGLProgram = null;

var vertexAttribPos: number = -1;
var vertexAttribPow: number = -1;

var uniformColor: WebGLUniformLocation = null;
var uniformPM: WebGLUniformLocation = null;
var uniformZ: WebGLUniformLocation = null;

export function init(_gl: WebGLRenderingContext): void {
	gl = _gl;

	// set up buffer
	buffer = gl.createBuffer();

	// program
	program = createProgramFromSource(
		gl,
		require("../../shader/tail.vert"),
		require("../../shader/tail.frag")
	);

	// attributes
	vertexAttribPos = gl.getAttribLocation(program, "vPosition");
	vertexAttribPow = gl.getAttribLocation(program, "vIntensity");

	// uniforms
	uniformColor = gl.getUniformLocation(program, "pColor");
	uniformPM = gl.getUniformLocation(program, "uPMatrix");
	uniformZ = gl.getUniformLocation(program, "zPos");
}

export function draw(transform: Matrix, player: AbstractPlayer): void {

	gl.useProgram(program);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, player.Tail, gl.STREAM_DRAW);

	gl.enableVertexAttribArray(vertexAttribPos);
	gl.enableVertexAttribArray(vertexAttribPow);

	gl.vertexAttribPointer(vertexAttribPos, 2, gl.FLOAT, false, 3 * 4, 0);
	gl.vertexAttribPointer(vertexAttribPow, 1, gl.FLOAT, false, 3 * 4, 2 * 4);

	// do not change (keep) stencil values
	gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
	// do not draw on background (0) ("inside the map")
	gl.stencilFunc(gl.LESS, 0, 0xFF);

	transform.uniform(gl, uniformPM);
	gl.uniform1f(uniformZ, layerGetZ(player.Layer));
	player.Color.setUniform4(gl, uniformColor);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, AbstractPlayer.getTailVertexCount());
}