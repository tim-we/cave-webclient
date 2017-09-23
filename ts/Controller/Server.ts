import {
	Connection,
	GameUpdateListener
} from "./IConnection";

import {
	IClientStateUpdate,
	IClientInit,
	IServerMessage,
	IServerGameStateUpdate,
	IServerGameStart,
	IServerLogMessage,
	IServerRejection
} from "./ICommunication";

import Model from "../Model/Model";

type wsMessageHandler = (data:IServerMessage) => void;

export default class Server implements Connection {
	private ws: WebSocket = null;
	private url: string;
	private wsMsgHandler:wsMessageHandler;

	public constructor(secure:boolean = false, host:string = "localhost", port:number = 8080) {
		this.url = (secure ? "wss":"ws") + "://" + host + ":" + port;
	}

	public connect(name:string):Promise<void> {

		return new Promise<void>((resolve, reject) => {
			if(this.isConnected()) {
				reject(new Error("Already connected."));
			} else {
				console.log("Connecting...");
				this.ws = new WebSocket(this.url);
				
				this.ws.onopen = () => {
					console.log("Connected.");

					this.sendInit(name);

					resolve();
				};

				this.ws.onclose = () => {
					this.ws = null;
					this.wsMsgHandler = null;
					console.log("Connection closed.");
				};

				this.ws.onmessage = (e:MessageEvent) => {
					let data:IServerMessage;
					
					try {
						data = JSON.parse(e.data.toString());
					} catch(err) {
						console.error("Unable to parse server message!");
						console.log(err);
						console.log(e);
						return;
					}

					if(data.type === "msg") {
						console.log("Server Message: " + (<IServerLogMessage>data).msg);
					} else if(data.type === "reject") {
						console.log("Rejected by server! Reason: " + (<IServerRejection>data).reason);
					} else {
						if(this.wsMsgHandler) {
							this.wsMsgHandler(data);
						} else {
							console.warn("Unhandled message!");
							console.log(e.data);
						}
					}
				};
			}
		});
	}

	public waitForStart(): Promise<IServerGameStart> {
		console.log("Waiting for round start...");

		return new Promise<IServerGameStart>((resolve, reject) => {
			if(this.isConnected()) {
				this.wsMsgHandler = (data:IServerMessage) => {
					if(data.type === "start") {
						this.wsMsgHandler = null;
						resolve(<IServerGameStart>data);
					} else if(data.type === "lobby") {
						console.log("lobby update");
					} else {
						reject(new Error("Unexpected Server Message (type = " + data.type + ")"));
					}
				};
			} else {
				console.log("ready state: " + this.ws.readyState);
				reject(new Error("WFRS: Not connected."));
			}
		});
	}

	public disconnect() {
		if (this.ws) {
			// this.ws.readyState should always be !== CLOSED
			if (this.ws.readyState !== this.ws.CLOSING) {
				this.ws.close();
			}
		}
	}

	public isConnected() {
		return this.ws && this.ws.readyState === this.ws.OPEN;
	}

	public updateState(model:Model) {
		let msg: IClientStateUpdate = {
			type: "state",
			time: 0, // TODO: model time
			pos: { x: 0, y: 0},
			vel: { x: 0, y: 0},
			pow: model.Player.Force
		};
	}

	public setUpdateListener(listener: GameUpdateListener) {
		if(this.isConnected()) {
			this.wsMsgHandler = (data:IServerMessage) => {
				if(data.type === "state" || data.type === "map") {
					listener(<IServerGameStateUpdate>data);
				}
			};
		}
	}

	private sendInit(name:string):void {
		if(this.isConnected()) {
			let msg:IClientInit = {
				type: "init",
				name: name
			}

			this.ws.send(JSON.stringify(msg));
		}
	}
}