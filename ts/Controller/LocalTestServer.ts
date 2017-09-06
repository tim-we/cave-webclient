import { Connection } from "./IConnection";
import { IServerGameStateUpdate } from "./ICommunication";

type ServerGameUpdateHandler = (data: IServerGameStateUpdate) => void;

const UPDATE_RATE = 100;

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
				type: "state",
				time: time,
				pdata: [{
					pos: { x: 0, y: 0 },
					vel: { x: 0, y: 0 },
					alv: true
				}],
				rotation: _this.Rotation
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