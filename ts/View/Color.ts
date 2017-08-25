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

	public setUniform(gl: WebGLRenderingContext, location:WebGLUniformLocation): void {
		gl.uniform4f(location, this.red, this.green, this.blue, this.alpha);
	}

	public static interpolate(a: Color, b: Color, x: number, result:Color) {
		let xa: number = 1.0 - x;

		result.red   = xa * a.red   + x * b.red;
		result.green = xa * a.green + x * b.green;
		result.blue  = xa * a.blue  + x * b.blue;
		result.alpha = xa * a.alpha + x * b.alpha;
	}
}