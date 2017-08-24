const N: number = 1; // number of segments
const SEGMENT_SIZE: number = 2 * 3 * 2; // 2 2D triangles (3 points)
const SEGMENT_DATA_SIZE = 4 * 2; // 4 2D points

function setUpExampleData(map:Map) {
	console.assert(N === 1, "invalid number of segments");

	let i = 0;
	let data = new Float32Array(4 * 2);

	data[i++] = -0.8; data[i++] = -0.5;
	data[i++] =  0.2; data[i++] = -0.5;
	data[i++] =  0.5; data[i++] =  0.5;
	data[i++] = -0.5; data[i++] =  0.5;

	for (i = 0; i < 4; i++) {
		map.updatePoint(0, i, data);
	}
}

export default class Map {
	public data: Float32Array;
	public version: number;

	constructor() {
		this.data = new Float32Array(SEGMENT_SIZE * N);
		this.version = 0;

		setUpExampleData(this);
	}

	public numTriangles(): number {
		return 2 * N;
	}

	public updateSegment(segmentIndex:number, data:Float32Array):void {
		console.assert(data.length === SEGMENT_DATA_SIZE, "Invalid segment data.");
		console.assert(0 <= segmentIndex && segmentIndex < N, "Index out of bounds. (updateSegment)");

		let offset: number = segmentIndex * SEGMENT_SIZE;
		let i;

		// triangle 012
		for (i = 0; i<3; i++) { this.updatePoint(offset, i, data); }

		// triangle 023 = 230 = 234 % 4
		for (i = 2; i <= 4; i++) { this.updatePoint(offset, i % 4, data); }

		this.version++;
	}

	//TODO: make private
	public updatePoint(segment: number, pointIndex: number, data:Float32Array) {
		let offset: number;

		if (pointIndex % 2 === 0) { // points 0,2 (shared)
			offset = 2 * pointIndex;

			this.data[offset]     = data[2 * pointIndex];
			this.data[offset + 1] = data[2 * pointIndex + 1];

			offset = pointIndex + 6;

			this.data[offset]     = data[2 * pointIndex];
			this.data[offset + 1] = data[2 * pointIndex + 1];
		} else { // points 1,3 (not shared)
			offset = 4 * pointIndex - 2;

			this.data[offset]     = data[2 * pointIndex];
			this.data[offset + 1] = data[2 * pointIndex + 1];
		}
	}
}