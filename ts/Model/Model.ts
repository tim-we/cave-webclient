import Game from "./Game";
import * as View from "../View/View";

import {
	IServerGameStart
} from "../Protocol/ICommunication";

var game: Game = null;

export function getGame(): Game {
	return game;
}

export function newGame(data:IServerGameStart): Game{
	game = new Game(data);

	View.notifyGameChanged();

	return game;
}