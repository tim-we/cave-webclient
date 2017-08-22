export interface Connection {
	connect: () => void;

	disconnect: () => void;

	isConnected: () => boolean;

	sendInput: (pressed:boolean) => void;
}