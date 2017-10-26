const VERSION = 1;

const DEFAULT = {
	version: VERSION,
	antialias: true,
	lowShaderQuality: false,
	fx: true
};

let data:any = {};

export function get<T>(key: string): T {
	if (data[key] !== undefined) {
		return <T>data[key];
	} else {
		return null;
	}
}

export function set<T>(key: string, value: T): void {
	// store flag
	let s: boolean = false;

	if (data[key] === undefined) {
		console.warn(`Key ${key} was not set before.`);
		s = true;
	} else {
		if (value !== data[key]) {
			s = true;
		}
	}

	data[key] = value;

	if (s) { store(); }
}

function init() {
	let d = localStorage.getItem("data");

	if (d) {
		data = JSON.parse(d);

		console.assert(data.version === VERSION, "Corrupted data detected (LS).");
	} else {
		// copy & store
		data = Object.assign({}, DEFAULT);
		store();
	}
}

function store() {
	localStorage.setItem("data", JSON.stringify(data));
}

init();