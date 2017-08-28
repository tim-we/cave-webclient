import AbstractPlayer from "./AbstractPlayer";

import Vector from "./Vector";
import Color from "../View/Color";

export default class Player extends AbstractPlayer {
	public Velocity: Vector; // vector pointing to the next position

	public Index: number; // position in the server player array

	private tmp: number = 0;

	constructor(name: String, index: number) {
		super(name, 0);

		this.Index = index;
		this.Velocity = new Vector(0, 0);
	}

	public move(a: number) {
		// move
		//Vector.axpy(a, this.Velocity, this.Position);
		this.tmp += a;
		let v = new Vector(Math.sin(0.1 * this.tmp), Math.sin(0.2 * this.tmp));
		v.scale(0.5);
		this.Position.copyFrom(v);

		super.updateTail();
	}

	protected die() {
		super.die();
	}
}