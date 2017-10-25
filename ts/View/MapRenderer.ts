declare function require(name: string): any;

import { createProgramFromSource } from "./ShaderTools";
import Color from "./Color";
import Map from "../Model/Map";
import Matrix from "../Model/Matrix";
import { layerGetZ } from "./Tools";

const NUM_LAYERS: number = 8;
const BLENDFACTOR: number = .37;

var data: Map = null;
var bufferVersion: number = -1;

var gl: WebGLRenderingContext = null;
var buffer: WebGLBuffer = null;
var program: WebGLProgram = null;
var vertexPosAttrib: number = -1;

var uniformPM: WebGLUniformLocation = null;
var uniformZ: WebGLUniformLocation = null;
var uniformBlend: WebGLUniformLocation = null;

var bgColor: Color = new Color(0.0, 0.6, 0.05);

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

		uniformPM = gl.getUniformLocation(program, "uPMatrix");
		uniformZ = gl.getUniformLocation(program, "zPos");
		uniformBlend = gl.getUniformLocation(program, "blendFactor");
}

export function setMap(map:Map) {
	data = map;
	bufferVersion = -1;
	updateBuffer();
}

function updateBuffer() {
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	// TODO: STREAM_DRAW vs STATIC_DRAW
	gl.bufferData(gl.ARRAY_BUFFER, data.data, gl.STATIC_DRAW);

	bufferVersion = data.version;
}

export function draw(proj:Matrix): void {
	// background color
	bgColor.setClearColor(gl);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

	// do we have data to draw?
	if (!data) { return; }

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.useProgram(program);
	gl.enableVertexAttribArray(vertexPosAttrib);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
	
	// increment stencil value if stencil test passes
	gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);

	for(let i=0; i<NUM_LAYERS; i++) {
		drawLayer(i, proj);
	}

	if (bufferVersion < data.version) {
		// map data has been updated -> update buffer (after draw is complete)
		setTimeout(updateBuffer, 1);
	}
}

function drawLayer(index: number, proj: Matrix): void {
	// only draw (&increment stencil) where stencil value is `index`
	gl.stencilFunc(gl.LEQUAL, index, 0xFF);

	// send z position
	gl.uniform1f(uniformZ, layerGetZ(index));

	// send projection matrix to GPU
	proj.uniform(gl, uniformPM);

	// send blend factor (last layer solid)
	gl.uniform1f(uniformBlend, (index+1 === NUM_LAYERS) ? 1.0 : BLENDFACTOR);

	gl.drawArrays(gl.TRIANGLES, 0, 3 * data.numTriangles());
}