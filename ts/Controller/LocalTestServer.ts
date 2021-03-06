declare function require(name: string): any;

import {
	Connection,
	GameUpdateListener
} from "./IConnection";

import {
	IServerGameStateUpdate,
	IServerGameStart,
	IServerLobbyUpdate
} from "../Protocol/ICommunication";

import Game from "../Model/Game";

const UPDATE_RATE = 100;

export default class LocalTestServer implements Connection {
	private connected: boolean = false;
	private gameStarted:boolean = false;
	private updateInterval: number;
	private RoundStart: number;
	private callback: GameUpdateListener = null;
	private playerAlive: boolean = true;

	public constructor() {
		this.RoundStart = Date.now() + 3;
	}

	public connect():Promise<IServerLobbyUpdate> {

		return new Promise<IServerLobbyUpdate>((resolve, reject) => {
			if(this.connected) {
				reject();
			} else {
				this.connected = true;
				this.gameStarted = false;

				this.updateInterval = setInterval(() => {
					let time: number = Date.now() - this.RoundStart;
					
					if(this.callback) {
						this.callback({
							type: "state",
							time: time,
							pdata: [{
								pos: { x: 0, y: 0 },
								alv: true
							}],
							speed: 0.42
						});
					}
				}, UPDATE_RATE);

				resolve({
					type: "lobby",
					players: [],
					msg: "A player has connected."
				});
			}
		});

	}

	public waitForStart(): Promise<IServerGameStart> {

		return wait(this.playerAlive ? 1000 : 3000).then(() => {
			this.playerAlive = true;

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
						],
						mapInit: [-.9, -1, .9, -1, -.9, .75, .9, .75],
						rotation: 1.5 * Math.PI
					});
	
					setTimeout(_this => { _this.sendMapUpdate(0); }, 0, this);
					setTimeout(_this => { _this.sendMapUpdate(1); }, 100, this);
				}
			});
		});
	}

	private sendMapUpdate(i: number): void {
		if (!this.callback) { return; }

		if (i === 0) {
			this.callback(require("../../data/mapData1.json"));
		} else {
			this.callback(require("../../data/mapData2.json"));
		}
	}

	public disconnect() {
		if(this.connected) { return; }

		this.connected = false;
		clearInterval(this.updateInterval);

		this.callback = null;
	}

	public isConnected() {
		return this.connected;
	}

	public updateState(game:Game) {
		if (this.playerAlive && !game.Player.Alive) {
			this.playerAlive = false;

			this.gameStarted = false;
		}
	}

	public setUpdateListener(listener: GameUpdateListener) {
		if(this.isConnected()) {
			this.callback = listener;
		}
	}

}

function wait(time: number):Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
}