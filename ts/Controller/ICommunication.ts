export interface ServerGameInit {
	type: 0;
	n: number; // number of players
	i: number; // this players index
	t: number; // time
	names: string[]; // player names
}

// client -> server
export interface ClientMessage {
	action: "input",
	value: boolean
}

interface SVector {
	x: number,
	y: number
}

export interface ServerGameMessage {
	type: 1;
	t: number; // time
	ps: SVector[]; // positions
	as: boolean[]; // alive status (true => alive)
	r: number; // rotation
}