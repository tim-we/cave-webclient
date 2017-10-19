import { IServerMapUpdate } from "../Controller/ICommunication";

const N: number = 50; // number of segments
const SEGMENT_SIZE: number = 2 * 3 * 2; // 2 2D triangles (2*3 points)
const SEGMENT_DATA_SIZE = 4 * 2; // 4 2D points

var tmp = new Float32Array(SEGMENT_DATA_SIZE);

export default class Map {
	public data: Float32Array;
	public version: number;

	private updateIndex:number = 0;

	private TopData:Float32Array = new Float32Array(2 * 2);

	constructor(initData: number[]) {
		console.log("local segment buffer size: " + N);

		this.data = new Float32Array(SEGMENT_SIZE * N);
		this.version = 0;

		console.assert(
			initData.length === SEGMENT_DATA_SIZE,
			"Map: illegal init data (length: " + initData.length + ")"
		);

		for (let i = 0; i < this.TopData.length; i++) {
			this.TopData[i] = initData[4 + i];
		}

		this.updateSegment(this.updateIndex, new Float32Array(initData));
		this.updateIndexNext();

		//setUpExampleData(this);
	}

	public numTriangles(): number {
		return 2 * N;
	}

	private updateIndexNext(): void {
		// index of the next segment that gets updated
		this.updateIndex = (this.updateIndex+1) % N;
	}

	public update(data:IServerMapUpdate) {
		console.assert(data.type === "map", "Map.update: Illegal Argument!");
		//console.log("Map update, " + (data.data.length / 4) + " segments");

		/* server map data:
			segment:
			- new top left x,y
			- new top right x,y

			=> n segments, segment size 4
		 */

		if(data.data.length % 4 === 0) {
			let n:number = data.data.length / 4;
			let k:number, o:number, j:number;

			for (let i = 0; i < n; i++) {
				// new segment = top of previous segment & 2 points from update

				// copy top data from previous segment
				for(k=0; k<this.TopData.length; k++) {
					tmp[k] = this.TopData[k];
				}

				// data offset in update
				o = 4 * i;

				// take 2 2D points from update data, update TopData
				for(j=0; j<this.TopData.length; j++) {
					tmp[k+j] = this.TopData[j] = data.data[o + j];
				}

				// update the segment
				this.updateSegment(this.updateIndex, tmp);

				this.updateIndexNext();
			}
		} else {
			console.error("Map.update: invalid update length " + data.data.length);
		}
	}

	private updateSegment(segmentIndex: number, data: Float32Array): void {
		console.assert(data.length === SEGMENT_DATA_SIZE, "Invalid segment data.");
		console.assert(0 <= segmentIndex && segmentIndex < N, "Index out of bounds. (updateSegment)");

		let offset: number = segmentIndex * SEGMENT_SIZE;
		let i,k=0;

		// triangle 012
		for (i = 0; i<3; i++) { this.updatePoint(segmentIndex, k++, data, i); }

		// triangle 123
		for (i = 1; i < 4; i++) { this.updatePoint(segmentIndex, k++, data, i); }

		this.version++;
	}

	private updatePoint(segment: number, point: number, data: Float32Array, dataIndex:number) {
		let offset:number = SEGMENT_SIZE * segment + 2 * point;
		let dataOffset:number = dataIndex * 2;

		this.data[offset]		= data[dataOffset];
		this.data[offset + 1]	= data[dataOffset+1];
	}

}