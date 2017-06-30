import Model from "./Model";

var webgl: WebGLRenderingContext = null;
var model: Model = null;

export function setCanvas(canvas: HTMLCanvasElement):void {
	try {
		webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch (e) {
		console.warn("Error initializing webgl.");
	}

	if (!webgl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}
}

export function start(m: Model): void {
	model = m;
	draw();
}

export function stop(): void {
	model = null;
}

function draw(): void {
	if (!model) { return; }

	let gl:WebGLRenderingContext = webgl;
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.Map.VertexBuffer);
	//gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	//setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	window.requestAnimationFrame(draw);
}