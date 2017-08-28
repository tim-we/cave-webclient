import Vector from "./Vector";
import Color from "../View/Color";

export const TAILLENGTH = 80;
const TAILNODESIZE = 2 * (2 + 1);
const TAILWIDTH = 0.005;

var tmp1: Vector = new Vector();
var tmp2: Vector = new Vector();

export default abstract class AbstractPlayer {
	public Name: string;
	public Color: Color = new Color(0.0, 0.5, 1.0);

	public Position: Vector; // current (interpolated) position
	private PreviousPosition: Vector;
	public Z: number;

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
		this.Alive = true;

		this.Tail = new Float32Array(TAILLENGTH * TAILNODESIZE);

		let h: number = 1.0 / (TAILLENGTH - 1);

		for (let i = 0; i < TAILLENGTH; i++) {
			this.Tail[i * TAILNODESIZE + 2] = i * h;
			this.Tail[i * TAILNODESIZE + 5] = i * h;
		}
	}

	public abstract move(a: number);

	protected updateTail() {
		// tmp1 = this.Position - this.PreviousPosition
		Vector.axpy2(-1, this.PreviousPosition, this.Position, tmp1);
		tmp1.ortho(tmp1);
		
		tmp1.scale(1.0 / tmp1.length());

		shiftTailData(this.Tail);
		// shift tail points (keep intensities)

		let n: number = this.Tail.length;

		// right point
		Vector.axpy2(TAILWIDTH, tmp1, this.Position, tmp2);
		this.Tail[n - 6] = tmp2.getX();
		this.Tail[n - 5] = tmp2.getY();

		// left point
		Vector.axpy2(-TAILWIDTH, tmp1, this.Position, tmp2);
		this.Tail[n - 3] = tmp2.getX();
		this.Tail[n - 2] = tmp2.getY();

		// update previous position
		this.PreviousPosition.copyFrom(this.Position);
	}

	protected die() {
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
		data[j + 4] = data[i + 4];
	}
}