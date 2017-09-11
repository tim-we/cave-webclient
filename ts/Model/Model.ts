import Player from "./Player";
import OnlinePlayer from "./OnlinePlayer";

import Map from "./Map";
import { IServerGameStart, IServerGameStateUpdate } from "../Controller/ICommunication";

export default class Model {

	public Time: number; // current model time
	private NextTime: number; // time from the latest server update
	private TimeDelta: number; // required fr smooth model updates
	private LastUpdate: number; // last time the update() method was called (local)

	public OnlinePlayers: OnlinePlayer[];

	public Player: Player;

	public Map: Map;

	private Speed:number = 0.42; // main axis velocity

	public Rotation: number = 0.1 * Math.PI;
	private RotationDelta: number = 0.0;

	constructor(data:IServerGameStart) {
		let n: number = data.playerInitData.length; // number of players

		// validate data
		console.assert(n > 0);
		console.assert(data.time < 0); // 0: start

		// set up timestamps
		this.Time = data.time;
		this.NextTime = data.time;
		this.TimeDelta = 0.0;
		this.LastUpdate = performance.now();

		// create player objects
		this.OnlinePlayers = new Array(n-1);
		let z: number = 0.2;
		let j: number = 0;

		this.Player = new Player(data.playerInitData[data.index], 0);

		for (let i = 0; i < n - 1; i++) {
			
			if (data.index === i) { j++; }
			else {
				this.OnlinePlayers[j] = new OnlinePlayer(data.playerInitData[j], z);
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

	public updateData(data: IServerGameStateUpdate) {
		console.assert(data.time >= this.NextTime);
		
		this.TimeDelta = Math.max(32, data.time - this.Time); // 2 frames to catch up
		this.NextTime = data.time;

		this.OnlinePlayers.forEach((p:OnlinePlayer, i:number) => {
			p.updateData(data.pdata[i], this.TimeDelta);
		});

		this.RotationDelta = data.rotation - this.Rotation;

		if(data.speed !== this.Speed) {
			// TODO: update velocity for all players
		}
	}

	public update(): void {
		if (this.TimeDelta <= 0.0) { return; }

		// d = time since this method was called previously
		let d: number = performance.now() - this.LastUpdate; //ms
		this.LastUpdate = performance.now();

		let t:number = d / 1000;

		// update current model time
		this.Time = Math.min(this.Time + t, this.NextTime);

		// move players
		this.Player.move(t);
		this.Player.update(t);

		this.OnlinePlayers.forEach(p => {
			p.move(t);
		});
	}
}