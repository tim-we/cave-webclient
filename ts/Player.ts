import Vector from "./Vector";

export default class Player {
	public Name: string;

	public Position: Vector;

	public PDelta: Vector;

	public PDeltaLength: number;

	constructor(name: String) {
		this.Position = new Vector(0, 0);
		this.PDelta = new Vector(0, 0);
		this.PDeltaLength = 0;
	}

	public updateData(px: number, py: number): void {
		this.PDelta.diff2d(px, py);
		this.PDeltaLength = this.PDelta.length();
	}

	public move(a: number) {
		Vector.axpy(a, this.PDelta, this.Position);
	}

}