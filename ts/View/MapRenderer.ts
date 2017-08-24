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

		vertexPosAttrib = gl.getAttribLocation(program, "vPosition");
		gl.enableVertexAttribArray(vertexPosAttrib);

		uniformPM = gl.getUniformLocation(program, "uPMatrix");
		uniformZ = gl.getUniformLocation(program, "zPos");
	
	//gl.useProgram(program);
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
	//gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// do we have data to draw?
	if (!data) { return; }

	gl.useProgram(program);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	// do we have to do this for every frame?
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