import AbstractPlayer from "./AbstractPlayer";

import Vector from "./Vector";
import Color from "../View/Color";

import { IPlayerInitData, IPlayerData } from "../Controller/ICommunication";
import * as GameLog from "../View/GameLog";

const ACCELERATION: Vector = new Vector(0.04, 0.0);

var tmp: number = 0;

export default class Player extends AbstractPlayer {
	public Index: number; // position in the server player array

	public Force: boolean = false;

	constructor(data:IPlayerInitData, index: number) {
		super(data, 0);

		this.Position.set(0, -0.5);

		this.Index = index;
	}

	public update(t:number):void {

		this.updateXVelocity(
			this.Force ? ACCELERATION.getX() : -ACCELERATION.getX()
		);
	}

	public updateData(data: IPlayerData, time:number): void {
		throw new Error("Method not implemented.");
	}

	public die() {
		GameLog.log("The player died.", true);
		super.die();
	}
}