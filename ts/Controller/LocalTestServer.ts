import { Connection } from "./IConnection";

export default class LocalTestServer implements Connection {

	private connected: boolean = false;

	public connect() {
		this.connected = true;
	}

	public disconnect() {
		this.connected = false;
	}

	public isConnected() {
		return this.connected;
	}

	public sendInput(pressed:boolean) {
		
	}

}