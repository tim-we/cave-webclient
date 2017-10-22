var logDOMRef: HTMLElement = null;

window.addEventListener("load", () => {
	logDOMRef = document.getElementById("log");
});

class LogEntry {
	private time: number = Date.now();
	private ref: HTMLParagraphElement;
	private duration: number;

	constructor(text: string, classes?: string[], duration: number = 4200) {
		let p: HTMLParagraphElement = document.createElement("p");
		p.innerText = text;

		if (classes) {
			classes.forEach(c => p.classList.add(c));
		}

		this.ref = p;
		this.duration = duration;
		if (visibleLogs.length > 0) {
			this.time = Math.max(Date.now(), visibleLogs[visibleLogs.length-1].time + 250);
		}

		logDOMRef.appendChild(p);
	}

	public hasExpired(): boolean {
		return (Date.now() - this.time) > this.duration;
	}

	public remove(): void {
		this.ref.remove();
	}
}

var visibleLogs: LogEntry[] = [];

export function log(text:string, log2console:boolean = false): void {
	if (log2console) { console.log(text); }

	visibleLogs.push(new LogEntry(text));
}

export function error(text:string, log2console:boolean = true): void {
	if (log2console) { console.error(text); }

	visibleLogs.push(new LogEntry(text, ["error"], 8000));
}

setInterval(() => {
	// remove expired logs
	while (visibleLogs.length > 0 && visibleLogs[0].hasExpired()) {
		visibleLogs.shift().remove();
	}
}, 250);