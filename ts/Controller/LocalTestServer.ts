import { Connection } from "./IConnection";
import { IServerGameStateUpdate, IServerGameStart } from "./ICommunication";
import Model from "../Model/Model";

//type ServerGameUpdateHandler = (data: IServerGameStateUpdate) => void;

const UPDATE_RATE = 100;

export default class LocalTestServer implements Connection {
	private connected: boolean = false;
	private gameStarted:boolean = false;
	private updateInterval: number;
	private RoundStart: number;
	private Rotation: number = 0.0;

	public constructor() {
		this.RoundStart = Date.now() + 3;
	}

	public connect():Promise<void> {

		return new Promise<void>((resolve, reject) => {
			if(this.connected) {
				reject();
			} else {
				this.connected = true;
				this.gameStarted = false;

				this.updateInterval = setInterval(() => {
					let time: number = Date.now() - this.RoundStart;
					this.Rotation += 0.01;
		
					/*this.updateHandler({
						type: "state",
						time: time,
						pdata: [{
							pos: { x: 0, y: 0 },
							vel: { x: 0, y: 0 },
							alv: true
						}],
						rotation: this.Rotation
					});*/
				}, UPDATE_RATE);

				resolve();
			}
		});

	}

	public waitForStart(): Promise<IServerGameStart> {

		return new Promise<IServerGameStart>((resolve, reject) => {
			if(!this.connected || this.gameStarted) {
				reject();
			} else {
				this.gameStarted = true;

				resolve({
					type: "start",
					index: 0,	// player index
					time: -3,
					playerInitData: [
						{ name: "Bob", color: 0 }
					]
				});
			}
		});
	}

	public disconnect() {
		if(this.connected) { return; }

		this.connected = false;
		clearInterval(this.updateInterval);
	}

	public isConnected() {
		return this.connected;
	}

	public updateState(model:Model) {
		// ignore data for now
	}

}