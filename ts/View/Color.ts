export default class Color {
	// values 0 to 1
	public red: number;
	public green: number;
	public blue: number;
	public alpha: number;

	constructor(r:number, g:number, b:number, a:number = 1.0) {
		this.red = r;
		this.green = g;
		this.blue = b;
		this.alpha = a;
	}

	public setClearColor(gl: WebGLRenderingContext):void {
		gl.clearColor(this.red, this.green, this.blue, this.alpha);
	}

	public static interpolate(a: Color, b: Color, x: number, result:Color) {
		let xb: number = 1.0 - x;

		result.red = x * a.red + xb * b.red;
		result.green = x * a.green + xb * b.green;
		result.blue = x * a.blue + xb * b.blue;
		result.alpha = x * a.alpha + xb * b.alpha;
	}
}