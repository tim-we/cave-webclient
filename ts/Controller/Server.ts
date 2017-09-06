import { Connection } from "./IConnection";
import { IClientStateUpdate } from "./ICommunication"

export default class Server implements Connection {
	private ws: WebSocket = null;
	private url: string;

	public constructor(url:string = "ws://destroids.io:8000") {
		this.url = url;

		this.connect();
	}

	public connect() {
		if (!this.isConnected()) {
			this.ws = new WebSocket(this.url);

			let _this = this;

			this.ws.onclose = () => {
				_this.ws = null;
			};
		}
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