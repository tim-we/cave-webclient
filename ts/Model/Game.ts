import Player from "./Player";
import OnlinePlayer from "./OnlinePlayer";

import Camera from "./Camera";
import Countdown from "./Countdown";
import PromiseListener from "./PromiseListener";
import { AnimationManager, DeathExplosion } from "./Animations";

import Map from "./Map";
import {
	IServerMessage,
	IServerMapUpdate,
	IServerGameStart,
	IServerGameStateUpdate
} from "../Protocol/ICommunication";

export default class Game {

	public Time: number; // current model time (in seconds)
	private NextTime: number; // time from the latest server update
	private TimeDelta: number; // required for smooth model updates
	private LastUpdate: number; // last time the update() method was called (local)

	private EndListener: PromiseListener = new PromiseListener();
	private ended: boolean = false;

	public OnlinePlayers: OnlinePlayer[];

	public Player: Player;

	public Camera: Camera;

	public Map: Map;

	private Speed: number = 0.42; // main axis velocity
	
	public Countdown: Countdown;

	private Danger: number = 0;

	public Animations: AnimationManager = new AnimationManager();

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
		this.Countdown = new Countdown(Math.max(3, Math.abs(this.Time)));

		// create camera
		this.Camera = new Camera(0, -0.5, data.rotation);

		// create player objects
		this.OnlinePlayers = new Array(n-1);
		let j: number = 0;

		this.Player = new Player(data.playerInitData[data.index], 0.05);

		for (let i = 0; i < n - 1; i++) {
			
			if (data.index === i) { j++; }
			else {
				this.OnlinePlayers[j] = new OnlinePlayer(data.playerInitData[j], j+1);
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
		
		this.TimeDelta = Math.max(0.0333, data.time - this.Time); // 2 frames to catch up
		this.NextTime = data.time;

		this.OnlinePlayers.forEach((p:OnlinePlayer, i:number) => {
			p.updateData(data.pdata[i], this.TimeDelta);
		});

		if(data.speed !== this.Speed) {
			// TODO: update velocity for all players
		}
	}

	public update(): void {

		// t = time since this method was called previously
		let t: number = (performance.now() - this.LastUpdate) / 1000; //s
		this.LastUpdate = performance.now();

		// update current model time
		this.Time = Math.min(this.Time + t, this.NextTime);

		this.Countdown.update(this.Time);

		this.Danger = Math.max(0, this.Danger - 1.25 * t);
		
		if (this.Time >= 0) {

			if (this.Player.Alive) {
				// move player
				this.Player.move(t);
				
				let d = this.Map.getDistanceToWall(this.Player.Position);

				// collision test
				if (d > 0.0) {
					// update velocity
					this.Player.update(t);

					this.Danger = Math.max(this.Danger, 4.0 * Math.max(0, 0.25 - d));
				} else {
					this.Player.die();
					this.Animations.add(new DeathExplosion(this.Player));
				}
			}
	
			// update other players
			this.OnlinePlayers.forEach(p => {
				p.move(t);
			});
		}

		// update camera
		this.Camera.update(this, t);

		// has game ended?
		if (!this.ended && this.aliveCount()===0) {
			this.ended = true;
			let g: Game = this;

			setTimeout((pl:PromiseListener) => {
				pl.resolve([t]);
			}, 1000, this.EndListener);
		}

		// clean up expired animations
		this.Animations.cleanUp();
	}

	public aliveCount(): number {
		let n: number = this.Player.Alive ? 1 : 0;

		this.OnlinePlayers.forEach(p => {
			if (p.Alive) { n++; }
		});

		return n;
	}

	public waitForEnd(): Promise<void> {
		let pl: PromiseListener = this.EndListener;

		return new Promise<void>((resolve, reject) => {
			pl.add(resolve);
		});
	}

	public getDanger(): number {
		return this.Danger;
	}
}