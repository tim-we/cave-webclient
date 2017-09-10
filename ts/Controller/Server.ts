import { Connection } from "./IConnection";
import { IClientStateUpdate } from "./ICommunication"

export default class Server implements Connection {
	private ws: WebSocket = null;
	private url: string;

	public constructor(secure:boolean = false, host:string = "localhost", port:number = 8000) {
		this.url = (secure ? "ws":"wss") + "://" + host + ":" + port;

		this.connect();
	}

	public connect():Promise<void> {
		let _this = this;

		return new Promise<void>((resolve, reject) => {
			if(!_this.isConnected()) {
				reject();
			} else {
				_this.ws = new WebSocket(this.url);

				_this.ws.onclose = () => {
					_this.ws = null;
				};

				resolve();
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

	public sendInput(pressed: boolean) {
		let msg: IClientStateUpdate = {
			type: "state",
			time: 0, // TODO: model time
			pos: { x: 0, y: 0},
			vel: { x: 0, y: 0},
			pow: pressed
		};
	}
}