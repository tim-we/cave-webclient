import Vector from "./Vector";
import Color from "../View/Color";

export const TAILLENGTH = 42;
const TAILNODESIZE = 2 * (2 + 1);
const TAILWIDTH = 0.01;

var tmp1: Vector = new Vector();
var tmp2: Vector = new Vector();

export default class Player {
	public Name: string;
	public Color: Color = new Color(0.0, 0.5, 1.0);

	public Position: Vector; // current (interpolated) position
	private PreviousPosition: Vector;
	public Z: number;

	public PDelta: Vector; // vector pointing to the next position
	public PDeltaLength: number;

	public Alive: boolean;

	public Tail: Float32Array; /*
		TRIANGLE_STRIP data
		- point right + intensity
		- point left + intensity
	
		=> 2 * (2 + 1) = 6 floats per "tail point"
	*/

	constructor(name: String, zPos:number) {
		this.Position = new Vector(0, 0);
		this.PreviousPosition = this.Position.clone();
		this.Z = zPos;
		this.PDelta = new Vector(0, 0);
		this.PDeltaLength = 0;
		this.Alive = true;

		this.Tail = new Float32Array(TAILLENGTH * TAILNODESIZE);

		let h: number = 1.0 / (TAILLENGTH - 1);

		for (let i = 0; i < TAILLENGTH; i++) {
			this.Tail[i * TAILNODESIZE + 2] = i * h;
			this.Tail[i * TAILNODESIZE + 5] = i * h;
		}
	}

	public updateData(px: number, py: number, alive:boolean): void {
		this.PDelta.diff2d(px, py);
		this.PDeltaLength = this.PDelta.length();

		if (this.Alive && !alive) { this.die(); }
	}

	public move(a: number) {
		// move
		Vector.axpy(a, this.PDelta, this.Position);

		this.updateTail();

		this.PreviousPosition.copyFrom(this.Position);
	}

	private updateTail() {
		tmp1.copyFrom(this.Position);
		Vector.axpy(-1, this.PreviousPosition, tmp1);
		tmp1.ortho(tmp1);
		
		tmp1.scale(1.0 / tmp1.length());

		shiftTailData(this.Tail);
		// shift tail points (keep intensities)

		let n: number = this.Tail.length - 1;

		Vector.axpy(TAILWIDTH, tmp1, this.Position, tmp2);
		this.Tail[n - 2] = tmp2.getX();
		this.Tail[n - 1] = tmp2.getY();

		Vector.axpy(-TAILWIDTH, tmp1, this.Position, tmp2);
		this.Tail[n - 5] = tmp2.getX();
		this.Tail[n - 4] = tmp2.getY();
	}

	private die() {
		this.Alive = false;
	}

	public static getTailVertexCount(): number{
		return TAILLENGTH * 2;
	}

}

function shiftTailData(data: Float32Array | Float64Array): void {
	let i: number; // index
	let j: number; // new index
	
	for (let k = 1; k < TAILLENGTH; k++) {
		i = k * TAILNODESIZE;
		j = i - TAILNODESIZE;

		data[j + 0] = data[i + 0];
		data[j + 1] = data[i + 1];

		data[j + 3] = data[i + 3];
		data[j + 4] = data[j + 4];
	}
}