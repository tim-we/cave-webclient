import Game from "./Game";
import { Transition, CircleReveal } from "./Transitions";
import * as View from "../View/View";

import {
	IServerGameStart
} from "../Protocol/ICommunication";

var game: Game = null;

var transition: Transition = null;

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