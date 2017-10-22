import AbstractPlayer from "./AbstractPlayer";

import { IPlayerInitData, IPlayerData } from "../Protocol/ICommunication";

import Vector from "./Vector";
import Color from "../View/Color";

let tmp:Vector = new Vector(0.0, 0.0);

export default class OnlinePlayer extends AbstractPlayer {

	constructor(data:IPlayerInitData, zPos: number) {
		super(data, zPos);
	}

	// ServerGameStateUpdate
	public updateData(data:IPlayerData, time:number): void {
		console.assert(time > 0.0);

		this.Position.diff2d(data.pos.x, data.pos.y, tmp);

		tmp.scale(1.0 / time);

		this.updateVelocity(tmp.getX(), tmp.getY());

		if (this.Alive && !data.alv) { super.die(); }
	}

}