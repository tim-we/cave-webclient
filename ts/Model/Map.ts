const N: number = 1; // number of segments
const SEGMENT_SIZE: number = 2 * 3 * 2; // 2 2D triangles (3 points)

function setUpExampleData(data:Float32Array) {
	console.assert(N === 1, "invalid number of segments");

	let i = 0;

	// triangle 1
	data[i++] = -0.8; data[i++] = -0.5;
	data[i++] = 0.2; data[i++] = -0.5;
	data[i++] = -0.5; data[i++] = 0.5;

	// tiruangle 2
	data[i++] = 0.5; data[i++] = 0.5;
	data[i++] = -0.5; data[i++] = 0.5;
	data[i++] = 0.2; data[i++] = -0.5;
}

export default class Map {
	public data: Float32Array;

	//private i: number;

	constructor() {
		this.data = new Float32Array(SEGMENT_SIZE * N);
		//this.i = 0;
		setUpExampleData(this.data);
	}

	public numTriangles(): number {
		return 2 * N;
	}

	public update(data: Float32Array):void {
		/*let n: number = data.length / 8; // 2 * 4 (2D * |Segment Corners|)

		let k: number, d:number, i:number, o:number, j:number;

		for (k = 0; k < n; k++) {
			d = this.i * SEGMENT_SIZE;
			o = k * 8;

			// triangle 1
			for (i = 0; i < 3; i++) {
				this.data[d + 2 * i] = data[o + 2 * i];
				this.data[d + 2 * i + 1] = data[o + 2 * i + 1];
			}

			// triangle 2
			for (i = 0; i < 3; i++) {
				//j = i 
			}
		}*/
	}
}