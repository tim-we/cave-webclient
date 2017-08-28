export enum InputMethods {
	MOUSE,
	KEYBOARD,
	TOUCH,
	//CONTROLLER
}

enum Keys {
	SPACE = 32,
	ENTER = 13,
	ESC = 27,
	CTRL = 17,
	ALT = 18,
	SHIFT = 16
}

export var Input: InputMethods = InputMethods.MOUSE;

var pressed: boolean = false;

export function isPressed(): boolean {
	return pressed;
}

// -------------------------------------------------------------

// mouse event listeners
document.addEventListener("mousedown", function (e: MouseEvent) {
	if (Input === InputMethods.TOUCH) { return; }

	Input = InputMethods.MOUSE;

	pressed = true;
});

document.addEventListener("mouseup", function (e: MouseEvent) {
	if (Input === InputMethods.TOUCH) { return; }
	
	pressed = false;
});

document.addEventListener("mouseout", function (e: MouseEvent) {
	if (Input === InputMethods.TOUCH) { return; }
	
	pressed = false;
});

// disable context menu
window.oncontextmenu = function (e) {
	e.stopPropagation();
	return false;
}

// touch event listener
document.addEventListener("touchstart", function (e: TouchEvent) {
	Input = InputMethods.TOUCH;

	touchHandler(e.touches);
});

document.addEventListener("touchend", function (e: TouchEvent) {
	touchHandler(e.touches);
});

document.addEventListener("touchcancel", function (e: TouchEvent) {
	touchHandler(e.touches);
});

function touchHandler(tl: TouchList): void {
	pressed = tl.length > 0;
}

// keyboard event handlers

var keys_pressed:number[] = [];

function keyboardUpdateHandler():void {
	if (Input === InputMethods.KEYBOARD) {
		pressed = keys_pressed.indexOf(Keys.SPACE) !== -1;
	}
}

document.addEventListener("keydown", function (e: KeyboardEvent) {
	Input = InputMethods.KEYBOARD;

	//when hold down the keydown event will trigger with every frame (~16ms)
	if (keys_pressed.indexOf(e.keyCode) === -1) {
		keys_pressed.push(e.keyCode);
	}

	keyboardUpdateHandler();
});

document.addEventListener("keyup", function (e: KeyboardEvent) {
	//remove all instances
	keys_pressed = keys_pressed.filter(k => { return k !== e.keyCode; });

	keyboardUpdateHandler();
});