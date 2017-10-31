import Game from "./Game";
import Player from "./Player";

import { Transition, CircleReveal } from "./Transitions";
import * as View from "../View/View";
import { Connection } from "../Controller/IConnection";

import {
	IServerGameStart,
	IClientStateUpdate
} from "../Protocol/ICommunication";

var game: Game = null;
var connection: Connection = null;
var transition: Transition = null;

export function setConnection(c: Connection): void { connection = c; }
export function getConnection(): Connection { return connection; }

export function getGame(): Game {
	return game;
}

export function newGame(data:IServerGameStart): Game{
	game = new Game(data);

	transition = new CircleReveal(-0.25, 0);
	View.notifyGameChanged();

	game.waitForEnd().then(g => {
		game = null;
	});

	return game;
}

export function update(): void {
	if (game) {
		game.update();
	}
}

export function getTransition():Transition {
	if (transition) {
		if (transition.hasExpired()) {
			transition = null;
			return null;
		} else {
			return transition;
		}
	} else {
		return null;
	}
}

// send client state to server
setInterval(() => {
	if (game && connection) {
		connection.updateState(game);
	}
}, 40);