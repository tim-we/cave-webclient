import Model from "../Model/Model";
import { IServerGameStart } from "./ICommunication";

export interface Connection {
	connect: () => Promise<void>;

	waitForStart: () => Promise<IServerGameStart>;

	disconnect: () => void;

	isConnected: () => boolean;

	updateState: (model:Model) => void;
}