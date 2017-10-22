import Vector from "./Vector";
import Color from "../View/Color";

import {
	IPlayerInitData,
	IPlayerData
} from "../Controller/ICommunication";

export const TAILLENGTH = 100;
const TAILNODESIZE = 2 * (2 + 1);
const TAILWIDTH = 0.005;
const STARTSPEED: Vector = new Vector(0.0, 0.75);

var tmp: Vector = new Vector();

export default abstract class AbstractPlayer {
	public Name: string;
	public Color: Color;

	public Position: Vector; // current (interpolated) position
	private Velocity:Vector;
	private VelOrthoDir:Vector;

	public Layer: number; // integer >= 0

	public Alive: boolean;

	public Tail: Float32Array; /*
		TRIANGLE_STRIP data
		- point right + intensity
		- point left + intensity
	
		=> 2 * (2 + 1) = 6 floats per "tail point"
	*/

	constructor(data:IPlayerInitData, layer:number) {
		this.Position = new Vector(0.0, 0.0);
		this.Velocity = STARTSPEED.clone();
		this.VelOrthoDir = new Vector(0.0, 0.0);
		this.Layer = layer;
		this.Alive = true;

		this.Color = Color.create(data.color);

		this.Tail = new Float32Array(TAILLENGTH * TAILNODESIZE);

		let h: number = 1.0 / (TAILLENGTH - 1);

		for (let i = 0; i < TAILLENGTH; i++) {
			this.Tail[i * TAILNODESIZE + 2] = i * h;
			this.Tail[i * TAILNODESIZE + 5] = i * h;
		}
	}

	protected updateVelocity(x:number, y:number):void {
		this.Velocity.set(
			clamp(x, -1, 1),
			y);

		this.Velocity.ortho(this.VelOrthoDir);
		this.VelOrthoDir.scale(1.0 / this.VelOrthoDir.length());
	}

	protected updateXVelocity(x: number): void {
		this.updateVelocity(this.Velocity.getX() + x, this.Velocity.getY());
	}

	public move(t: number) {
		Vector.axpy(t, this.Velocity, this.Position);

		this.updateTail();
	}

	protected updateTail() {
		let n: number = this.Tail.length;

		// shift tail points (keep intensities)
		shiftTailData(this.Tail);

		// right point
		Vector.axpy2(TAILWIDTH, this.VelOrthoDir, this.Position, tmp);
		this.Tail[n - 6] = tmp.getX();
		this.Tail[n - 5] = tmp.getY();

		// left point
		Vector.axpy2(-TAILWIDTH, this.VelOrthoDir, this.Position, tmp);
		this.Tail[n - 3] = tmp.getX();
		this.Tail[n - 2] = tmp.getY();
	}

	protected die() {
		this.Alive = false;
		this.Velocity.set(0, 0);
	}

	public static getTailVertexCount(): number{
		return TAILLENGTH * 2;
	}

	public abstract updateData(data: IPlayerData, time:number): void;
}

function shiftTailData(data: Float32Array | Float64Array): void {
	let i: number; // index
	let j: number; // new index
	
	for (let k = 1; k < TAILLENGTH; k++) {
		i = k * TAILNODESIZE;
		j = i - TAILNODESIZE;

		data[j + 0] = data[i + 0];
		data[j + 1] = data[i + 1];

		data[j + 3] = data[i + 3];
		data[j + 4] = data[i + 4];
	}
}

function clamp(value:number, min:number, max:number): number {
	return Math.max(min, Math.min(value, max));
}