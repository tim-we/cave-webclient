export abstract class Transition {
	private Started: number = Date.now();
	private Duration: number;
	private expired: boolean = false;

	constructor(duration: number) {
		if (duration <= 0) {
			throw new Error(`Illegal argument! (duration=${duration})`);
		}

		this.Duration = duration;
	}

	public getProgress(): number {
		let p: number = (Date.now() - this.Started) / this.Duration;

		if (p >= 1.0) {
			this.expired = true;
		}

		return Math.min(p, 1.0);
	}

	public hasExpired(): boolean {
		return this.expired;
	}
}

export class CircleReveal extends Transition {
	public x: number;
	public y: number;

	constructor(x:number, y:number) {
		super(750);

		this.x = x;
		this.y = y;
	}
}