import Player from "./Player";
import Map from "./Map";
import { ServerGameInit } from "./ICommunication";

export default class Model {

	public Time: number;
	private TimeDelta: number;
	private LastUpdate: number;

	public Players: Player[];

	public Player: Player;

	public Map: Map;

	public Rotation: number;

	private userInput: boolean = false;

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

		for (let i = 0; i < n; i++) {
			this.Players[i] = new Player(data.names[i]);
		}

		this.Player = this.Players[data.i];

		/* make this.Players immutable (not the Player objects though)
		 * so that it becomes a fixed size array (es2015).
		 * no garbage-collection here!
		 */
		Object.freeze(this.Players);

		// create map
		this.Map = new Map();
	}

	public setUserInput(pressed:boolean): void {
		this.userInput = pressed;

		// TODO: update server
	}

	public update():void {
		let d: number = performance.now() - this.LastUpdate; //ms

		let t: number = (this.TimeDelta === 0.0) ? 0.0 : d / this.TimeDelta;
		t = Math.max(Math.min(t, 2.0), 0.0);

		// move players
		this.Players.forEach(p => {
			p.move(t);
		});
	}
}