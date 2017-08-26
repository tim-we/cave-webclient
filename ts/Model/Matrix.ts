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

	public getEntry(row: number, column: number): number {
		return this.data[row + 4 * column];
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

	public makeZRotation(alpha:number, reset:boolean = false): void {
		let c: number = Math.cos(alpha);
		let s: number = Math.sin(alpha);

		if (reset) {
			this.makeZero();
			this.setEntry(2, 2, 1.0);
			this.setEntry(3, 3, 1.0);
		}

		this.setEntry(0, 0, c);
		this.setEntry(1, 1, c);
		this.setEntry(0, 1, -s);
		this.setEntry(1, 0, s);
	}

	// symmetric frustum
	public makeFrustum(
		width: number, height: number,
		znear: number, zfar: number,
		zero:boolean = false): void {
		
		let div = 1.0 / (znear - zfar); // -1 / (zfar - znear)
		
		if (zero) { this.makeZero(); }

		this.setEntry(0, 0, 2.0 * znear / width);
		this.setEntry(1, 1, 2.0 * znear / height);
		this.setEntry(2, 2, (zfar + znear) * div);
		this.setEntry(2, 3, 2.0 * zfar * znear * div);
		this.setEntry(3, 2, -1.0);
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

	// result <- a * b
	public static multiply(a: Matrix, b: Matrix, result: Matrix): void {
		let i: number, j: number, k: number;
		let sum: number;

		for (i = 0; i < 4; i++) {
			for (j = 0; j < 4; j++) {
				sum = 0.0;

				for (k = 0; k < 4; k++) {
					sum += a.getEntry(i, k) * b.getEntry(k, j);
				}

				result.setEntry(i, j, sum);
			}
		}
	}

	public uniform(gl:WebGLRenderingContext, location:WebGLUniformLocation): void {
		gl.uniformMatrix4fv(location, false, this.data);
	}
}