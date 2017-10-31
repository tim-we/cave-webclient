declare function require(name: string): any;

import { createProgramFromSource } from "./ShaderTools";
import Color from "./Color";
import AbstractPlayer from "../Model/AbstractPlayer";
import Matrix from "../Model/Matrix";
import * as TailRenderer from "./TailRenderer";
import { layerGetZ } from "./Tools";

const RADIUS: number = 0.05;

var gl: WebGLRenderingContext = null;
var buffer: WebGLBuffer = null;
var program: WebGLProgram = null;

//var vertexAttribPos: number = -1;
//var vertexAttribCSQ: number = -1;
var vertexAttribSquare: number = -1;

var uniformRadius: WebGLUniformLocation = null;
var uniformColor: WebGLUniformLocation = null;
var uniformPM: WebGLUniformLocation = null;
var uniformPos: WebGLUniformLocation = null; // player xy position
var uniformZ: WebGLUniformLocation = null; // player z position

export function init(_gl: WebGLRenderingContext):void {
	gl = _gl;

	// set up buffer
		buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	
		let data: Float32Array = new Float32Array(2 * 4);
		// set up constant data
		data[0] = -1.0; data[1] = -1.0;
		data[2] = -1.0; data[3] =  1.0;
		data[4] =  1.0; data[5] = -1.0;
		data[6] =  1.0; data[7] =  1.0;

		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	
	// program
		program = createProgramFromSource(
			gl,
			require("../../shader/player.vert"),
			require("../../shader/player.frag")
		);
	
		vertexAttribSquare = gl.getAttribLocation(program, "squareCorner");
		
		uniformRadius = gl.getUniformLocation(program, "radius");
		uniformColor = gl.getUniformLocation(program, "pColor");
		uniformPM = gl.getUniformLocation(program, "uPMatrix");
		uniformPos = gl.getUniformLocation(program, "playerPosition");
		uniformZ = gl.getUniformLocation(program, "zPos");
	
	// set up tail renderer
	TailRenderer.init(_gl);
}

export function draw(transform: Matrix, player: AbstractPlayer, time?:number) {
	TailRenderer.draw(transform, player);

	if (!player.Alive) { return; }

	gl.useProgram(program);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

	// needs to be done for every webgl program switch
	gl.enableVertexAttribArray(vertexAttribSquare);

	gl.vertexAttribPointer(vertexAttribSquare, 2, gl.FLOAT, false, 2 * 4, 0);
	
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // additive blending

	// do not change (keep) stencil values
	gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
	// do not draw on background (0) ("inside the map")
	// 0 < value
	gl.stencilFunc(gl.LESS, 0, 0xFF);

	let radius: number = RADIUS;

	// pulse effect for THE player
	if (player.Layer === 0) { radius += + 0.005 * (1.0 + Math.cos(5.0 * time)); }

	transform.uniform(gl, uniformPM);
	gl.uniform1f(uniformZ, layerGetZ(player.Layer));
	gl.uniform1f(uniformRadius, radius);
	player.Position.uniform(gl, uniformPos);
	player.Color.setUniform4(gl, uniformColor);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // 2 triangles
}