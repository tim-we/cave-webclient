import Model from "../Model/Model";
import {
	IServerGameStart,
	IServerGameStateUpdate
} from "./ICommunication";

export type GameStateUpdateListener = (data: IServerGameStateUpdate) => void;

export interface Connection {
	connect: (name:string) => Promise<void>;

	waitForStart: () => Promise<IServerGameStart>;

	disconnect: () => void;

	isConnected: () => boolean;

	updateState: (model:Model) => void;

	setStateUpdateListener: (x:GameStateUpdateListener) => void;
}