const N: number = 42;
const Z: number = 0;

export default class Map {
	public Segments: Segment[];

	constructor() {
		// fixed sized array
		this.Segments = new Array(N);
		Object.seal(this.Segments);

		for (let i = 0; i < N; i++) {
			this.Segments[i] = new Segment();
		}

	}

	public update(data: Float32Array):void {
		let n: number = data.length / 8; // 2 * 4 (2D * |Segment Corners|)

		console.assert(n < N);

		let tmp: Segment[] = new Array(n);
		Object.seal(tmp);

		let i;

		// save for later reuse
		for (i = 0; i < n; i++) {
			tmp[i] = this.Segments[i];
		}

		// shift
		for (i = 0; i + n < N; i++) {
			this.Segments[i] = this.Segments[i + n];
		}

		// add/update new
		for (i = 0; i < n; i++) {
			tmp[i].set(data, i * 8);
			this.Segments[N - n + i] = tmp[i];
		}
	}
}

class Segment {
	public data: Float32Array;

	public Height: number = 0.0;

	constructor() {
		this.data = new Float32Array(3 * 3 * 2); // 2 Triangles
	}

	public set(data:Float32Array, offset:number = 0): void {
		console.assert(offset + 4 * 2 < data.length);
		/* data vertex order:
		 *  3 --- 2
		 *  |  /  |
		 *  0 --- 1
		 */

		let k:number, i:number = 0, j:number;

		// counterclockwise <=> front-facing

		// triangle 1 (0,1,2)
		for (k = 0; k < 3; k++) {
			j = offset + 2 * k; // data index

			this.data[i + 0] = data[j + 0];
			this.data[i + 1] = data[j + 1];
			this.data[i + 2] = Z;

			i += 3; // inc this.data index
		}

		// triangle 2 (2,3,0)
		for (k = 0; k < 3; k++) {
			j = offset + 2 * ((k + 2) % 4); // data index

			this.data[i + 0] = data[j + 0];
			this.data[i + 1] = data[j + 1];
			this.data[i + 2] = Z;

			i += 3; // inc this.data index
		}

		// compute new height
		this.Height = data[5] - data[1];
	}
}