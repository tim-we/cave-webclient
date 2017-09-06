import AbstractPlayer from "./AbstractPlayer";

import Vector from "./Vector";
import Color from "../View/Color";

import { IPlayerInitData, IPlayerData } from "../Controller/ICommunication";

const ACCELERATION: Vector = new Vector(0.0, 0.01);
const STARTSPEED: Vector = new Vector(1.0, 0);;

var tmp: number = 0;

export default class Player extends AbstractPlayer {
	public Velocity: Vector; // vector pointing to the next position

	public Index: number; // position in the server player array

	public Force: boolean = false;

	constructor(data:IPlayerInitData, index: number) {
		super(data, 0);

		// TODO: data.color

		this.Index = index;
		this.Velocity = STARTSPEED.clone();
	}

	public move(a: number) {
		// move
		//Vector.axpy(a, this.Velocity, this.Position);
		demo(a, this);

		super.updateTail();
	}

	public updateData(data: IPlayerData): void {
		throw new Error("Method not implemented.");
	}

	protected die() {
		super.die();
	}
}

function demo(a:number, player:Player) {
	tmp += a;
	let v = new Vector(Math.sin(0.1 * tmp), Math.sin(0.2 * tmp));
	v.scale(0.5);
	player.Position.copyFrom(v);
}