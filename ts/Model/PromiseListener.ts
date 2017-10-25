type Resolver = () => any;

export default class PromiseListener {
	private resolves: Resolver[] = [];

	public add(resolve: Resolver): void {
		this.resolves.push(resolve);
	}

	public resolve(args:any[] = []): void {
		let tmp: Resolver[] = this.resolves;
		this.resolves = [];

		tmp.forEach(resolve => {
			resolve.apply(this, args);
		},this);
	}

	public clear(): void {
		this.resolves.length = 0;
	}
}