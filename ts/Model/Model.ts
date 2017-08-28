import Player from "./Player";
import OnlinePlayer from "./OnlinePlayer";

import Map from "./Map";
import { ServerGameInit, ServerGameMessage } from "../Controller/ICommunication";

export default class Model {

	public Time: number; // current model time
	private NextTime: number; // time from the latest server update
	private TimeDelta: number; // required fr smooth model updates
	private LastUpdate: number; // last time the update() method was called (local)

	public OnlinePlayers: OnlinePlayer[];

	public Player: Player;

	public Map: Map;

	public Rotation: number = 0.1 * Math.PI;
	private RotationDelta: number = 0.0;

	constructor(data:ServerGameInit) {
		let n: number = data.n; // number of players

		// validate data
		console.assert(n > 0);
		console.assert(data.names.length === n);
		console.assert(data.t < 0); // 0: start

		// set up timestamps
		this.Time = data.t;
		this.NextTime = data.t;
		this.TimeDelta = 0.0;
		this.LastUpdate = performance.now();

		// create player objects
		this.OnlinePlayers = new Array(n-1);
		let z: number = 0.2;
		let j: number = 0;

		this.Player = new Player(data.names[data.i], data.i);

		for (let i = 0; i < n - 1; i++) {
			
			if (data.i === i) { j++; }
			else {
				this.OnlinePlayers[j] = new OnlinePlayer(data.names[j], z);
				z += 0.1;
				j++;
			}
		}

		/* make this.Players immutable (not the Player objects though)
		 * so that it becomes a fixed size array (es2015).
		 */
		Object.freeze(this.OnlinePlayers);

		// create map
		this.Map = new Map();
	}

	public updateData(data: ServerGameMessage) {
		console.assert(data.t >= this.NextTime);
		console.assert(data.ps.length === this.OnlinePlayers.length + 1);
		console.assert(data.as.length === this.OnlinePlayers.length + 1);
		
		this.TimeDelta = Math.max(32, data.t - this.Time); // 2 frames to catch up
		this.NextTime = data.t;

		this.OnlinePlayers.forEach((p:OnlinePlayer, i:number) => {
			let pos = data.ps[i];
			p.updateData(pos.x, pos.y, data.as[i]);
		});

		this.RotationDelta = data.r - this.Rotation;
	}

	public update(): void {
		if (this.TimeDelta <= 0.0) { return; }

		// d = time since this method was called previously
		let d: number = performance.now() - this.LastUpdate; //ms
		this.LastUpdate = performance.now();

		// update current model time
		this.Time = Math.min(this.Time + d, this.NextTime);

		let t: number = d / this.TimeDelta;
		t = Math.max(Math.min(t, 2.0), 0.0);

		// move players
		this.Player.move(t);

		this.OnlinePlayers.forEach(p => {
			p.move(t);
		});
	}
}