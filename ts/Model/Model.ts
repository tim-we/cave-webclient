import Player from "./Player";
import Map from "./Map";
import { ServerGameInit, ServerGameMessage } from "../Controller/ICommunication";

export default class Model {

	public Time: number; // current model time
	private NextTime: number; // time from the latest server update
	private TimeDelta: number;
	private LastUpdate: number; // local timestamp

	public Players: Player[];

	public Player: Player;

	public Map: Map;

	public Rotation: number;

	private userInput: boolean = false;
	public onUserInputChange: (pressed: boolean) => void = () => { };

	constructor(data:ServerGameInit) {
		let n: number = data.n; // number of players

		// validate data
		console.assert(n > 0);
		console.assert(data.names.length === n);
		console.assert(data.t < 0); // 0: start

		// set up timestamps
		this.Time = data.t;
		this.TimeDelta = 0.0;

		// create player objects
		this.Players = new Array(n);
		let z: number = 1.0;

		for (let i = 0; i < n; i++) {
			if (i === data.i) {
				this.Players[i] = new Player(data.names[i], 0);
			} else {
				this.Players[i] = new Player(data.names[i], z);
				z += 1.0;
			}
		}

		this.Player = this.Players[data.i];

		/* make this.Players immutable (not the Player objects though)
		 * so that it becomes a fixed size array (es2015).
		 */
		Object.freeze(this.Players);

		// create map
		this.Map = new Map();
	}

	public setUserInput(pressed: boolean): void {
		if (this.userInput !== pressed) {
			this.userInput = pressed;

			this.onUserInputChange(pressed);
		}
	}

	public updateData(data: ServerGameMessage) {
		console.assert(data.t >= this.NextTime);
		console.assert(data.ps.length === this.Players.length);
		console.assert(data.as.length === this.Players.length);
		
		this.TimeDelta = Math.max(32, data.t - this.Time); // 2 frames to catch up
		this.NextTime = data.t;

		this.Players.forEach((p:Player, i:number) => {
			let pos = data.ps[i];
			p.updateData(pos.x, pos.y, data.as[i]);
		});
	}

	public update(): void {
		if (this.TimeDelta <= 0.0) { return; }

		let d: number = performance.now() - this.LastUpdate; //ms
		this.LastUpdate = performance.now();

		if (this.Time > this.NextTime) {
			this.Time = this.NextTime;
		} else {
			this.Time += d;
		}

		let t: number = d / this.TimeDelta;
		t = Math.max(Math.min(t, 2.0), 0.0);

		// move players, collision-detection on server
		this.Players.forEach(p => {
			p.move(t);
		});

	}
}