// 4x4 matrix
export default class Matrix {
	private data: Float32Array = new Float32Array(4 * 4);

	// creates identity matrix
	public constructor() {
		// data is 0 initialized
		for (let i = 0; i < 4; i++) {
			this.setEntry(i, i, 1.0);
		}
	}

	// elements are stored column by column
	public setEntry(row: number, column: number, value: number): void {
		this.data[row + 4 * column] = value;
	}

	public allZero(): void {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] = 0;
		}
	}

	public makeScale(x: number, y: number, z: number, zero:boolean = false): void {
		if (zero) { this.allZero(); }

		this.setEntry(0, 0, x);
		this.setEntry(1, 1, y);
		this.setEntry(2, 2, z);
		this.setEntry(3, 3, 1);
	}

	public uniform(gl:WebGLRenderingContext, location:WebGLUniformLocation): void {
		gl.uniformMatrix4fv(location, false, this.data);
	}
}