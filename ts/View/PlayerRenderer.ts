declare function require(name: string): any;

import { createProgramFromSource } from "./ShaderTools";
import Color from "./Color";
import Player from "../Model/Player";
import Matrix from "../Model/Matrix";

const RADIUS: number = 0.04;

var gl: WebGLRenderingContext = null;
var buffer: WebGLBuffer = null;
var program: WebGLProgram = null;
var vertexAttribPos: number = -1;
var vertexAttribCSQ: number = -1;

var color: Color = new Color(1.0, 1.0, 1.0);

var uniformColor: WebGLUniformLocation = null;
var uniformPM: WebGLUniformLocation = null;
var uniformZ: WebGLUniformLocation = null;

var data: Float32Array = new Float32Array(4 * 4);

export function init(_gl: WebGLRenderingContext) {
	gl = _gl;

	// set up buffers
		buffer = gl.createBuffer();
		// TODO: create tail buffer
	
	// program
		program = createProgramFromSource(
			gl,
			require("../../shader/player.vert"),
			require("../../shader/player.frag")
		);
	
		vertexAttribPos = gl.getAttribLocation(program, "vPosition");
		gl.enableVertexAttribArray(vertexAttribPos);
		vertexAttribCSQ = gl.getAttribLocation(program, "csqPosition");
		gl.enableVertexAttribArray(vertexAttribCSQ);
		
		uniformColor = gl.getUniformLocation(program, "pColor");
		uniformPM = gl.getUniformLocation(program, "uPMatrix");
		uniformZ = gl.getUniformLocation(program, "zPos");
	
	// set up constant data
		data[2] = -1.0; data[3] = -1.0;
		data[6] = -1.0; data[7] = 1.0;
		data[10] = 1.0; data[11] = -1.0;
		data[14] = 1.0; data[15] = 1.0;
}

function setUpBuffer(player: Player) {
	let x: number = player.Position.getX();
	let y: number = player.Position.getY();

	data[0] = x - RADIUS; data[1] = y - RADIUS;
	data[4] = x - RADIUS; data[5] = y + RADIUS;
	data[8] = x + RADIUS; data[9] = y - RADIUS;
	data[12] = x + RADIUS; data[13] = y + RADIUS;

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);
}

export function draw(proj:Matrix, player:Player) {
	gl.useProgram(program);
	
	setUpBuffer(player);
	
	gl.vertexAttribPointer(vertexAttribPos, 2, gl.FLOAT, false, 4 * 4, 0);
	gl.vertexAttribPointer(vertexAttribCSQ, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	proj.uniform(gl, uniformPM);
	gl.uniform1f(uniformZ, player.Z);
	color.setUniform(gl, uniformColor);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // 2 triangles

	gl.disable(gl.BLEND);
}