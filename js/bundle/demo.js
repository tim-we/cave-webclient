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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Config = __webpack_require__(10);
const GameLog = __webpack_require__(5);
function makeShader(gl, type, source) {
    console.assert(type === gl.VERTEX_SHADER || type === gl.FRAGMENT_SHADER);
    let shader = gl.createShader(type);
    gl.shaderSource(shader, sourcemod(source));
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
        GameLog.error("Shader compilation error.");
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
function sourcemod(data) {
    if (Config.get("lowShaderQuality")) {
        return "#define LOW\n" + data;
    }
    else {
        return data;
    }
}
class ProgramContainer {
    constructor(gl, program, mode, stride) {
        this.vertexAttribs = [];
        this.uniforms = new Map();
        this.gl = gl;
        this.program = program;
        this.vertexStride = stride;
        this.buffer = gl.createBuffer();
        this.mode = mode;
    }
    addVertexAttrib(name, size, offset) {
        let indx = this.gl.getAttribLocation(this.program, name);
        this.vertexAttribs.push(new VertexAttrib(indx, size, offset));
    }
    addUniforms(names) {
        names.forEach(name => {
            let x = this.gl.getUniformLocation(this.program, name);
            if (x === null) {
                throw new Error("uniform location not found");
            }
            this.uniforms.set(name, x);
        }, this);
    }
    getUniform(name) {
        return this.uniforms.get(name);
    }
    bufferData(data) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    }
    use() {
        this.gl.useProgram(this.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }
    setUpVertexAttrib() {
        let gl = this.gl;
        this.vertexAttribs.forEach(v => v.set(gl, this.vertexStride), this);
    }
    draw(count) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.drawArrays(this.mode, 0, count);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
}
exports.ProgramContainer = ProgramContainer;
class VertexAttrib {
    constructor(indx, size, offset) {
        this.index = indx;
        this.size = size;
        this.offset = 4 * offset;
    }
    set(gl, stride) {
        gl.enableVertexAttribArray(this.index);
        gl.vertexAttribPointer(this.index, this.size, gl.FLOAT, false, 4 * stride, this.offset);
    }
}


/***/ }),
/* 1 */
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
    uniform(gl, location) {
        gl.uniform2fv(location, this.data);
    }
    serverData() {
        return {
            x: this.data[0],
            y: this.data[1]
        };
    }
}
exports.default = Vector;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function layerGetZ(index) {
    return 0.12 + index * 0.05;
}
exports.layerGetZ = layerGetZ;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __webpack_require__(12);
const Transitions_1 = __webpack_require__(8);
const View = __webpack_require__(9);
var game = null;
var connection = null;
var transition = null;
function setConnection(c) { connection = c; }
exports.setConnection = setConnection;
function getConnection() { return connection; }
exports.getConnection = getConnection;
function getGame() {
    return game;
}
exports.getGame = getGame;
function newGame(data) {
    game = new Game_1.default(data);
    transition = new Transitions_1.CircleReveal(-0.25, 0);
    View.notifyGameChanged();
    game.waitForEnd().then(g => {
        game = null;
    });
    return game;
}
exports.newGame = newGame;
function update() {
    if (game) {
        game.update();
    }
}
exports.update = update;
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
setInterval(() => {
    if (game && connection) {
        connection.updateState(game);
    }
}, 40);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __webpack_require__(1);
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
/* 5 */
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
class Animation {
    constructor(duration) {
        this.Start = Date.now();
        this.Duration = duration;
        this.expired = false;
    }
    getProgress() {
        let p = (Date.now() - this.Start) / this.Duration;
        if (p >= 1.0) {
            this.expired = true;
            return 1.0;
        }
        return Math.max(0.0, p);
    }
    hasExpired() { return this.expired; }
}
exports.Animation = Animation;
class AnimationManager {
    constructor() {
        this.Animations = [];
    }
    get() {
        return this.Animations;
    }
    add(a) {
        this.Animations.push(a);
    }
    cleanUp() {
        this.Animations = this.Animations.filter(a => !a.hasExpired());
    }
}
exports.AnimationManager = AnimationManager;
const N = 42;
class DeathExplosion extends Animation {
    constructor(player) {
        super(250);
        this.Player = player;
        this.Data = new Float32Array(N * 2 * 2);
        this.generateData();
    }
    generateData() {
        let o;
        for (let i = 0; i < N; i++) {
            o = i * 2 * 2;
            this.Data[o] = this.Data[o + 2] = 2.0 * Math.PI * Math.random();
            this.Data[o + 1] = -Math.random();
            this.Data[o + 3] = Math.random();
        }
    }
    getN() {
        return N;
    }
}
exports.DeathExplosion = DeathExplosion;


