import Vector from "./Vector";

export const TAILLENGTH = 42;

export default class Player {
	public Name: string;

	public Position: Vector;
	public Z: number;

	public PDelta: Vector;

	public PDeltaLength: number;

	public Alive: boolean;

	public Tail: Float32Array;

	constructor(name: String, zPos:number) {
		this.Position = new Vector(0, 0);
		this.Z = zPos;
		this.PDelta = new Vector(0, 0);
		this.PDeltaLength = 0;
		this.Alive = true;
		this.Tail = new Float32Array(TAILLENGTH * 3);
	}

	public updateData(px: number, py: number, alive:boolean): void {
		this.PDelta.diff2d(px, py);
		this.PDeltaLength = this.PDelta.length();

		this.Alive = alive;
	}

	public move(a: number) {
		// move
		Vector.axpy(a, this.PDelta, this.Position);

		// update tail
		typedArrayUnshift(this.Tail, 3);
		this.Tail[0] = this.Position.getX();
		this.Tail[1] = this.Position.getY();
		this.Tail[2] = this.Z;
	}

}

// shifts all elements by k (newIndex = oldIndex + k)
// does not change the first k elements
function typedArrayUnshift(arr: Float32Array | Float64Array, k:number) {
	// assert(arr.length >= k)
	
	let n: number = arr.length;

	let p; // previous element index
	let i; // arr index
	let j; // sub element index

	for (i = n - k; i > 0; i -= k) {
		p = i - k;
		// assert p >= 0

		for (j = 0; j < k; j++) {
			arr[i + j] = arr[p + j];
		}
	}
}