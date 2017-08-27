import { Connection } from "./IConnection";
import { ServerGameMessage } from "./ICommunication";

type ServerGameUpdateHandler = (data: ServerGameMessage) => void;

const UPDATE_RATE = 200;

export default class LocalTestServer implements Connection {

	private connected: boolean = false;
	private updateHandler: ServerGameUpdateHandler;
	private updateInterval: number;
	private RoundStart: number;
	private Rotation: number = 0.0;

	public constructor(updateHandler:ServerGameUpdateHandler) {
		this.updateHandler = updateHandler;

		this.RoundStart = Date.now() + 3;
	}

	public connect() {
		this.connected = true;

		let _this = this;

		this.updateInterval = setInterval(() => {
			let time: number = Date.now() - _this.RoundStart;
			_this.Rotation += 0.01;

			_this.updateHandler({
				type: 1,
				t: time,
				ps: [{
					x: 0.08 * Math.cos(0.002 * time),
					y: 0.08 * Math.sin(0.005 * time)
				}], // positions
				as: [true], // alive status
				r: _this.Rotation
			});
		}, UPDATE_RATE);
	}

	public disconnect() {
		this.connected = false;

		clearInterval(this.updateInterval);
	}

	public isConnected() {
		return this.connected;
	}

	public sendInput(pressed:boolean) {
		
	}

}