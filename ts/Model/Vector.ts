export default class Vector {
	private data: Float64Array = new Float64Array(2);

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

	// this <- Vector(x,y) - this
	public diff2d(x:number, y:number): void {
		this.data[0] = x - this.data[0];
		this.data[1] = y - this.data[1];
	}

	public length(): number {
		return Math.sqrt(this.data[0]*this.data[0] + this.data[1]*this.data[1]);
	}

	// y <- a*x + y
	public static axpy(a:number, x:Vector, y:Vector):void {
		y.data[0] = a * x.data[0] + y.data[0];
		y.data[1] = a * x.data[1] + y.data[1];
	}

	public static distance2(a:Vector, b:Vector): number {
		let dx: number = a.data[0] - b.data[0];
		let dy: number = a.data[1] - b.data[1];

		return dx * dx + dy * dy;
	}

}