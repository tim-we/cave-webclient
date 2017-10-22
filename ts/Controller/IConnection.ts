import Game from "../Model/Game";
import {
	IServerGameStart,
	IServerGameStateUpdate,
	IServerMapUpdate,
	IServerLobbyUpdate
} from "./ICommunication";

export type GameUpdateListener = (data: IServerGameStateUpdate | IServerMapUpdate) => void;

export interface Connection {
	connect: (name:string) => Promise<IServerLobbyUpdate>;

	waitForStart: () => Promise<IServerGameStart>;

	disconnect: () => void;

	isConnected: () => boolean;

	updateState: (model:Game) => void;

	setUpdateListener: (x:GameUpdateListener) => void;
}