/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Model = __webpack_require__(3);
const Renderer = __webpack_require__(19);
const FPS = __webpack_require__(39);
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VERSION = 1;
const DEFAULT = {
    version: VERSION,
    antialias: true,
    lowShaderQuality: false,
    fx: true
};
let data = {};
function get(key) {
    if (data[key] !== undefined) {
        return data[key];
    }
    else {
        return null;
    }
}
exports.get = get;
function set(key, value) {
    let s = false;
    if (data[key] === undefined) {
        console.warn(`Key ${key} was not set before.`);
        s = true;
    }
    else {
        if (value !== data[key]) {
            s = true;
        }
    }
    data[key] = value;
    if (s) {
        store();
    }
}
exports.set = set;
function init() {
    let d = localStorage.getItem("data");
    if (d) {
        data = JSON.parse(d);
        console.assert(data.version === VERSION, "Corrupted data detected (LS).");
    }
    else {
        data = Object.assign({}, DEFAULT);
        store();
    }
}
function store() {
    localStorage.setItem("data", JSON.stringify(data));
}
init();


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Model = __webpack_require__(3);
const View = __webpack_require__(9);
const UserInput = __webpack_require__(40);
const GameLog = __webpack_require__(5);
const LocalTestServer_1 = __webpack_require__(41);
var connection = new LocalTestServer_1.default();
window.addEventListener("load", () => {
    GameLog.log("Inititalizing view components...");
    View.init(mainloop);
    startGame();
    View.startDrawLoop();
});
function mainloop() {
    let game = Model.getGame();
    if (game) {
        game.Player.setForce(UserInput.isPressed());
    }
    Model.update();
}
function serverUpdateHandler(data) {
    let game = Model.getGame();
    if (game) {
        game.updateData(data);
    }
}
function startGame() {
    GameLog.log("Connecting...");
    connection.connect("Ulysses")
        .then(() => {
        Model.setConnection(connection);
        GameLog.log("Waiting for round to start...");
        return connection.waitForStart();
    })
        .then(roundController)
        .catch((reason) => {
        GameLog.error(reason);
    });
}
function roundController(data) {
    connection.setUpdateListener(serverUpdateHandler);
    GameLog.log("Starting game!");
    Model.newGame(data);
    mainloop();
    Model.getGame().Countdown.addListener(t => {
        GameLog.log(`${t}...`);
    });
    return Model.getGame().Countdown
        .waitForGameStart()
        .then(() => {
        GameLog.log("Go!");
        wait(1000).then(() => {
            Model.getGame().Player.setFirstInputReceived();
        });
        return Model.getGame().waitForEnd();
    })
        .then(() => {
        GameLog.log("Game has ended.");
        return wait(1000);
    })
        .then(() => {
        GameLog.log("Waiting for next round...");
        return connection.waitForStart();
    }).then(roundController);
}
function wait(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(13);
const OnlinePlayer_1 = __webpack_require__(14);
const Camera_1 = __webpack_require__(15);
const Countdown_1 = __webpack_require__(16);
const PromiseListener_1 = __webpack_require__(17);
const Animations_1 = __webpack_require__(7);
const Map_1 = __webpack_require__(18);
class Game {
    constructor(data) {
        this.EndListener = new PromiseListener_1.default();
        this.ended = false;
        this.Speed = 0.42;
        this.Danger = 0;
        this.Animations = new Animations_1.AnimationManager();
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
        if (data.speed !== this.Speed) {
        }
    }
    update() {
        let t = (performance.now() - this.LastUpdate) / 1000;
        this.LastUpdate = performance.now();
        this.Time = Math.min(this.Time + t, this.NextTime);
        this.Countdown.update(this.Time);
        this.Danger = Math.max(0, this.Danger - 1.25 * t);
        if (this.Time >= 0) {
            if (this.Player.Alive) {
                this.Player.move(t);
                let d = this.Map.getDistanceToWall(this.Player.Position);
                if (d > 0.0) {
                    this.Player.update(t);
                    this.Danger = Math.max(this.Danger, 4.0 * Math.max(0, 0.25 - d));
                }
                else {
                    this.Player.die();
                    this.Animations.add(new Animations_1.DeathExplosion(this.Player));
                }
            }
            this.OnlinePlayers.forEach(p => {
                p.move(t);
            });
        }
        this.Camera.update(this, t);
        if (!this.ended && this.aliveCount() === 0) {
            this.ended = true;
            let g = this;
            setTimeout((pl) => {
                pl.resolve([t]);
            }, 1000, this.EndListener);
        }
        this.Animations.cleanUp();
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
    waitForEnd() {
        let pl = this.EndListener;
        return new Promise((resolve, reject) => {
            pl.add(resolve);
        });
    }
    getDanger() {
        return this.Danger;
    }
}
exports.default = Game;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPlayer_1 = __webpack_require__(4);
const Vector_1 = __webpack_require__(1);
const GameLog = __webpack_require__(5);
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
        GameLog.log("WASTED!");
        GameLog.log("The player died.");
        super.die();
    }
}
exports.default = Player;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPlayer_1 = __webpack_require__(4);
const Vector_1 = __webpack_require__(1);
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __webpack_require__(1);
const SPEED = 5;
const Offset = new Vector_1.default(0.0, 1.0);
const ROTATION_SPEED = -0.075;
let tmp1 = new Vector_1.default();
let tmp2 = Object.seal(new Array(0, 0));
let tmp3 = Object.seal(new Array(0, 0));
class Camera {
    constructor(x, y, rotation = 0) {
        this.Velocity = new Vector_1.default();
        this.Position = new Vector_1.default(x, y);
        this.BaseRotation = rotation;
        this.lastYPos = y;
    }
    update(model, t) {
        Vector_1.default.axpy(t, this.Velocity, this.Position);
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
        view.makeZRotation(this.getRotation());
        tmp2[0] = -this.Position.getX();
        tmp2[1] = -this.Position.getY();
        view.xvector(tmp2, tmp3);
        view.setEntry(0, 3, tmp3[0]);
        view.setEntry(1, 3, tmp3[1]);
    }
    getRotation() {
        let y = this.Position.getY() - this.lastYPos;
        return this.BaseRotation + ROTATION_SPEED * Math.max(0.0, y - 2.0);
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
/* 16 */
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class PromiseListener {
    constructor() {
        this.resolves = [];
    }
    add(resolve) {
        this.resolves.push(resolve);
    }
    resolve(args = []) {
        let tmp = this.resolves;
        this.resolves = [];
        tmp.forEach(resolve => {
            resolve.apply(this, args);
        }, this);
    }
    clear() {
        this.resolves.length = 0;
    }
}
exports.default = PromiseListener;


/***/ }),
/* 18 */
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
        let width = 0.5 * (right - left);
        return Math.max(0, Math.min(x - left, right - x) / width);
    }
}
exports.default = Map;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Config = __webpack_require__(10);
const Model = __webpack_require__(3);
const Matrix_1 = __webpack_require__(20);
const MapRenderer = __webpack_require__(21);
const PlayerRenderer = __webpack_require__(24);
const TransitionRenderer = __webpack_require__(30);
const FX = __webpack_require__(33);
const AnimationRenderer = __webpack_require__(36);
const glOptions = {
    alpha: false,
    stencil: true,
    depth: false,
    antialias: true
};
var gl = null;
var game = null;
var projMatrix = new Matrix_1.default();
var viewMatrix = new Matrix_1.default();
var transformMatrix = new Matrix_1.default();
function init(canvas) {
    glOptions.antialias = Config.get("antialias");
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
    gl.enable(gl.BLEND);
    console.assert(contextAttributes.stencil, "WebGL: stencil not available!");
    gl.enable(gl.STENCIL_TEST);
    gl.clearStencil(0);
    projMatrix.setEntry(3, 2, 1.0);
    projMatrix.setEntry(3, 3, 0.0);
    resize(window.innerWidth, window.innerHeight);
    MapRenderer.init(gl);
    PlayerRenderer.init(gl);
    TransitionRenderer.init(gl);
    if (Config.get("fx")) {
        FX.init(gl);
    }
    AnimationRenderer.init(gl);
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
    PlayerRenderer.draw(transformMatrix, game.Player, game.Time);
    game.Animations.get().forEach(a => AnimationRenderer.render(a, transformMatrix));
    let t;
    if (t = Model.getTransition()) {
        TransitionRenderer.draw(t);
    }
    if (Config.get("fx")) {
        let d = game.getDanger();
        if (d > 0.0) {
            FX.danger(d);
        }
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
/* 20 */
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(0);
const Color_1 = __webpack_require__(6);
const Tools_1 = __webpack_require__(2);
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
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(22), __webpack_require__(23));
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
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program);
    gl.enableVertexAttribArray(vertexPosAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);
    for (let i = 0; i < NUM_LAYERS; i++) {
        drawLayer(i, proj);
    }
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
/* 22 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 vPosition;\r\n\r\nuniform float zPos;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\nvoid main(void) {\r\n\tgl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n}"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "#ifdef LOW\r\nprecision lowp float;\r\n#else\r\nprecision mediump float;\r\n#endif\r\n\r\nuniform float blendFactor;\r\n\r\nvoid main(void) {\r\n\tgl_FragColor = vec4(.0, .0, .0, blendFactor);\r\n}"

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(0);
const TailRenderer = __webpack_require__(25);
const Tools_1 = __webpack_require__(2);
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
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(28), __webpack_require__(29));
    vertexAttribSquare = gl.getAttribLocation(program, "squareCorner");
    uniformRadius = gl.getUniformLocation(program, "radius");
    uniformColor = gl.getUniformLocation(program, "pColor");
    uniformPM = gl.getUniformLocation(program, "uPMatrix");
    uniformPos = gl.getUniformLocation(program, "playerPosition");
    uniformZ = gl.getUniformLocation(program, "zPos");
    TailRenderer.init(_gl);
}
exports.init = init;
function draw(transform, player, time) {
    TailRenderer.draw(transform, player);
    if (!player.Alive) {
        return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(vertexAttribSquare);
    gl.vertexAttribPointer(vertexAttribSquare, 2, gl.FLOAT, false, 2 * 4, 0);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilFunc(gl.LESS, 0, 0xFF);
    let radius = RADIUS;
    if (player.Layer === 0) {
        radius += +0.005 * (1.0 + Math.cos(5.0 * time));
    }
    transform.uniform(gl, uniformPM);
    gl.uniform1f(uniformZ, Tools_1.layerGetZ(player.Layer));
    gl.uniform1f(uniformRadius, radius);
    player.Position.uniform(gl, uniformPos);
    player.Color.setUniform4(gl, uniformColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
exports.draw = draw;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(0);
const AbstractPlayer_1 = __webpack_require__(4);
const Tools_1 = __webpack_require__(2);
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
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(26), __webpack_require__(27));
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
/* 26 */
/***/ (function(module, exports) {

module.exports = "#ifdef LOW\r\n#define QUALITY lowp\r\n#else\r\n#define QUALITY mediump\r\n#endif\r\nattribute vec2 vPosition;\r\nattribute float vIntensity;\r\n\r\nuniform float zPos;\r\n\r\n// to be linkable, precision must be explicitly stated\r\nuniform QUALITY vec4 pColor;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\nvarying QUALITY float opacity;\r\n\r\nvoid main(void) {\r\n\tgl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n\r\n\topacity = vIntensity;\r\n}"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "#ifdef LOW\r\n#define QUALITY lowp\r\n#else\r\n#define QUALITY mediump\r\n#endif\r\nprecision QUALITY float;\r\n\r\nuniform QUALITY vec4 pColor; // inside color\r\n\r\nvarying QUALITY float opacity;\r\n\r\nvoid main(void) {\r\n\tgl_FragColor = vec4(pColor.rgb, opacity);\r\n}"

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "#ifdef LOW\r\n#define QUALITY lowp\r\n#else\r\n#define QUALITY mediump\r\n#endif\r\nattribute vec2 squareCorner;\r\n\r\nuniform vec2 playerPosition;\r\nuniform float zPos;\r\nuniform float radius;\r\n\r\n// to be linkable, precision must be explicitly stated\r\nuniform QUALITY vec4 pColor;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\n// interpolate for the fragment-shader\r\nvarying vec2 cPos;\r\n\r\nvoid main(void) {\r\n#ifdef LOW\r\n\tfloat r = 0.5 * radius;\r\n#else\r\n\tfloat r = radius;\r\n#endif\r\n\r\n\tfloat x = playerPosition.x + r * squareCorner.x;\r\n\tfloat y = playerPosition.y + r * squareCorner.y;\r\n\r\n\tgl_Position = uPMatrix * vec4(x, y, zPos, 1.0);\r\n\r\n\tcPos = squareCorner;\r\n}"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "#ifdef LOW\r\n#define QUALITY lowp\r\n#else\r\n#define QUALITY mediump\r\n#endif\r\nprecision QUALITY float;\r\n\r\nuniform QUALITY vec4 pColor; // inside color\r\n\r\nvarying vec2 cPos;\r\n\r\nconst vec4 CENTER  = vec4(1.0, 1.0, 1.0, 1.0);\r\nconst vec4 OUTSIDE = vec4(0.0, 0.0, 0.0, 0.0);\r\n\r\nvoid main(void) {\r\n\t\r\n\tfloat d = dot(cPos,cPos);\r\n\r\n\tif(d < 1.0) { // inside\r\n#ifdef LOW\r\n\tgl_FragColor = pColor;\r\n#else\r\n\t\tfloat r = sqrt(d);\r\n\r\n\t\tif(r <= 0.5) {\r\n\t\t\tgl_FragColor = mix(CENTER, pColor, 2.0 * r);\r\n\t\t} else {\r\n\t\t\t//gl_FragColor = mix(pColor, OUTSIDE, 2.0 * r - 1.0);\r\n\t\t\tgl_FragColor = vec4(pColor.rgb, 2.0 - 2.0 * r);\r\n\t\t}\r\n#endif\r\n\t} else { // outside\r\n\t\tgl_FragColor = OUTSIDE;\r\n\t}\r\n}"

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(0);
const Transitions_1 = __webpack_require__(8);
var gl = null;
var buffer = null;
var program = null;
var vertexPosAttrib = -1;
var uniformTarget = null;
var uniformProgress = null;
var uniformRatio = null;
function init(_gl) {
    gl = _gl;
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(31), __webpack_require__(32));
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
    }
}
exports.draw = draw;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 aPosition;\r\n\r\nvarying vec2 vPosition;\r\n\r\nvoid main(void) {\r\n\tgl_Position = vec4(aPosition, 1.0, 1.0);\r\n\tvPosition = aPosition;\r\n}"

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "#ifdef LOW\r\nprecision lowp float;\r\n#else\r\nprecision mediump float;\r\n#endif\r\n\r\nuniform float aspectRatio;\r\nuniform float progress;\r\nuniform vec2  uPosition;\r\n\r\nvarying vec2 vPosition;\r\n\r\nconst vec4  OUTERCOLOR = vec4(.0, .0, .0, 1.0);\r\nconst vec4  INNERCOLOR = vec4(.0, .0, .0, 0.0);\r\nconst float SOFT_WIDTH = 0.3;\r\n\r\n#ifndef LOW\r\nfloat alpha(float d, float targetRadius) {\r\n\tif(d <= targetRadius) {\r\n\t\tif(d < (targetRadius - SOFT_WIDTH)) {\r\n\t\t\treturn 0.0;\r\n\t\t} else {\r\n\t\t\treturn (SOFT_WIDTH - targetRadius + d) / SOFT_WIDTH;\r\n\t\t}\r\n\t} else {\r\n\t\treturn 1.0;\r\n\t}\r\n}\r\n#endif\r\n\r\nvoid main(void) {\r\n\tfloat targetRadius = 2.0 * progress;\r\n\r\n\t// compute distance from target point\r\n\tfloat x = vPosition.x - uPosition.x;\r\n\tfloat y = aspectRatio * (vPosition.y - uPosition.y);\r\n\tfloat d = sqrt(x*x + y*y);\r\n\r\n#ifdef LOW\r\n\tgl_FragColor = (d < targetRadius) ? INNERCOLOR : OUTERCOLOR;\r\n#else\r\n\tgl_FragColor = mix(INNERCOLOR, OUTERCOLOR, alpha(d, targetRadius));\r\n#endif\r\n}"

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(0);
var gl = null;
var buffer = null;
var program = null;
var vertexPosAttrib = -1;
var uniformDanger = null;
var uniformRatio = null;
function init(_gl) {
    gl = _gl;
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(34), __webpack_require__(35));
    vertexPosAttrib = gl.getAttribLocation(program, "aPosition");
    uniformDanger = gl.getUniformLocation(program, "danger");
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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
}
exports.init = init;
function danger(d) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(vertexPosAttrib);
    gl.vertexAttribPointer(vertexPosAttrib, 2, gl.FLOAT, false, 2 * 4, 0);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
    gl.uniform1f(uniformDanger, Math.max(0.0, d));
    gl.uniform1f(uniformRatio, gl.drawingBufferHeight / gl.drawingBufferWidth);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
