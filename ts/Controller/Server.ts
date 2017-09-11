import {
	Connection,
	GameStateUpdateListener
} from "./IConnection";

import {
	IClientStateUpdate,
	IServerMessage,
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
	private stateUpdateListener:GameStateUpdateListener = null;

	public constructor(secure:boolean = false, host:string = "localhost", port:number = 8000) {
		this.url = (secure ? "ws":"wss") + "://" + host + ":" + port;

		this.connect();
	}

	public connect():Promise<void> {

		return new Promise<void>((resolve, reject) => {
			if(!this.isConnected()) {
				reject();
			} else {
				console.log("Connecting...");
				this.ws = new WebSocket(this.url);
				console.log("Connected.");

				this.ws.onclose = () => {
					this.ws = null;
					this.stateUpdateListener = null;
				};

				this.ws.onmessage = (e:MessageEvent) => {
					let data:IServerMessage = JSON.parse(e.data.toString());

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

				resolve();
			}
		});
	}

	public waitForStart(): Promise<IServerGameStart> {
		console.log("Waiting for round start...");

		return new Promise<IServerGameStart>((resolve, reject) => {
			if(this.isConnected()) {
				this.wsMsgHandler = (data:IServerMessage) => {
					if(data.type === "start") {
						resolve(<IServerGameStart>data);
					} else if(data.type === "lobby") {
						console.log("lobby update");
					} else {
						reject("Unexpected Server Message (type = " + data.type + ")");
					}
				};
			} else {
				reject();
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

		this.stateUpdateListener = null;
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

	public setStateUpdateListener(listener: GameStateUpdateListener) {
		if(this.isConnected()) {
			this.stateUpdateListener = listener;
		}
	}
}