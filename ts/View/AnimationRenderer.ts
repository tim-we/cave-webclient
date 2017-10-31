declare function require(name: string): any;

import { createProgramFromSource, ProgramContainer } from "./ShaderTools";
import { layerGetZ } from "./Tools";
import { Animation, DeathExplosion } from "../Model/Animations";
import Matrix from "../Model/Matrix";

var gl: WebGLRenderingContext = null;

var deathAnimationProgram: ProgramContainer = null;

export function init(_gl: WebGLRenderingContext):void {
	gl = _gl;

	// create program
	deathAnimationProgram = new ProgramContainer(
		gl,
		createProgramFromSource(
			gl,
			require("../../shader/animations/death.vert"),
			require("../../shader/animations/death.frag")
		),
		gl.LINES,
		2
	);

	// set vertex attribs
	deathAnimationProgram.addVertexAttrib("alpha", 1, 0);
	deathAnimationProgram.addVertexAttrib("d", 1, 1);
	
	// get uniforms
	deathAnimationProgram.addUniforms(["progress", "uCenter", "uZ", "uPMatrix"]);
}

export function render(a: Animation, matrix:Matrix): void {
	if (a instanceof DeathExplosion) {
		renderDeathAnim(a, matrix);
	} else {
		console.warn("Animation: View Missing");
	}
}

function renderDeathAnim(a: DeathExplosion, matrix:Matrix) {
	let p: ProgramContainer = deathAnimationProgram;
	p.use();
	p.bufferData(a.Data);
	p.setUpVertexAttrib();
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // normal blending

	// do not change (keep) stencil values
	gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
	// do not draw on background (0) ("inside the map")
	// 0 < value
	gl.stencilFunc(gl.LESS, 0, 0xFF);

	// set uniforms
	gl.uniform1f(p.getUniform("progress"), a.getProgress());
	a.Player.Position.uniform(gl, p.getUniform("uCenter"));
	gl.uniform1f(p.getUniform("uZ"), layerGetZ(a.Player.Layer));
	matrix.uniform(gl, p.getUniform("uPMatrix"));

	p.draw(2*a.getN());
}