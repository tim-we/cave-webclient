import AbstractPlayer from "./AbstractPlayer";

import Vector from "./Vector";
import Color from "../View/Color";

import { IPlayerInitData, IPlayerData } from "../Controller/ICommunication";

const ACCELERATION: Vector = new Vector(0.0, 0.01);

var tmp: number = 0;

export default class Player extends AbstractPlayer {
	public Index: number; // position in the server player array

	public Force: boolean = false;

	constructor(data:IPlayerInitData, index: number) {
		super(data, 0);

		this.Position.set(0.0, -0.2);

		this.Index = index;
	}

	public update(t:number):void {
		tmp += 3 * t;

		this.updateVelocity(
			0.5 * Math.cos(0.8 * tmp),
			0.42 * Math.sin(0.7 * tmp)
		);
	}

	public updateData(data: IPlayerData, time:number): void {
		throw new Error("Method not implemented.");
	}

	protected die() {
		super.die();
	}
}