export default class Vector {
	private data: Float32Array = new Float32Array(2);

	constructor(x:number = 0.0, y:number = 0.0) {
		this.data[0] = x;
		this.data[1] = y;
	}

	public getX(): number {
		return this.data[0];
	}

	public getY(): number {
		return this.data[1];
	}

	public set(x:number, y:number):void {
		this.data[0] = x;
		this.data[1] = y;
	}

	// this <- Vector(x,y) - this
	public diff2d(x:number, y:number, delta:Vector): void {
		delta.data[0] = x - this.data[0];
		delta.data[1] = y - this.data[1];
	}

	public length(): number {
		return Math.sqrt(this.data[0]*this.data[0] + this.data[1]*this.data[1]);
	}

	// y <- a*x + y
	public static axpy(a:number, x:Vector, y:Vector):void {
		y.data[0] += a * x.data[0];
		y.data[1] += a * x.data[1];
	}

	public static axpy2(a: number, x: Vector, y: Vector, result: Vector): void {
		result.data[0] = y.data[0] + a * x.data[0];
		result.data[1] = y.data[1] + a * x.data[1];
	}

	public static distance2(a:Vector, b:Vector): number {
		let dx: number = a.data[0] - b.data[0];
		let dy: number = a.data[1] - b.data[1];

		return dx * dx + dy * dy;
	}

	// 90deg cw
	public ortho(result: Vector = new Vector()): Vector {
		let x: number = this.data[0]; // covers the case this === result

		result.data[0] = this.data[1];
		result.data[1] = -x;

		return result;
	}

	public copyFrom(v: Vector): void {
		this.data[0] = v.data[0];
		this.data[1] = v.data[1];
	}

	public clone(): Vector {
		return new Vector(
			this.data[0],
			this.data[1]
		);
	}

	public scale(x:number): void {
		this.data[0] *= x;
		this.data[1] *= x;
	}

	public toString(): string {
		return "(" + this.data[0] + "," + this.data[1] + ")";
	}

}