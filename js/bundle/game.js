/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x = 0.0, y = 0.0) {
        this.data = new Float32Array(2);
        this.data[0] = x;
        this.data[1] = y;
    }
    getX() {
        return this.data[0];
    }
    getY() {
        return this.data[1];
    }
    set(x, y) {
        this.data[0] = x;
        this.data[1] = y;
    }
    diff2d(x, y, delta) {
        delta.data[0] = x - this.data[0];
        delta.data[1] = y - this.data[1];
    }
    length() {
        return Math.sqrt(this.data[0] * this.data[0] + this.data[1] * this.data[1]);
    }
    static axpy(a, x, y) {
        y.data[0] += a * x.data[0];
        y.data[1] += a * x.data[1];
    }
    static axpy2(a, x, y, result) {
        result.data[0] = y.data[0] + a * x.data[0];
        result.data[1] = y.data[1] + a * x.data[1];
    }
    static distance2(a, b) {
        let dx = a.data[0] - b.data[0];
        let dy = a.data[1] - b.data[1];
        return dx * dx + dy * dy;
    }
    ortho(result = new Vector()) {
        let x = this.data[0];
        result.data[0] = this.data[1];
        result.data[1] = -x;
        return result;
    }
    copyFrom(v) {
        this.data[0] = v.data[0];
        this.data[1] = v.data[1];
    }
    clone() {
        return new Vector(this.data[0], this.data[1]);
    }
    scale(x) {
        this.data[0] *= x;
        this.data[1] *= x;
    }
    toString() {
        return "(" + this.data[0] + "," + this.data[1] + ")";
    }
}
exports.default = Vector;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function makeShader(gl, type, source) {
    console.assert(type === gl.VERTEX_SHADER || type === gl.FRAGMENT_SHADER);
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error ", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
exports.makeShader = makeShader;
function createProgram(gl, shaders) {
    console.assert(shaders.length > 0);
    let program = gl.createProgram();
    shaders.forEach(shader => gl.attachShader(program, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program.", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}
exports.createProgram = createProgram;
function createProgramFromSource(gl, vssource, fssource) {
    let shaders = [
        makeShader(gl, gl.VERTEX_SHADER, vssource),
        makeShader(gl, gl.FRAGMENT_SHADER, fssource)
    ];
    let shaderProgram = createProgram(gl, shaders);
    return shaderProgram;
}
exports.createProgramFromSource = createProgramFromSource;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __webpack_require__(10);
const Transitions_1 = __webpack_require__(7);
const View = __webpack_require__(8);
var game = null;
var transition = null;
function getGame() {
    return game;
}
exports.getGame = getGame;
function newGame(data) {
    game = new Game_1.default(data);
    transition = new Transitions_1.CircleReveal(-0.25, 0);
    View.notifyGameChanged();
    return game;
}
exports.newGame = newGame;
function getTransition() {
    if (transition) {
        if (transition.hasExpired()) {
            transition = null;
            return null;
        }
        else {
            return transition;
        }
    }
    else {
        return null;
    }
}
exports.getTransition = getTransition;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __webpack_require__(0);
const Color_1 = __webpack_require__(6);
exports.TAILLENGTH = 100;
const TAILNODESIZE = 2 * (2 + 1);
const TAILWIDTH = 0.005;
const STARTSPEED = new Vector_1.default(0.0, 1.0);
var tmp = new Vector_1.default();
class AbstractPlayer {
    constructor(data, layer) {
        this.Position = new Vector_1.default(0.0, 0.0);
        this.Velocity = STARTSPEED.clone();
        this.VelOrthoDir = new Vector_1.default(0.0, 0.0);
        this.Layer = layer;
        this.Alive = true;
        this.Color = Color_1.default.create(data.color);
        this.Tail = new Float32Array(exports.TAILLENGTH * TAILNODESIZE);
        let h = 1.0 / (exports.TAILLENGTH - 1);
        for (let i = 0; i < exports.TAILLENGTH; i++) {
            this.Tail[i * TAILNODESIZE + 2] = i * h;
            this.Tail[i * TAILNODESIZE + 5] = i * h;
        }
    }
    updateVelocity(x, y) {
        this.Velocity.set(clamp(x, -1, 1), y);
        this.Velocity.ortho(this.VelOrthoDir);
        this.VelOrthoDir.scale(1.0 / this.VelOrthoDir.length());
    }
    updateXVelocity(x) {
        this.updateVelocity(this.Velocity.getX() + x, this.Velocity.getY());
    }
    move(t) {
        Vector_1.default.axpy(t, this.Velocity, this.Position);
        this.updateTail();
    }
    updateTail() {
        let n = this.Tail.length;
        shiftTailData(this.Tail);
        Vector_1.default.axpy2(TAILWIDTH, this.VelOrthoDir, this.Position, tmp);
        this.Tail[n - 6] = tmp.getX();
        this.Tail[n - 5] = tmp.getY();
        Vector_1.default.axpy2(-TAILWIDTH, this.VelOrthoDir, this.Position, tmp);
        this.Tail[n - 3] = tmp.getX();
        this.Tail[n - 2] = tmp.getY();
    }
    die() {
        this.Alive = false;
        this.Velocity.set(0, 0);
    }
    static getTailVertexCount() {
        return exports.TAILLENGTH * 2;
    }
}
exports.default = AbstractPlayer;
function shiftTailData(data) {
    let i;
    let j;
    for (let k = 1; k < exports.TAILLENGTH; k++) {
        i = k * TAILNODESIZE;
        j = i - TAILNODESIZE;
        data[j + 0] = data[i + 0];
        data[j + 1] = data[i + 1];
        data[j + 3] = data[i + 3];
        data[j + 4] = data[i + 4];
    }
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var logDOMRef = null;
window.addEventListener("load", () => {
    logDOMRef = document.getElementById("log");
});
class LogEntry {
    constructor(text, classes, duration = 4200) {
        this.time = Date.now();
        let p = document.createElement("p");
        p.innerText = text;
        if (classes) {
            classes.forEach(c => p.classList.add(c));
        }
        this.ref = p;
        this.duration = duration;
        if (visibleLogs.length > 0) {
            this.time = Math.max(Date.now(), visibleLogs[visibleLogs.length - 1].time + 250);
        }
        logDOMRef.appendChild(p);
    }
    hasExpired() {
        return (Date.now() - this.time) > this.duration;
    }
    remove() {
        this.ref.remove();
    }
}
var visibleLogs = [];
function log(text, log2console = false) {
    if (log2console) {
        console.log(text);
    }
    visibleLogs.push(new LogEntry(text));
}
exports.log = log;
function error(text, log2console = true) {
    if (log2console) {
        console.error(text);
    }
    visibleLogs.push(new LogEntry(text, ["error"], 8000));
}
exports.error = error;
setInterval(() => {
    while (visibleLogs.length > 0 && visibleLogs[0].hasExpired()) {
        visibleLogs.shift().remove();
    }
}, 250);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function layerGetZ(index) {
    return 0.12 + index * 0.05;
}
exports.layerGetZ = layerGetZ;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Color {
    constructor(r, g, b, a = 1.0) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }
    setClearColor(gl) {
        gl.clearColor(this.red, this.green, this.blue, this.alpha);
    }
    setUniform3(gl, location) {
        gl.uniform3f(location, this.red, this.green, this.blue);
    }
    setUniform4(gl, location) {
        gl.uniform4f(location, this.red, this.green, this.blue, this.alpha);
    }
    static interpolate(a, b, x, result) {
        let xa = 1.0 - x;
        result.red = xa * a.red + x * b.red;
        result.green = xa * a.green + x * b.green;
        result.blue = xa * a.blue + x * b.blue;
        result.alpha = xa * a.alpha + x * b.alpha;
    }
    static create(preset) {
        return new Color(1.0, 0.2, 0.0);
    }
}
exports.default = Color;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Transition {
    constructor(duration) {
        this.Started = Date.now();
        this.expired = false;
        if (duration <= 0) {
            throw new Error(`Illegal argument! (duration=${duration})`);
        }
        this.Duration = duration;
    }
    getProgress() {
        let p = (Date.now() - this.Started) / this.Duration;
        if (p >= 1.0) {
            this.expired = true;
        }
        return Math.min(p, 1.0);
    }
    hasExpired() {
        return this.expired;
    }
}
exports.Transition = Transition;
class CircleReveal extends Transition {
    constructor(x, y) {
        super(750);
        this.x = x;
        this.y = y;
    }
}
exports.CircleReveal = CircleReveal;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Model = __webpack_require__(2);
const Renderer = __webpack_require__(16);
const FPS = __webpack_require__(30);
var canvas;
var drawAgain = false;
var afterDraw;
function init(afterDrawHook) {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    afterDraw = afterDrawHook;
    Renderer.init(canvas);
    window.addEventListener("resize", function () {
        let w = window.innerWidth;
        let h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        Renderer.resize(w, h);
    });
    FPS.enable();
}
exports.init = init;
function notifyGameChanged() {
    Renderer.setGame(Model.getGame());
}
exports.notifyGameChanged = notifyGameChanged;
function startDrawLoop(drawLoop = true) {
    drawAgain = drawLoop;
    draw();
}
exports.startDrawLoop = startDrawLoop;
function stopDrawLoop() {
    drawAgain = false;
}
exports.stopDrawLoop = stopDrawLoop;
function draw() {
    Renderer.draw();
    if (drawAgain) {
        window.requestAnimationFrame(draw);
    }
    FPS.frame();
    afterDraw();
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Model = __webpack_require__(2);
const View = __webpack_require__(8);
const UserInput = __webpack_require__(31);
const GameLog = __webpack_require__(4);
const Server_1 = __webpack_require__(32);
var connection = new Server_1.default();
window.addEventListener("load", () => {
    GameLog.log("Inititalizing view components...");
    View.init(mainloop);
    GameLog.log("Connecting...");
    connection.connect("Ulysses")
        .then(() => {
        GameLog.log("Waiting for round to start...");
        return connection.waitForStart();
    }, (reason) => {
        GameLog.error("Connection failed: " + reason);
    })
        .then((data) => {
        connection.setUpdateListener(serverUpdateHandler);
        GameLog.log("Starting game!");
        Model.newGame(data);
        mainloop();
        View.startDrawLoop();
        Model.getGame().Countdown.addListener(t => {
            GameLog.log(`${t}...`);
        });
        return Model.getGame().Countdown.waitForGameStart();
    })
        .then(() => {
        GameLog.log("Go!");
        setTimeout(() => {
            Model.getGame().Player.setFirstInputReceived();
        }, 1000);
    })
        .catch((reason) => {
        GameLog.error("Something went wrong: " + reason);
    });
});
function mainloop() {
    let game = Model.getGame();
    if (game) {
        game.Player.setForce(UserInput.isPressed());
        if (game.aliveCount() > 0) {
            game.update();
        }
    }
}
function serverUpdateHandler(data) {
    let game = Model.getGame();
    if (game) {
        game.updateData(data);
    }
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(11);
const OnlinePlayer_1 = __webpack_require__(12);
const Camera_1 = __webpack_require__(13);
const Countdown_1 = __webpack_require__(14);
const Map_1 = __webpack_require__(15);
class Game {
    constructor(data) {
        this.Speed = 0.42;
        let n = data.playerInitData.length;
        console.assert(n > 0);
        console.assert(data.time < 0, "unexpected: data.time = " + data.time);
        this.Time = data.time;
        this.NextTime = data.time;
        this.TimeDelta = 0.0;
        this.LastUpdate = performance.now();
        this.Countdown = new Countdown_1.default(Math.max(3, Math.abs(this.Time)));
        this.Camera = new Camera_1.default(0, -0.5, data.rotation);
        this.OnlinePlayers = new Array(n - 1);
        let j = 0;
        this.Player = new Player_1.default(data.playerInitData[data.index], 0.05);
        for (let i = 0; i < n - 1; i++) {
            if (data.index === i) {
                j++;
            }
            else {
                this.OnlinePlayers[j] = new OnlinePlayer_1.default(data.playerInitData[j], j + 1);
                j++;
            }
        }
        Object.freeze(this.OnlinePlayers);
        this.Map = new Map_1.default(data.mapInit);
    }
    updateData(data) {
        if (data.type === "state") {
            this.updateState(data);
        }
        else if (data.type === "map") {
            this.Map.update(data);
        }
    }
    updateState(data) {
        console.assert(data.time >= this.NextTime);
        this.TimeDelta = Math.max(0.0333, data.time - this.Time);
        this.NextTime = data.time;
        this.OnlinePlayers.forEach((p, i) => {
            p.updateData(data.pdata[i], this.TimeDelta);
        });
        this.Camera.setRotation(data.rotation, this.TimeDelta);
        if (data.speed !== this.Speed) {
        }
    }
    update() {
        let t = (performance.now() - this.LastUpdate) / 1000;
        this.LastUpdate = performance.now();
        this.Time = Math.min(this.Time + t, this.NextTime);
        this.Countdown.update(this.Time);
        if (this.Time >= 0) {
            if (this.Player.Alive) {
                this.Player.move(t);
                let d = this.Map.getDistanceToWall(this.Player.Position);
                if (d > 0.0) {
                    this.Player.update(t);
                }
                else {
                    this.Player.die();
                }
            }
            this.OnlinePlayers.forEach(p => {
                p.move(t);
            });
        }
        this.Camera.update(this, t);
    }
    aliveCount() {
        let n = this.Player.Alive ? 1 : 0;
        this.OnlinePlayers.forEach(p => {
            if (p.Alive) {
                n++;
            }
        });
        return n;
    }
}
exports.default = Game;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPlayer_1 = __webpack_require__(3);
const Vector_1 = __webpack_require__(0);
const GameLog = __webpack_require__(4);
const ACCELERATION = new Vector_1.default(0.03, 0.0);
var tmp = 0;
class Player extends AbstractPlayer_1.default {
    constructor(data, index) {
        super(data, 0);
        this.Force = false;
        this.FirstInputReceived = false;
        this.Position.set(0, -0.5);
        this.Index = index;
    }
    setForce(value) {
        if (!this.FirstInputReceived && value) {
            this.FirstInputReceived = true;
        }
        this.Force = value;
    }
    setFirstInputReceived() { this.FirstInputReceived = true; }
    getForce() { return this.Force; }
    update(t) {
        if (this.FirstInputReceived) {
            this.updateXVelocity(this.Force ? -ACCELERATION.getX() : ACCELERATION.getX());
        }
        else {
            this.updateXVelocity(0);
        }
    }
    updateData(data, time) {
        throw new Error("Method not implemented.");
    }
    die() {
        GameLog.log("The player died.", true);
        super.die();
    }
}
exports.default = Player;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPlayer_1 = __webpack_require__(3);
const Vector_1 = __webpack_require__(0);
let tmp = new Vector_1.default(0.0, 0.0);
class OnlinePlayer extends AbstractPlayer_1.default {
    constructor(data, zPos) {
        super(data, zPos);
    }
    updateData(data, time) {
        console.assert(time > 0.0);
        this.Position.diff2d(data.pos.x, data.pos.y, tmp);
        tmp.scale(1.0 / time);
        this.updateVelocity(tmp.getX(), tmp.getY());
        if (this.Alive && !data.alv) {
            super.die();
        }
    }
}
exports.default = OnlinePlayer;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __webpack_require__(0);
const SPEED = 5;
const Offset = new Vector_1.default(0.0, 1.0);
const FULLCIRCLE = 2.0 * Math.PI;
let tmp1 = new Vector_1.default();
let tmp2 = Object.seal(new Array(0, 0));
let tmp3 = Object.seal(new Array(0, 0));
class Camera {
    constructor(x, y, rotation = 0) {
        this.Velocity = new Vector_1.default();
        this.RotationVelocity = 0;
        this.Position = new Vector_1.default(x, y);
        this.Rotation = rotation;
    }
    update(model, t) {
        Vector_1.default.axpy(t, this.Velocity, this.Position);
        this.Rotation += t * this.RotationVelocity;
        if (this.Rotation <= 0.0) {
            this.Rotation += FULLCIRCLE;
        }
        if (model.Player.Alive) {
            this.setTarget(model.Player.Position);
        }
        else {
            let target = tmp1;
            target.set(0, 0);
            let alive = 0;
            model.OnlinePlayers.forEach(p => {
                if (p.Alive) {
                    alive++;
                    Vector_1.default.axpy(1, p.Position, target);
                }
            });
            if (alive > 0) {
                target.scale(1 / alive);
                this.setTarget(target);
            }
            else {
                this.Velocity.scale(0.9);
            }
        }
    }
    setRotation(alpha, time = 0) {
        if (Math.abs(time) < 1e-12) {
            this.Rotation = alpha;
        }
        else if (time > 0) {
            let delta = alpha - this.Rotation;
            let delta2 = alpha - FULLCIRCLE - this.Rotation;
            if (Math.abs(delta2) < Math.abs(delta)) {
                delta = delta2;
            }
            this.RotationVelocity = delta / time;
        }
        else {
            this.RotationVelocity = 0;
        }
    }
    setTarget(target) {
        if (target !== tmp1) {
            tmp1.copyFrom(target);
            target = tmp1;
        }
        Vector_1.default.axpy(1, Offset, target);
        Vector_1.default.axpy2(-1, this.Position, target, this.Velocity);
        limitSpeed(this.Velocity);
    }
    setViewMatrix(view) {
        view.makeZRotation(this.Rotation);
        tmp2[0] = -this.Position.getX();
        tmp2[1] = -this.Position.getY();
        view.xvector(tmp2, tmp3);
        view.setEntry(0, 3, tmp3[0]);
        view.setEntry(1, 3, tmp3[1]);
    }
}
exports.default = Camera;
function limitSpeed(vel) {
    let l = vel.length();
    if (l > SPEED) {
        vel.scale(SPEED / l);
    }
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Countdown {
    constructor(time) {
        this.Listeners = [];
        this.PromiseResolvers = [];
        this.expired = false;
        this.TimeLeft = time;
    }
    addListener(listener) {
        this.Listeners.push(listener);
        if (!this.expired) {
            listener(this.TimeLeft);
        }
    }
    notify() {
        let t = this.TimeLeft;
        this.Listeners.forEach(listener => listener(t));
    }
    update(gameTime) {
        if (this.expired) {
            return;
        }
        let t = Math.ceil(Math.abs(gameTime));
        if (t !== this.TimeLeft) {
            this.TimeLeft = t;
            this.notify();
        }
        if (gameTime >= 0) {
            this.expired = true;
            this.PromiseResolvers.forEach(resolve => resolve());
            this.Listeners.length = 0;
        }
    }
    waitForGameStart() {
        let _this = this;
        return new Promise(resolve => {
            _this.PromiseResolvers.push(resolve);
        });
    }
}
exports.default = Countdown;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const N = 42;
const SEGMENT_SIZE = 2 * 3 * 2;
const SEGMENT_DATA_SIZE = 4 * 2;
var tmp = new Float32Array(SEGMENT_DATA_SIZE);
class Map {
    constructor(initData) {
        this.updateIndex = 0;
        this.insideCheckIndex = 0;
        this.TopData = new Float32Array(2 * 2);
        this.data = new Float32Array(SEGMENT_SIZE * N);
        this.version = 0;
        console.assert(initData.length === SEGMENT_DATA_SIZE, "Map: illegal init data (length: " + initData.length + ")");
        for (let i = 0; i < this.TopData.length; i++) {
            this.TopData[i] = initData[4 + i];
        }
        this.updateSegment(this.updateIndex, new Float32Array(initData));
        this.updateIndexNext();
    }
    numTriangles() {
        return 2 * N;
    }
    updateIndexNext() {
        this.updateIndex = (this.updateIndex + 1) % N;
    }
    update(data) {
        console.assert(data.type === "map", "Map.update: Illegal Argument!");
        if (data.data.length % 4 === 0) {
            let n = data.data.length / 4;
            let k, o, j;
            for (let i = 0; i < n; i++) {
                for (k = 0; k < this.TopData.length; k++) {
                    tmp[k] = this.TopData[k];
                }
                o = 4 * i;
                for (j = 0; j < this.TopData.length; j++) {
                    tmp[k + j] = this.TopData[j] = data.data[o + j];
                }
                this.updateSegment(this.updateIndex, tmp);
                this.updateIndexNext();
            }
        }
        else {
            console.error("Map.update: invalid update length " + data.data.length);
        }
    }
    updateSegment(segmentIndex, data) {
        console.assert(data.length === SEGMENT_DATA_SIZE, "Invalid segment data.");
        console.assert(0 <= segmentIndex && segmentIndex < N, "Index out of bounds. (updateSegment)");
        let offset = segmentIndex * SEGMENT_SIZE;
        let i, k = 0;
        for (i = 0; i < 3; i++) {
            this.updatePoint(segmentIndex, k++, data, i);
        }
        for (i = 1; i < 4; i++) {
            this.updatePoint(segmentIndex, k++, data, i);
        }
        this.version++;
    }
    updatePoint(segment, point, data, dataIndex) {
        let offset = SEGMENT_SIZE * segment + 2 * point;
        let dataOffset = dataIndex * 2;
        this.data[offset] = data[dataOffset];
        this.data[offset + 1] = data[dataOffset + 1];
    }
    getDistanceToWall(p) {
        let n = 0;
        let i = this.insideCheckIndex;
        let yTop, yBottom;
        while (n < N) {
            let offset = i * SEGMENT_SIZE;
            yBottom = this.data[offset + 1];
            yTop = this.data[offset + 5];
            if (yBottom <= p.getY() && p.getY() <= yTop) {
                this.insideCheckIndex = i;
                if (n > 1) {
                    console.log("Map: unexpected data order");
                }
                return this.getSegmentDistanceToWall(i, p);
            }
            else {
                i = (i + 1) % N;
            }
            n++;
        }
    }
    getSegmentDistanceToWall(index, p) {
        let offset = index * SEGMENT_SIZE;
        let yBottom = this.data[offset + 1];
        let yTop = this.data[offset + 5];
        let yDelta = yTop - yBottom;
        let rel = (p.getY() - yBottom) / yDelta;
        let left = this.data[offset] + rel * (this.data[offset + 4] - this.data[offset]);
        let right = this.data[offset + 2] + rel * (this.data[offset + 10] - this.data[offset + 2]);
        let x = p.getX();
        return Math.max(0, Math.min(x - left, right - x));
    }
}
exports.default = Map;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Model = __webpack_require__(2);
const Matrix_1 = __webpack_require__(17);
const MapRenderer = __webpack_require__(18);
const PlayerRenderer = __webpack_require__(21);
const TransitionRenderer = __webpack_require__(27);
const glOptions = {
    alpha: false,
    stencil: true,
    depth: false,
};
var gl = null;
var game = null;
var projMatrix = new Matrix_1.default();
var viewMatrix = new Matrix_1.default();
var transformMatrix = new Matrix_1.default();
function init(canvas) {
    try {
        gl = (canvas.getContext("webgl", glOptions) || canvas.getContext("experimental-webgl", glOptions));
    }
    catch (e) {
        console.warn("Error initializing webgl.");
        console.error(e);
        return;
    }
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }
    let contextAttributes = gl.getContextAttributes();
    console.assert(contextAttributes.stencil, "WebGL: stencil not available!");
    gl.enable(gl.STENCIL_TEST);
    gl.clearStencil(0);
    projMatrix.setEntry(3, 2, 1.0);
    projMatrix.setEntry(3, 3, 0.0);
    resize(window.innerWidth, window.innerHeight);
    MapRenderer.init(gl);
    PlayerRenderer.init(gl);
    TransitionRenderer.init(gl);
}
exports.init = init;
function setGame(g) {
    game = g;
    MapRenderer.setMap(game.Map);
}
exports.setGame = setGame;
function draw() {
    if (game === null) {
        return;
    }
    updateTransformation();
    MapRenderer.draw(transformMatrix);
    game.OnlinePlayers.forEach(player => { PlayerRenderer.draw(transformMatrix, player); });
    PlayerRenderer.draw(transformMatrix, game.Player);
    let t;
    if (t = Model.getTransition()) {
        TransitionRenderer.draw(t);
    }
}
exports.draw = draw;
function resize(width, height) {
    if (width > height) {
        projMatrix.makeScale(height / width, 1.0, 1.0, false);
    }
    else {
        projMatrix.makeScale(1.0, width / height, 1.0, false);
    }
    projMatrix.setEntry(3, 2, 1.0);
    gl.viewport(0, 0, width, height);
}
exports.resize = resize;
function updateTransformation() {
    game.Camera.setViewMatrix(viewMatrix);
    Matrix_1.default.multiply(projMatrix, viewMatrix, transformMatrix);
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Matrix {
    constructor() {
        this.data = new Float32Array(4 * 4);
        this.makeIdentity(false);
    }
    setEntry(row, column, value) {
        this.data[row + 4 * column] = value;
    }
    getEntry(row, column) {
        return this.data[row + 4 * column];
    }
    makeZero() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = 0;
        }
    }
    makeIdentity(zero = true) {
        if (zero) {
            this.makeZero();
        }
        for (let i = 0; i < 4; i++) {
            this.setEntry(i, i, 1.0);
        }
    }
    makeScale(x, y, z, zero = false) {
        if (zero) {
            this.makeZero();
        }
        this.setEntry(0, 0, x);
        this.setEntry(1, 1, y);
        this.setEntry(2, 2, z);
        this.setEntry(3, 3, 1);
    }
    makeZRotation(alpha, reset = false) {
        let c = Math.cos(alpha);
        let s = Math.sin(alpha);
        if (reset) {
            this.makeZero();
            this.setEntry(2, 2, 1.0);
            this.setEntry(3, 3, 1.0);
        }
        this.setEntry(0, 0, c);
        this.setEntry(1, 1, c);
        this.setEntry(0, 1, -s);
        this.setEntry(1, 0, s);
    }
    makeFrustum(width, height, znear, zfar, zero = false) {
        let div = 1.0 / (znear - zfar);
        if (zero) {
            this.makeZero();
        }
        this.setEntry(0, 0, 2.0 * znear / width);
        this.setEntry(1, 1, 2.0 * znear / height);
        this.setEntry(2, 2, (zfar + znear) * div);
        this.setEntry(2, 3, 2.0 * zfar * znear * div);
        this.setEntry(3, 2, -1.0);
    }
    scale(x, y, z) {
        for (let i = 0; i < 4; i++) {
            this.data[i] *= x;
        }
        for (let i = 4; i < 8; i++) {
            this.data[i] *= y;
        }
        for (let i = 8; i < 16; i++) {
            this.data[i] *= z;
        }
    }
    static multiply(a, b, result) {
        let i, j, k;
        let sum;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                sum = 0.0;
                for (k = 0; k < 4; k++) {
                    sum += a.getEntry(i, k) * b.getEntry(k, j);
                }
                result.setEntry(i, j, sum);
            }
        }
    }
    xvector(x, res = new Array(x.length)) {
        let sum, i, j;
        let n = Math.min(x.length, 4);
        for (i = 0; i < n; i++) {
            sum = 0.0;
            for (j = 0; j < n; j++) {
                sum += this.getEntry(i, j) * x[j];
            }
            res[i] = sum;
        }
        return res;
    }
    uniform(gl, location) {
        gl.uniformMatrix4fv(location, false, this.data);
    }
}
exports.default = Matrix;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(1);
const Color_1 = __webpack_require__(6);
const Tools_1 = __webpack_require__(5);
const NUM_LAYERS = 8;
const BLENDFACTOR = .37;
var data = null;
var bufferVersion = -1;
var gl = null;
var buffer = null;
var program = null;
var vertexPosAttrib = -1;
var uniformPM = null;
var uniformZ = null;
var uniformBlend = null;
var bgColor = new Color_1.default(0.0, 0.6, 0.05);
function init(_gl) {
    gl = _gl;
    buffer = gl.createBuffer();
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(19), __webpack_require__(20));
    vertexPosAttrib = gl.getAttribLocation(program, "vPosition");
    uniformPM = gl.getUniformLocation(program, "uPMatrix");
    uniformZ = gl.getUniformLocation(program, "zPos");
    uniformBlend = gl.getUniformLocation(program, "blendFactor");
}
exports.init = init;
function setMap(map) {
    data = map;
    bufferVersion = -1;
    updateBuffer();
}
exports.setMap = setMap;
function updateBuffer() {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.data, gl.STATIC_DRAW);
    bufferVersion = data.version;
}
function draw(proj) {
    bgColor.setClearColor(gl);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    if (!data) {
        return;
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program);
    gl.enableVertexAttribArray(vertexPosAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);
    for (let i = 0; i < NUM_LAYERS; i++) {
        drawLayer(i, proj);
    }
    gl.disable(gl.BLEND);
    if (bufferVersion < data.version) {
        setTimeout(updateBuffer, 1);
    }
}
exports.draw = draw;
function drawLayer(index, proj) {
    gl.stencilFunc(gl.LEQUAL, index, 0xFF);
    gl.uniform1f(uniformZ, Tools_1.layerGetZ(index));
    proj.uniform(gl, uniformPM);
    gl.uniform1f(uniformBlend, (index + 1 === NUM_LAYERS) ? 1.0 : BLENDFACTOR);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * data.numTriangles());
}


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 vPosition;\r\n\r\nuniform float zPos;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\nvoid main(void) {\r\n\tgl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n}"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\nuniform float blendFactor;\r\n\r\nvoid main(void) {\r\n\tgl_FragColor = vec4(.0, .0, .0, blendFactor);\r\n}"

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(1);
const TailRenderer = __webpack_require__(22);
const Tools_1 = __webpack_require__(5);
const RADIUS = 0.05;
var gl = null;
var buffer = null;
var program = null;
var vertexAttribSquare = -1;
var uniformRadius = null;
var uniformColor = null;
var uniformPM = null;
var uniformPos = null;
var uniformZ = null;
function init(_gl) {
    gl = _gl;
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    let data = new Float32Array(2 * 4);
    data[0] = -1.0;
    data[1] = -1.0;
    data[2] = -1.0;
    data[3] = 1.0;
    data[4] = 1.0;
    data[5] = -1.0;
    data[6] = 1.0;
    data[7] = 1.0;
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(25), __webpack_require__(26));
    vertexAttribSquare = gl.getAttribLocation(program, "squareCorner");
    uniformRadius = gl.getUniformLocation(program, "radius");
    uniformColor = gl.getUniformLocation(program, "pColor");
    uniformPM = gl.getUniformLocation(program, "uPMatrix");
    uniformPos = gl.getUniformLocation(program, "playerPosition");
    uniformZ = gl.getUniformLocation(program, "zPos");
    TailRenderer.init(_gl);
}
exports.init = init;
function draw(transform, player) {
    gl.enable(gl.BLEND);
    TailRenderer.draw(transform, player);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(vertexAttribSquare);
    gl.vertexAttribPointer(vertexAttribSquare, 2, gl.FLOAT, false, 2 * 4, 0);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilFunc(gl.LESS, 0, 0xFF);
    transform.uniform(gl, uniformPM);
    gl.uniform1f(uniformZ, Tools_1.layerGetZ(player.Layer));
    gl.uniform1f(uniformRadius, RADIUS);
    gl.uniform2f(uniformPos, player.Position.getX(), player.Position.getY());
    player.Color.setUniform4(gl, uniformColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disable(gl.BLEND);
}
exports.draw = draw;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(1);
const AbstractPlayer_1 = __webpack_require__(3);
const Tools_1 = __webpack_require__(5);
var gl = null;
var buffer = null;
var program = null;
var vertexAttribPos = -1;
var vertexAttribPow = -1;
var uniformColor = null;
var uniformPM = null;
var uniformZ = null;
function init(_gl) {
    gl = _gl;
    buffer = gl.createBuffer();
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(23), __webpack_require__(24));
    vertexAttribPos = gl.getAttribLocation(program, "vPosition");
    vertexAttribPow = gl.getAttribLocation(program, "vIntensity");
    uniformColor = gl.getUniformLocation(program, "pColor");
    uniformPM = gl.getUniformLocation(program, "uPMatrix");
    uniformZ = gl.getUniformLocation(program, "zPos");
}
exports.init = init;
function draw(transform, player) {
    gl.useProgram(program);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    if (player === null || player.Tail === null) {
        console.log("null!");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, player.Tail, gl.STREAM_DRAW);
    gl.enableVertexAttribArray(vertexAttribPos);
    gl.enableVertexAttribArray(vertexAttribPow);
    gl.vertexAttribPointer(vertexAttribPos, 2, gl.FLOAT, false, 3 * 4, 0);
    gl.vertexAttribPointer(vertexAttribPow, 1, gl.FLOAT, false, 3 * 4, 2 * 4);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilFunc(gl.LESS, 0, 0xFF);
    transform.uniform(gl, uniformPM);
    gl.uniform1f(uniformZ, Tools_1.layerGetZ(player.Layer));
    player.Color.setUniform4(gl, uniformColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, AbstractPlayer_1.default.getTailVertexCount());
}
exports.draw = draw;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 vPosition;\r\nattribute float vIntensity;\r\n\r\nuniform float zPos;\r\n\r\n// to be linkable, precision must be explicitly stated\r\nuniform mediump vec4 pColor;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\nvarying mediump float opacity;\r\n\r\nvoid main(void) {\r\n\tgl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n\r\n\topacity = vIntensity;\r\n}"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\nuniform mediump vec4 pColor; // inside color\r\n\r\nvarying mediump float opacity;\r\n\r\nvoid main(void) {\r\n\tgl_FragColor = vec4(pColor.rgb, opacity);\r\n}"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 squareCorner;\r\n\r\nuniform vec2 playerPosition;\r\nuniform float zPos;\r\nuniform float radius;\r\n\r\n// to be linkable, precision must be explicitly stated\r\nuniform mediump vec4 pColor;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\n// interpolate for the fragment-shader\r\nvarying vec2 cPos;\r\n\r\nvoid main(void) {\r\n\tfloat x = playerPosition.x + radius * squareCorner.x;\r\n\tfloat y = playerPosition.y + radius * squareCorner.y;\r\n\r\n\tgl_Position = uPMatrix * vec4(x, y, zPos, 1.0);\r\n\r\n\tcPos = squareCorner;\r\n}"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\nuniform mediump vec4 pColor; // inside color\r\n\r\nvarying vec2 cPos;\r\n\r\nconst vec4 CENTER  = vec4(1.0, 1.0, 1.0, 1.0);\r\nconst vec4 OUTSIDE = vec4(0.0, 0.0, 0.0, 0.0);\r\n\r\nvoid main(void) {\r\n\t\r\n\tfloat d = dot(cPos,cPos);\r\n\r\n\tif(d < 1.0) { // inside\r\n\t\tfloat r = sqrt(d);\r\n\r\n\t\tif(r <= 0.5) {\r\n\t\t\tgl_FragColor = mix(CENTER, pColor, 2.0 * r);\r\n\t\t} else {\r\n\t\t\t//gl_FragColor = mix(pColor, OUTSIDE, 2.0 * r - 1.0);\r\n\t\t\tgl_FragColor = vec4(pColor.rgb, 2.0 - 2.0 * r);\r\n\t\t}\r\n\t} else { // outside\r\n\t\tgl_FragColor = OUTSIDE;\r\n\t}\r\n}"

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(1);
const Transitions_1 = __webpack_require__(7);
var gl = null;
var buffer = null;
var program = null;
var vertexPosAttrib = -1;
var uniformTarget = null;
var uniformProgress = null;
var uniformRatio = null;
function init(_gl) {
    gl = _gl;
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(28), __webpack_require__(29));
    vertexPosAttrib = gl.getAttribLocation(program, "aPosition");
    uniformTarget = gl.getUniformLocation(program, "uPosition");
    uniformProgress = gl.getUniformLocation(program, "progress");
    uniformRatio = gl.getUniformLocation(program, "aspectRatio");
    buffer = gl.createBuffer();
    let data = new Float32Array(4 * 2);
    data[0] = -1.0;
    data[1] = -1.0;
    data[2] = -1.0;
    data[3] = 1.0;
    data[4] = 1.0;
    data[5] = -1.0;
    data[6] = 1.0;
    data[7] = 1.0;
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
}
exports.init = init;
function draw(transition) {
    if (transition instanceof Transitions_1.CircleReveal) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(program);
        gl.enableVertexAttribArray(vertexPosAttrib);
        gl.vertexAttribPointer(vertexPosAttrib, 2, gl.FLOAT, false, 2 * 4, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
        gl.uniform2f(uniformTarget, transition.x, transition.y);
        gl.uniform1f(uniformProgress, transition.getProgress());
        gl.uniform1f(uniformRatio, gl.drawingBufferHeight / gl.drawingBufferWidth);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disable(gl.BLEND);
    }
}
exports.draw = draw;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 aPosition;\r\n\r\nvarying vec2 vPosition;\r\n\r\nvoid main(void) {\r\n\tgl_Position = vec4(aPosition, 1.0, 1.0);\r\n\tvPosition = aPosition;\r\n}"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\nuniform float aspectRatio;\r\nuniform float progress;\r\nuniform vec2  uPosition;\r\n\r\nvarying vec2 vPosition;\r\n\r\nconst vec4  OUTERCOLOR = vec4(.0, .0, .0, 1.0);\r\nconst vec4  INNERCOLOR = vec4(.0, .0, .0, 0.0);\r\nconst float SOFT_WIDTH = 0.3;\r\n\r\nfloat alpha(float d, float targetRadius) {\r\n\tif(d <= targetRadius) {\r\n\t\tif(d < (targetRadius - SOFT_WIDTH)) {\r\n\t\t\treturn 0.0;\r\n\t\t} else {\r\n\t\t\treturn (SOFT_WIDTH - targetRadius + d) / SOFT_WIDTH;\r\n\t\t}\r\n\t} else {\r\n\t\treturn 1.0;\r\n\t}\r\n}\r\n\r\nvoid main(void) {\r\n\tfloat targetRadius = 2.0 * progress;\r\n\r\n\t// compute distance from target point\r\n\tfloat x = vPosition.x - uPosition.x;\r\n\tfloat y = aspectRatio * (vPosition.y - uPosition.y);\r\n\tfloat d = sqrt(x*x + y*y);\r\n\r\n\tgl_FragColor = mix(INNERCOLOR, OUTERCOLOR, alpha(d, targetRadius));\r\n}"

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var display = null;
var lastDisplayUpdate;
var frames = 0;
function enable() {
    if (display === null) {
        display = document.querySelector("#fps");
    }
    display.classList.add("show");
    reset();
}
exports.enable = enable;
function disable() {
    display.classList.remove("show");
}
exports.disable = disable;
function frame() {
    if (Date.now() - lastDisplayUpdate > 1000) {
        updateDisplay();
        frames = 0;
    }
    frames++;
}
exports.frame = frame;
function reset() {
    lastDisplayUpdate = Date.now();
    frames = 0;
}
function updateDisplay() {
    lastDisplayUpdate = Date.now();
    display.innerHTML = frames.toString();
}


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InputMethods;
(function (InputMethods) {
    InputMethods[InputMethods["MOUSE"] = 0] = "MOUSE";
    InputMethods[InputMethods["KEYBOARD"] = 1] = "KEYBOARD";
    InputMethods[InputMethods["TOUCH"] = 2] = "TOUCH";
})(InputMethods = exports.InputMethods || (exports.InputMethods = {}));
var Keys;
(function (Keys) {
    Keys[Keys["SPACE"] = 32] = "SPACE";
    Keys[Keys["ENTER"] = 13] = "ENTER";
    Keys[Keys["ESC"] = 27] = "ESC";
    Keys[Keys["CTRL"] = 17] = "CTRL";
    Keys[Keys["ALT"] = 18] = "ALT";
    Keys[Keys["SHIFT"] = 16] = "SHIFT";
})(Keys || (Keys = {}));
exports.Input = InputMethods.MOUSE;
var pressed = false;
function isPressed() {
    return pressed;
}
exports.isPressed = isPressed;
document.addEventListener("mousedown", function (e) {
    if (exports.Input === InputMethods.TOUCH) {
        return;
    }
    exports.Input = InputMethods.MOUSE;
    pressed = true;
});
document.addEventListener("mouseup", function (e) {
    if (exports.Input === InputMethods.TOUCH) {
        return;
    }
    pressed = false;
});
document.addEventListener("mouseout", function (e) {
    if (exports.Input === InputMethods.TOUCH) {
        return;
    }
    pressed = false;
});
window.oncontextmenu = function (e) {
    e.stopPropagation();
    return false;
};
document.addEventListener("touchstart", function (e) {
    exports.Input = InputMethods.TOUCH;
    touchHandler(e.touches);
});
document.addEventListener("touchend", function (e) {
    touchHandler(e.touches);
});
document.addEventListener("touchcancel", function (e) {
    touchHandler(e.touches);
});
function touchHandler(tl) {
    pressed = tl.length > 0;
}
var keys_pressed = [];
function keyboardUpdateHandler() {
    if (exports.Input === InputMethods.KEYBOARD) {
        pressed = keys_pressed.indexOf(Keys.SPACE) !== -1;
    }
}
document.addEventListener("keydown", function (e) {
    exports.Input = InputMethods.KEYBOARD;
    if (keys_pressed.indexOf(e.keyCode) === -1) {
        keys_pressed.push(e.keyCode);
    }
    keyboardUpdateHandler();
});
document.addEventListener("keyup", function (e) {
    keys_pressed = keys_pressed.filter(k => { return k !== e.keyCode; });
    keyboardUpdateHandler();
});


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameLog = __webpack_require__(4);
class Server {
    constructor(secure = false, host = "localhost", port = 8080) {
        this.ws = null;
        this.url = (secure ? "wss" : "ws") + "://" + host + ":" + port;
    }
    connect(name) {
        return new Promise((resolve, reject) => {
            let resolved = false;
            if (this.isConnected()) {
                reject(new Error("Already connected."));
            }
            else {
                this.ws = new WebSocket(this.url);
                this.ws.onopen = () => {
                    this.sendInit(name);
                };
                this.ws.onclose = () => {
                    this.ws = null;
                    this.wsMsgHandler = null;
                    console.log("Connection closed.");
                };
                this.ws.onmessage = (e) => {
                    let data;
                    try {
                        data = JSON.parse(e.data.toString());
                    }
                    catch (err) {
                        console.error("Unable to parse server message!");
                        console.log(err);
                        console.log(e);
                        return;
                    }
                    if (data.type === "msg") {
                        GameLog.log("Server Message: " + data.msg);
                    }
                    else if (data.type === "reject") {
                        let text = "Rejected by server! Reason: " + data.reason;
                        reject(text);
                    }
                    else {
                        if (resolved === false && data.type === "lobby") {
                            resolved = true;
                            if (data.msg) {
                                GameLog.log(data.msg);
                            }
                            resolve();
                            return;
                        }
                        if (this.wsMsgHandler) {
                            this.wsMsgHandler(data);
                        }
                        else {
                            console.warn("Unhandled message!");
                            console.log(e.data);
                        }
                    }
                };
            }
        });
    }
    waitForStart() {
        console.log("Waiting for round start...");
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                this.wsMsgHandler = (data) => {
                    if (data.type === "start") {
                        this.wsMsgHandler = null;
                        resolve(data);
                    }
                    else if (data.type === "lobby") {
                        console.log("lobby update");
                    }
                    else {
                        reject(new Error("Unexpected Server Message (type = " + data.type + ")"));
                    }
                };
            }
            else {
                console.log("ready state: " + this.ws.readyState);
                reject(new Error("WFRS: Not connected."));
            }
        });
    }
    disconnect() {
        if (this.ws) {
            if (this.ws.readyState !== this.ws.CLOSING) {
                this.ws.close();
            }
        }
    }
    isConnected() {
        return this.ws && this.ws.readyState === this.ws.OPEN;
    }
    updateState(model) {
        let msg = {
            type: "state",
            time: 0,
            pos: { x: 0, y: 0 },
            vel: { x: 0, y: 0 },
            pow: model.Player.getForce()
        };
    }
    setUpdateListener(listener) {
        if (this.isConnected()) {
            this.wsMsgHandler = (data) => {
                if (data.type === "state" || data.type === "map") {
                    listener(data);
                }
            };
        }
    }
    sendInit(name) {
        if (this.isConnected()) {
            let msg = {
                type: "init",
                name: name
            };
            this.ws.send(JSON.stringify(msg));
        }
    }
}
exports.default = Server;


/***/ })
/******/ ]);