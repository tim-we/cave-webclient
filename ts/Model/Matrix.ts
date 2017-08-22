// 4x4 matrix
export default class Matrix {
	private data: Float32Array = new Float32Array(4 * 4);

	// creates identity matrix
	public constructor() {
		// data is 0 initialized
		this.makeIdentity(false);
	}

	// elements are stored column by column
	public setEntry(row: number, column: number, value: number): void {
		this.data[row + 4 * column] = value;
	}

	public makeZero(): void {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] = 0;
		}
	}

	public makeIdentity(zero:boolean = true): void {
		if (zero) { this.makeZero(); }

		for (let i = 0; i < 4; i++) {
			this.setEntry(i, i, 1.0);
		}
	}

	public makeScale(x: number, y: number, z: number, zero:boolean = false): void {
		if (zero) { this.makeZero(); }

		this.setEntry(0, 0, x);
		this.setEntry(1, 1, y);
		this.setEntry(2, 2, z);
		this.setEntry(3, 3, 1);
	}

	public scale(x: number, y: number, z: number): void {
		for (let i = 0; i < 4; i++) {
			this.data[i] *= x;
		}

		for (let i = 4; i < 8; i++) {
			this.data[i] *= y;
		}

		for (let i = 8; i < 16; i++) {
			this.data[i] *= z;
		}
	}

	public uniform(gl:WebGLRenderingContext, location:WebGLUniformLocation): void {
		gl.uniformMatrix4fv(location, false, this.data);
	}
}