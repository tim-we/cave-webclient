import AbstractPlayer from "./AbstractPlayer";

import Vector from "./Vector";
import Color from "../View/Color";

export default class OnlinePlayer extends AbstractPlayer {

	public PDelta: Vector; // vector pointing to the next position
	public PDeltaLength: number;

	constructor(name: String, zPos: number) {
		super(name, zPos);

		this.PDelta = new Vector(0, 0);
		this.PDeltaLength = 0;
	}

	public updateData(px: number, py: number, alive:boolean): void {
		this.PDelta.diff2d(px, py);
		this.PDeltaLength = this.PDelta.length();

		if (this.Alive && !alive) { super.die(); }
	}

	public move(a: number) {
		// move
		Vector.axpy(a, this.PDelta, this.Position);

		this.updateTail();
	}

}