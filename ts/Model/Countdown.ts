type CountdownListener = (t: number) => any;
type PromiseResolver = () => any;

export default class Countdown {
	private Listeners: CountdownListener[] = [];

	private PromiseResolvers: PromiseResolver[] = [];

	private TimeLeft: number;

	private expired: boolean = false;

	constructor(time: number) {
		this.TimeLeft = time;
	}

	public addListener(listener: CountdownListener): void {
		this.Listeners.push(listener);

		if (!this.expired) {
			listener(this.TimeLeft);
		}
	}

	private notify() {
		let t: number = this.TimeLeft;
		this.Listeners.forEach(listener => listener(t));
	}

	public update(gameTime:number): void {
		if (this.expired) { return; }

		let t: number = Math.ceil(Math.abs(gameTime));

		if (t !== this.TimeLeft) {
			this.TimeLeft = t;
			this.notify();
		}

		if (gameTime >= 0) {
			this.expired = true;

			this.PromiseResolvers.forEach(resolve => resolve());

			// clear listener references for gc
			this.Listeners.length = 0;
		}
	}

	public waitForGameStart(): Promise<void> {
		let _this = this;
		return new Promise<void>(resolve => {
			_this.PromiseResolvers.push(resolve);
		});
	}
}