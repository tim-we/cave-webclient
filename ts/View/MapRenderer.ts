declare function require(name: string): any;

import { createProgramFromSource } from "./ShaderTools";
import Color from "./Color";
import Map from "../Model/Map";
import Matrix from "../Model/Matrix";

var data: Map = null;
var bufferVersion: number = -1;

var gl: WebGLRenderingContext = null;
var buffer: WebGLBuffer = null;
var program: WebGLProgram = null;
var vertexPosAttrib: number = -1;
var uniformPM: WebGLUniformLocation = null;
var uniformZ: WebGLUniformLocation = null;

var bgColor: Color = new Color(0.0, 1.0, 0.42);

export function init(_gl:WebGLRenderingContext) {
	gl = _gl;

	// map buffer
		buffer = gl.createBuffer();

	// map program
		program = createProgramFromSource(
			gl,
			require("../../shader/map.vert"),
			require("../../shader/map.frag")
		);
	
		gl.useProgram(program);
	
		vertexPosAttrib = gl.getAttribLocation(program, "vPosition");

		uniformPM = gl.getUniformLocation(program, "uPMatrix");
		uniformZ = gl.getUniformLocation(program, "zPos");
}

export function setModelMap(map:Map) {
	data = map;
	bufferVersion = -1;
	updateBuffer();
}

function updateBuffer() {
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data.data, gl.STREAM_DRAW);

	bufferVersion = data.version;
}

export function draw(proj:Matrix): void {
	// background color
	bgColor.setClearColor(gl);

	gl.clear(gl.COLOR_BUFFER_BIT);

	// do we have data to draw?
	if (!data) { return; }

	gl.useProgram(program);
	gl.enableVertexAttribArray(vertexPosAttrib);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);

	// send projection matrix to GPU
	proj.uniform(gl, uniformPM);
	
	// set z position
	gl.uniform1f(uniformZ, 0.5);

	gl.drawArrays(gl.TRIANGLES, 0, 3 * data.numTriangles());

	if (bufferVersion < data.version) {
		// map data has been updated -> update buffer (after draw is complete)
		setTimeout(updateBuffer, 0);
	}
}