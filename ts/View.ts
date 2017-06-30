var webgl = null;

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

export function start():void {
	draw();
}

function draw():void {
	window.requestAnimationFrame(draw);
}