exports.danger = danger;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 aPosition;\r\n\r\nvarying vec2 vPosition;\r\n\r\nvoid main(void) {\r\n\tgl_Position = vec4(aPosition, 1.0, 1.0);\r\n\tvPosition = aPosition;\r\n}"

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\nuniform float danger;\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 vPosition;\r\n\r\nconst float WIDTH = 0.125;\r\n\r\nvoid main(void) {\r\n\r\n\tfloat alpha = 0.0;\r\n\r\n\tfloat x = min(\r\n\t\t1.0 - abs(vPosition.x),\r\n\t\taspectRatio * (1.0 - abs(vPosition.y))\r\n\t);\r\n\r\n\tif(x < WIDTH) {\r\n\t\talpha = (WIDTH - x) / WIDTH;\r\n\t}\r\n\r\n\tgl_FragColor = vec4(.4, .0, .0, danger * alpha);\r\n}"

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(0);
const Tools_1 = __webpack_require__(2);
const Animations_1 = __webpack_require__(7);
var gl = null;
var deathAnimationProgram = null;
function init(_gl) {
    gl = _gl;
    deathAnimationProgram = new ShaderTools_1.ProgramContainer(gl, ShaderTools_1.createProgramFromSource(gl, __webpack_require__(37), __webpack_require__(38)), gl.LINES, 2);
    deathAnimationProgram.addVertexAttrib("alpha", 1, 0);
    deathAnimationProgram.addVertexAttrib("d", 1, 1);
    deathAnimationProgram.addUniforms(["progress", "uCenter", "uZ", "uPMatrix"]);
}
exports.init = init;
function render(a, matrix) {
    if (a instanceof Animations_1.DeathExplosion) {
        renderDeathAnim(a, matrix);
    }
    else {
        console.warn("Animation: View Missing");
    }
}
exports.render = render;
function renderDeathAnim(a, matrix) {
    let p = deathAnimationProgram;
    p.use();
    p.bufferData(a.Data);
    p.setUpVertexAttrib();
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilFunc(gl.LESS, 0, 0xFF);
    gl.uniform1f(p.getUniform("progress"), a.getProgress());
    a.Player.Position.uniform(gl, p.getUniform("uCenter"));
    gl.uniform1f(p.getUniform("uZ"), Tools_1.layerGetZ(a.Player.Layer));
    matrix.uniform(gl, p.getUniform("uPMatrix"));
    p.draw(2 * a.getN());
}


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "attribute float alpha;\r\nattribute float d;\r\n\r\nuniform float progress;\r\nuniform vec2 uCenter;\r\nuniform float uZ;\r\nuniform mat4 uPMatrix;\r\n\r\nvarying vec4 color;\r\n\r\nconst float LENGTH = 0.1;\r\nconst float RADIUS = 0.35;\r\nconst float VARIANCE = 0.05;\r\n\r\nconst vec3 START = vec3(1.0,1.0,1.0);\r\nconst vec3 END = vec3(.0,.0,.0);\r\n\r\nvoid main(void) {\r\n\t// compute position\r\n\tfloat r = (progress * RADIUS) + (VARIANCE * abs(d));\r\n\r\n\tif(d < 0.0) { // inner point\r\n\t\tr = max(0.0, r - LENGTH);\r\n\t}\r\n\r\n\tvec2 pos = uCenter + r * vec2(cos(alpha), sin(alpha));\r\n\r\n\tgl_Position = uPMatrix * vec4(pos, uZ, 1.0);\r\n\r\n\t// compute the color\r\n\tfloat beta = (progress < 0.8) ? 1.0 : 5.0 * (1.0 - progress);\r\n\tvec3 clr = (progress < 0.5) ? START : mix(START, END, 2.0 * (progress - 0.5));\r\n\r\n\tcolor = vec4(clr, beta);\r\n\t//color = vec4(START, 1.0);\r\n}"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "#ifdef LOW\r\n#define QUALITY lowp\r\n#else\r\n#define QUALITY mediump\r\n#endif\r\nprecision QUALITY float;\r\n\r\nvarying vec4 color;\r\n\r\nvoid main(void) {\r\n\tgl_FragColor = color;\r\n}"

