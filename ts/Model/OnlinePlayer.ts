import AbstractPlayer from "./AbstractPlayer";

import { IPlayerInitData, IPlayerData } from "../Controller/ICommunication";

import Vector from "./Vector";
import Color from "../View/Color";

export default class OnlinePlayer extends AbstractPlayer {

	public PDelta: Vector; // vector pointing to the next position
	public PDeltaLength: number;

	constructor(data:IPlayerInitData, zPos: number) {
		super(data, zPos);

		this.PDelta = new Vector(0, 0);
		this.PDeltaLength = 0;

		this.Color = new Color(1.0, 0.2, 0.0);
	}

	public updateData(data:IPlayerData): void {
		this.PDelta.diff2d(data.pos.x, data.pos.y);
		this.PDeltaLength = this.PDelta.length();

		if (this.Alive && !data.alv) { super.die(); }
	}

	public move(a: number) {
		// move
		Vector.axpy(a, this.PDelta, this.Position);

		this.updateTail();
	}

}