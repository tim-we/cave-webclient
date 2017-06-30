export interface ServerGameInit {
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