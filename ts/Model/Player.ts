import AbstractPlayer from "./AbstractPlayer";

import Vector from "./Vector";
import Color from "../View/Color";

import { IPlayerInitData, IPlayerData } from "../Protocol/ICommunication";
import * as GameLog from "../View/GameLog";

const ACCELERATION: Vector = new Vector(0.03, 0.0);

var tmp: number = 0;

export default class Player extends AbstractPlayer {
	public Index: number; // position in the server player array

	private Force: boolean = false;

	private FirstInputReceived: boolean = false;

	constructor(data:IPlayerInitData, index: number) {
		super(data, 0);

		this.Position.set(0, -0.5);

		this.Index = index;
	}

	public setForce(value: boolean): void {
		if (!this.FirstInputReceived && value) { this.FirstInputReceived = true; }
		this.Force = value;
	}

	public getForce(): boolean { return this.Force; }

	public update(t:number):void {

		if (this.FirstInputReceived) {
			this.updateXVelocity(
				this.Force ? -ACCELERATION.getX() : ACCELERATION.getX()
			);
		} else {
			// straight line before first input
			this.updateXVelocity(0);
		}
	}

	public updateData(data: IPlayerData, time:number): void {
		throw new Error("Method not implemented.");
	}

	public die() {
		GameLog.log("The player died.", true);
		super.die();
	}
}