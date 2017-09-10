export interface Connection {
	connect: () => Promise<void>;

	disconnect: () => void;

	isConnected: () => boolean;

	sendInput: (pressed:boolean) => void;
}