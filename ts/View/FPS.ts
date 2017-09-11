var display:HTMLDivElement = null;

var lastDisplayUpdate:number;
var frames:number = 0;

export function enable() {
    if(display === null) {
        display = <HTMLDivElement>document.querySelector("#fps");
    }

    display.classList.add("show");

    reset();
}

export function disable() {
    display.classList.remove("show");
}

export function frame() {
    if(Date.now() - lastDisplayUpdate > 1000) {
        updateDisplay();
        frames = 0;
    }

    frames++;
}

function reset() {
    lastDisplayUpdate = Date.now();
    frames = 0;
}

function updateDisplay() {
    lastDisplayUpdate = Date.now();
    display.innerHTML = frames.toString();
}