import Vector from "./Vector";

export default class Player {
	public Name: string;

	public Position: Vector;

	public PDelta: Vector;

	public PDeltaLength: number;

	public Alive: boolean;

	constructor(name: String) {
		this.Position = new Vector(0, 0);
		this.PDelta = new Vector(0, 0);
		this.PDeltaLength = 0;
		this.Alive = true;
	}

	public updateData(px: number, py: number, alive:boolean): void {
		this.PDelta.diff2d(px, py);
		this.PDeltaLength = this.PDelta.length();

		this.Alive = alive;
	}

	public move(a: number) {
		Vector.axpy(a, this.PDelta, this.Position);
	}

}