import Model from "../Model/Model";
import {
	IServerGameStart,
	IServerGameStateUpdate,
	IServerMapUpdate
} from "./ICommunication";

export type GameUpdateListener = (data: IServerGameStateUpdate | IServerMapUpdate) => void;

export interface Connection {
	connect: (name:string) => Promise<void>;

	waitForStart: () => Promise<IServerGameStart>;

	disconnect: () => void;

	isConnected: () => boolean;

	updateState: (model:Model) => void;

	setUpdateListener: (x:GameUpdateListener) => void;
}