/***/ }),
/* 39 */
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
/* 40 */
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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const UPDATE_RATE = 100;
class LocalTestServer {
    constructor() {
        this.connected = false;
        this.gameStarted = false;
        this.callback = null;
        this.playerAlive = true;
        this.RoundStart = Date.now() + 3;
    }
    connect() {
        return new Promise((resolve, reject) => {
            if (this.connected) {
                reject();
            }
            else {
                this.connected = true;
                this.gameStarted = false;
                this.updateInterval = setInterval(() => {
                    let time = Date.now() - this.RoundStart;
                    if (this.callback) {
                        this.callback({
                            type: "state",
                            time: time,
                            pdata: [{
                                    pos: { x: 0, y: 0 },
                                    alv: true
                                }],
                            speed: 0.42
                        });
                    }
                }, UPDATE_RATE);
                resolve({
                    type: "lobby",
                    players: [],
                    msg: "A player has connected."
                });
            }
        });
    }
    waitForStart() {
        return wait(this.playerAlive ? 1000 : 3000).then(() => {
            this.playerAlive = true;
            return new Promise((resolve, reject) => {
                if (!this.connected || this.gameStarted) {
                    reject();
                }
                else {
                    this.gameStarted = true;
                    resolve({
                        type: "start",
                        index: 0,
                        time: -3,
                        playerInitData: [
                            { name: "Bob", color: 0 }
                        ],
                        mapInit: [-.9, -1, .9, -1, -.9, .75, .9, .75],
                        rotation: 1.5 * Math.PI
                    });
                    setTimeout(_this => { _this.sendMapUpdate(0); }, 0, this);
                    setTimeout(_this => { _this.sendMapUpdate(1); }, 100, this);
                }
            });
        });
    }
    sendMapUpdate(i) {
        if (!this.callback) {
            return;
        }
        if (i === 0) {
            this.callback(__webpack_require__(42));
        }
        else {
            this.callback(__webpack_require__(43));
        }
    }
    disconnect() {
        if (this.connected) {
            return;
        }
        this.connected = false;
        clearInterval(this.updateInterval);
        this.callback = null;
    }
    isConnected() {
        return this.connected;
    }
    updateState(game) {
        if (this.playerAlive && !game.Player.Alive) {
            this.playerAlive = false;
            this.gameStarted = false;
        }
    }
    setUpdateListener(listener) {
        if (this.isConnected()) {
            this.callback = listener;
        }
    }
}
exports.default = LocalTestServer;
function wait(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = {"type":"map","data":[-1.2567491951446539,1.3445819919077564,0.5432508048553462,1.3445819919077564,-1.122651007261123,1.568078971713641,0.6773489927388769,1.568078971713641,-1.3834448257719114,2.0027353358982882,0.41655517422808863,2.0027353358982882,-1.0773135919210213,2.512954058983105,0.7226864080789788,2.512954058983105,-1.1849631092653963,2.6923699212237304,0.6150368907346038,2.6923699212237304,-0.9430349052798374,3.0955835945329953,0.7331417509388428,3.0955835945329953,-1.1275178381561315,3.403055149326819,0.5363599558707957,3.403055149326819,-0.8397876365245871,3.8826054853793934,0.8049081440602373,3.8826054853793934,-0.9513184380665051,4.068490154615923,0.6859419557488579,4.068490154615923,-0.6034624622262623,4.648250114349661,1.010607533199751,4.648250114349661,-0.8875675331935604,5.121758565961825,0.7075621241679666,5.121758565961825,-0.6359120542038282,5.541184364278045,0.94244057122505,5.541184364278045,-0.9888896766505006,6.129480401689166,0.5659311072819329,6.129480401689166,-0.8109563813807901,6.42603589380535,0.7320021828669958,6.42603589380535,-0.9011379072633698,6.576338436942983,0.6358085552589108,6.576338436942983,-0.8564039649610105,6.650895007446915,0.6775602347411129,6.650895007446915,-1.0301645665173644,6.940496010040839,0.49221559308100216,6.940496010040839,-0.6054490499477574,7.648355204323517,0.8886167418793021,7.648355204323517,-1.0698686223175566,8.422387824939848,0.3932358646848495,8.422387824939848,-0.7273110423402294,8.993317124902061,0.7129562726636882,8.993317124902061]}

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = {"type":"map","data":[-1.0080734019414304,9.461254390904063,0.413476422422407,9.461254390904063,-0.7277169803963022,9.928515093479277,0.6751424158645267,9.928515093479277,-0.8677685192623494,10.161934324922688,0.525754107740743,10.161934324922688,-0.5721506818024685,10.654630720689157,0.8016640893699652,10.654630720689157,-0.8363961020155437,11.095039754377616,0.5198023078093517,11.095039754377616,-0.7481915414167064,11.242047355375679,0.6021265643682665,11.242047355375679,-0.8114755431344904,11.347520691571985,0.5346236292026301,11.347520691571985,-0.7237808480894027,11.493678516647131,0.6164720112447121,11.493678516647131,-0.8159696818175824,11.647326572860765,0.5181372552679869,11.647326572860765,-0.6192016067811303,11.975273364588185,0.7017874586353423,11.975273364588185,-0.9252354722940108,12.485329807109652,0.37535133542160315,12.485329807109652,-0.5712537187196196,13.075299396400304,0.7057343054243683,13.075299396400304,-0.6493902471513565,13.205526943786532,0.6223886750971822,13.205526943786532,-0.5639806806640104,13.347876221265443,0.7021042704853717,13.347876221265443,-0.9721138166270396,14.028098114537158,0.26676225879147397,14.028098114537158,-0.7771761346906204,14.352994251097858,0.4487040952654654,14.352994251097858,-0.8937413944529286,14.547269684035038,0.32436781818566984,14.547269684035038,-0.46831821500683585,15.256308316445192,0.7214294523353564,15.256308316445192,-0.928886736057452,16.02392251819622,0.23015636321469923,16.02392251819622,-0.9016956321911779,16.06924102464001,0.25553472682322165,16.06924102464001]}

/***/ })
/******/ ]);