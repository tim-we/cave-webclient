export interface IVector {
	x: number,
	y: number;
}

export interface IPlayerData {
	pos: IVector;
	alv: boolean; // alive
}

export interface IPlayerInitData {
	name: string;
	color: number;
}

/* --------------------------------------------------------- */

export interface IClientMessage {
	type: "state" | "init";
}

export interface IClientStateUpdate extends IClientMessage {
	type: "state";
	time: number;
	pos: IVector; // position
	vel: IVector; // velocity
	pow: boolean; // input pressed?
	alv: boolean; // alive
}

export interface IClientInit extends IClientMessage {
	type: "init";
	name: string;
}

/* --------------------------------------------------------- */

export interface IServerMessage {
	type: "start" | "map" | "state" | "lobby" | "msg" | "reject";
}

export interface IServerGameStart extends IServerMessage {
	type: "start";
	playerInitData: IPlayerInitData[];
	index: number;
	time: number;
	mapInit: number[]; // length === 8 (4 2D points)
	rotation: number;
}

export interface IServerGameStateUpdate extends IServerMessage {
	type: "state";
	time: number;
	pdata: IPlayerData[];
	speed: number; // main axis velocity
}

export interface IServerMapUpdate extends IServerMessage {
	type: "map";
	data: number[];
}

export interface IServerLobbyUpdate extends IServerMessage {
	type: "lobby";
	players: string[];
	msg: string;
}

export interface IServerLogMessage extends IServerMessage {
	type: "msg";
	msg: string;
}

export interface IServerRejection extends IServerMessage {
	type: "reject";
	reason: string;
}