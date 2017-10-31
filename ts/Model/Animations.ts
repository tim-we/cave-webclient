import Player from "./AbstractPlayer";

export abstract class Animation {
	private Start: number;
	private Duration: number;
	private expired: boolean;

	constructor(duration: number) {
		this.Start = Date.now();
		this.Duration = duration;
		this.expired = false;
	}

	public getProgress(): number {
		let p: number = (Date.now() - this.Start) / this.Duration;

		if (p >= 1.0) {
			this.expired = true;
			return 1.0;
		}

		return Math.max(0.0, p);
	}

	public hasExpired(): boolean { return this.expired; }
}

export class AnimationManager {
	private Animations: Animation[] = [];

	public get(): Animation[] {
		return this.Animations;
	}

	public add(a: Animation): void {
		this.Animations.push(a);
	}

	public cleanUp(): void {
		this.Animations = this.Animations.filter(a => !a.hasExpired());
	}
}

const N: number = 42;

export class DeathExplosion extends Animation {
	public Player: Player;

	public Data: Float32Array;

	constructor(player:Player) {
		super(250);

		this.Player = player;

		this.Data = new Float32Array(N * 2 * 2);
		this.generateData();
	}

	private generateData() {
		let o: number;

		for (let i = 0; i < N; i++) {
			o = i * 2 * 2;

			// alpha
			this.Data[o] = this.Data[o + 2] = 2.0 * Math.PI * Math.random();
			// d
			this.Data[o + 1] = -Math.random(); // inner point
			this.Data[o + 3] = Math.random(); // outer point
		}
	}

	public getN(): number {
		return N;
	}
}