import Player from "./Player";
import OnlinePlayer from "./OnlinePlayer";

import Camera from "./Camera";

import Map from "./Map";
import {
	IServerMessage,
	IServerMapUpdate,
	IServerGameStart,
	IServerGameStateUpdate
} from "../Controller/ICommunication";

export default class Model {

	public Time: number; // current model time
	private NextTime: number; // time from the latest server update
	private TimeDelta: number; // required fr smooth model updates
	private LastUpdate: number; // last time the update() method was called (local)

	public OnlinePlayers: OnlinePlayer[];

	public Player: Player;

	public Camera: Camera = new Camera();

	public Map: Map;

	private Speed:number = 0.42; // main axis velocity

	public Rotation: number = 0 * Math.PI;
	private RotationDelta: number = 0.0;

	constructor(data:IServerGameStart) {
		let n: number = data.playerInitData.length; // number of players

		// validate data
		console.assert(n > 0);
		console.assert(data.time < 0, "unexpected: data.time = " + data.time); // 0: start

		// set up timestamps
		this.Time = data.time;
		this.NextTime = data.time;
		this.TimeDelta = 0.0;
		this.LastUpdate = performance.now();

		// create player objects
		this.OnlinePlayers = new Array(n-1);
		let z: number = 0.2;
		let j: number = 0;

		this.Player = new Player(data.playerInitData[data.index], 0.05);

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
		this.Map = new Map(data.mapInit);
	}

	public updateData(data: IServerMessage) {
		if(data.type === "state") {
			this.updateState(<IServerGameStateUpdate>data);
		} else if (data.type === "map") {
			this.Map.update(<IServerMapUpdate>data);
		}
	}

	private updateState(data: IServerGameStateUpdate) {
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
		//if (this.TimeDelta <= 0.0) { return; }

		// d = time since this method was called previously
		let d: number = performance.now() - this.LastUpdate; //ms
		this.LastUpdate = performance.now();

		// time in seconds
		let t:number = d / 1000;

		// update current model time
		this.Time = Math.min(this.Time + t, this.NextTime);

		if (this.Player.Alive) {
			// move player
			this.Player.move(t);
		
			// collision test
			if (this.Map.isInside(this.Player.Position)) {
				// update velocity
				this.Player.update(t);
			} else {
				this.Player.move(-0.75 * t);
				this.Player.die();
			}
		}

		// update other players
		this.OnlinePlayers.forEach(p => {
			p.move(t);
		});

		// update camera
		this.Camera.update(this, t);
	}

	public aliveCount(): number {
		let n: number = this.Player.Alive ? 1 : 0;

		this.OnlinePlayers.forEach(p => {
			if (p.Alive) { n++; }
		});

		return n;
	}
}