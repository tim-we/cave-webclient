import * as Config from "../Model/Config";
import * as Model from "../Model/Model";
import Game from "../Model/Game";
import Matrix from "../Model/Matrix";

import * as MapRenderer from "./MapRenderer";
import * as PlayerRenderer from "./PlayerRenderer";
import * as TransitionRenderer from "./TransitionRenderer";
import * as FX from "./FXRenderer";
import * as AnimationRenderer from "./AnimationRenderer";

//declare var WebGLDebugUtils;
const glOptions = {
	alpha: false,
	stencil: true,
	depth: false,
	antialias: true
};

var gl: WebGLRenderingContext = null;
var game: Game = null;

var projMatrix: Matrix = new Matrix();
var viewMatrix: Matrix = new Matrix();
var transformMatrix: Matrix = new Matrix();

export function init(canvas: HTMLCanvasElement): void {
	glOptions.antialias = Config.get<boolean>("antialias");
	
	try {
		gl = <WebGLRenderingContext>(canvas.getContext("webgl", glOptions) || canvas.getContext("experimental-webgl", glOptions));
		//gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
	} catch (e) {
		console.warn("Error initializing webgl.");
		console.error(e);
		return;
	}

	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		return;
	}

	let contextAttributes = gl.getContextAttributes();

	gl.enable(gl.BLEND);

	// set up stencil
	console.assert(contextAttributes.stencil, "WebGL: stencil not available!");
	gl.enable(gl.STENCIL_TEST);
	// start with stencil value 0
	gl.clearStencil(0);

	// set up projection matrix (map z to w)
	projMatrix.setEntry(3, 2, 1.0);
	projMatrix.setEntry(3, 3, 0.0);
	resize(window.innerWidth, window.innerHeight);

	// init renderers
	MapRenderer.init(gl);
	PlayerRenderer.init(gl);
	TransitionRenderer.init(gl);
	if (Config.get<boolean>("fx")) { FX.init(gl); }
	AnimationRenderer.init(gl);
}

export function setGame(g: Game) {
	game = g;
	MapRenderer.setMap(game.Map);
}

export function draw() {
	if (game === null) { return; }
	
	updateTransformation();

	// MapRenderer will clear color & stencil buffer

	MapRenderer.draw(transformMatrix);
	
	game.OnlinePlayers.forEach(player => { PlayerRenderer.draw(transformMatrix, player); });
	PlayerRenderer.draw(transformMatrix, game.Player, game.Time);

	// render animations
	game.Animations.get().forEach(a => AnimationRenderer.render(a, transformMatrix));

	// handle transition
	let t;
	if (t = Model.getTransition()) {
		TransitionRenderer.draw(t);
	}

	if (Config.get<boolean>("fx")) {
		let d: number = game.getDanger();
		if (d > 0.0) {
			FX.danger(d);
		}
	}
}

export function resize(width:number, height:number): void {
	// assume projMatrix is (scaled) identity

	if (width > height) {
		projMatrix.makeScale(height/width, 1.0, 1.0, false);
	} else {
		projMatrix.makeScale(1.0, width/height, 1.0, false);
	}

	projMatrix.setEntry(3, 2, 1.0);

	gl.viewport(0, 0, width, height);
}

function updateTransformation(): void {
	// assume model != null
	game.Camera.setViewMatrix(viewMatrix);
	Matrix.multiply(projMatrix, viewMatrix, transformMatrix);
}