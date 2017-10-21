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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
const Vector_1 = __webpack_require__(0);
const Color_1 = __webpack_require__(3);
exports.TAILLENGTH = 80;
const TAILNODESIZE = 2 * (2 + 1);
const TAILWIDTH = 0.005;
const STARTSPEED = new Vector_1.default(0.0, 0.75);
var tmp = new Vector_1.default();
class AbstractPlayer {
    constructor(data, zPos) {
        this.Position = new Vector_1.default(0.0, 0.0);
        this.Velocity = STARTSPEED.clone();
        this.VelOrthoDir = new Vector_1.default(0.0, 0.0);
        this.Z = zPos;
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
/* 2 */
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
/* 3 */
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
    setUniform(gl, location) {
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var logDOMRef = null;
window.addEventListener("load", () => {
    logDOMRef = document.getElementById("log");
});
const DURATION = 4200;
class LogEntry {
    constructor(text, classes) {
        this.time = Date.now();
        let p = document.createElement("p");
        p.innerText = text;
        if (classes) {
            classes.forEach(c => p.classList.add(c));
        }
        this.ref = p;
        logDOMRef.appendChild(p);
    }
    hasExpired() {
        return (Date.now() - this.time) > DURATION;
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
    visibleLogs.push(new LogEntry(text, ["error"]));
}
exports.error = error;
setInterval(() => {
    while (visibleLogs.length > 0 && visibleLogs[0].hasExpired()) {
        visibleLogs.shift().remove();
    }
}, 500);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __webpack_require__(6);
const View = __webpack_require__(11);
const UserInput = __webpack_require__(24);
const GameLog = __webpack_require__(4);
const LocalTestServer_1 = __webpack_require__(25);
var connection = new LocalTestServer_1.default();
var model = null;
window.addEventListener("load", () => {
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
        model = new Model_1.default(data);
        View.init(model, mainloop);
        mainloop();
        View.startDrawLoop();
    }).catch((reason) => {
        GameLog.error("Something went wrong: " + reason);
    });
});
function mainloop() {
    if (model) {
        model.Player.Force = UserInput.isPressed();
        if (model.aliveCount() > 0) {
            model.update();
        }
    }
}
function serverUpdateHandler(data) {
    if (model) {
        model.updateData(data);
    }
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(7);
const OnlinePlayer_1 = __webpack_require__(8);
const Camera_1 = __webpack_require__(9);
const Map_1 = __webpack_require__(10);
class Model {
    constructor(data) {
        this.Camera = new Camera_1.default();
        this.Speed = 0.42;
        this.Rotation = 0 * Math.PI;
        this.RotationDelta = 0.0;
        let n = data.playerInitData.length;
        console.assert(n > 0);
        console.assert(data.time < 0, "unexpected: data.time = " + data.time);
        this.Time = data.time;
        this.NextTime = data.time;
        this.TimeDelta = 0.0;
        this.LastUpdate = performance.now();
        this.OnlinePlayers = new Array(n - 1);
        let z = 0.2;
        let j = 0;
        this.Player = new Player_1.default(data.playerInitData[data.index], 0.05);
        for (let i = 0; i < n - 1; i++) {
            if (data.index === i) {
                j++;
            }
            else {
                this.OnlinePlayers[j] = new OnlinePlayer_1.default(data.playerInitData[j], z);
                z += 0.1;
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
        this.TimeDelta = Math.max(32, data.time - this.Time);
        this.NextTime = data.time;
        this.OnlinePlayers.forEach((p, i) => {
            p.updateData(data.pdata[i], this.TimeDelta);
        });
        if (data.speed !== this.Speed) {
        }
    }
    update() {
        let d = performance.now() - this.LastUpdate;
        this.LastUpdate = performance.now();
        let t = d / 1000;
        this.Time = Math.min(this.Time + t, this.NextTime);
        if (this.Time >= 0) {
            if (this.Player.Alive) {
                this.Player.move(t);
                if (this.Map.isInside(this.Player.Position)) {
                    this.Player.update(t);
                }
                else {
                    this.Player.move(-0.75 * t);
                    this.Player.die();
                }
            }
            this.OnlinePlayers.forEach(p => {
                p.move(t);
            });
            this.Rotation += t * this.RotationDelta;
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
exports.default = Model;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPlayer_1 = __webpack_require__(1);
const Vector_1 = __webpack_require__(0);
const GameLog = __webpack_require__(4);
const ACCELERATION = new Vector_1.default(0.04, 0.0);
var tmp = 0;
class Player extends AbstractPlayer_1.default {
    constructor(data, index) {
        super(data, 0);
        this.Force = false;
        this.Position.set(0, -0.5);
        this.Index = index;
    }
    update(t) {
        this.updateXVelocity(this.Force ? ACCELERATION.getX() : -ACCELERATION.getX());
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPlayer_1 = __webpack_require__(1);
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __webpack_require__(0);
const SPEED = 4.2;
const Offset = new Vector_1.default(0.0, 0.8);
let tmp = new Vector_1.default();
class Camera {
    constructor() {
        this.Position = new Vector_1.default();
        this.Velocity = new Vector_1.default();
    }
    update(model, t) {
        Vector_1.default.axpy(t, this.Velocity, this.Position);
        if (model.Player.Alive) {
            this.setTarget(model.Player.Position);
        }
        else {
            let target = tmp;
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
        if (target !== tmp) {
            tmp.copyFrom(target);
            target = tmp;
        }
        Vector_1.default.axpy(1, Offset, target);
        Vector_1.default.axpy2(-1, this.Position, target, this.Velocity);
        limitSpeed(this.Velocity);
    }
    setViewMatrix(view, model) {
        view.makeZRotation(model.Rotation);
        view.setEntry(0, 3, -this.Position.getX());
        view.setEntry(1, 3, -this.Position.getY());
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const N = 50;
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
    isInside(p) {
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
                return this.isInsideSegment(i, p);
            }
            else {
                i = (i + 1) % N;
            }
            n++;
        }
    }
    isInsideSegment(index, p) {
        let offset = index * SEGMENT_SIZE;
        let yBottom = this.data[offset + 1];
        let yTop = this.data[offset + 5];
        let yDelta = yTop - yBottom;
        let rel = (p.getY() - yBottom) / yDelta;
        let left = this.data[offset] + rel * (this.data[offset + 4] - this.data[offset]);
        let right = this.data[offset + 2] + rel * (this.data[offset + 6] - this.data[offset + 2]);
        return left <= p.getX() && p.getX() <= right;
    }
}
exports.default = Map;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Renderer = __webpack_require__(12);
const FPS = __webpack_require__(23);
var canvas;
var drawAgain = false;
var afterDraw;
function init(model, afterDrawHook) {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    afterDraw = afterDrawHook;
    Renderer.init(canvas);
    Renderer.setModel(model);
    window.addEventListener("resize", function () {
        let w = window.innerWidth;
        let h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        Renderer.resize(w, h);
        if (!drawAgain) {
            Renderer.draw();
        }
    });
    FPS.enable();
}
exports.init = init;
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__(13);
const MapRenderer = __webpack_require__(14);
const PlayerRenderer = __webpack_require__(17);
const glOptions = {
    alpha: false,
    stencil: true,
    depth: false,
};
var gl = null;
var model = null;
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
}
exports.init = init;
function setModel(m) {
    model = m;
    MapRenderer.setModelMap(model.Map);
}
exports.setModel = setModel;
function draw() {
    if (model === null) {
        return;
    }
    updateTransformation();
    gl.clear(gl.STENCIL_BUFFER_BIT);
    MapRenderer.draw(transformMatrix);
    model.OnlinePlayers.forEach(player => { PlayerRenderer.draw(transformMatrix, player); });
    PlayerRenderer.draw(transformMatrix, model.Player);
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
    model.Camera.setViewMatrix(viewMatrix, model);
    Matrix_1.default.multiply(projMatrix, viewMatrix, transformMatrix);
}


/***/ }),
/* 13 */
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
    uniform(gl, location) {
        gl.uniformMatrix4fv(location, false, this.data);
    }
}
exports.default = Matrix;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(2);
const Color_1 = __webpack_require__(3);
const NUM_LAYERS = 6;
var data = null;
var bufferVersion = -1;
var gl = null;
var buffer = null;
var program = null;
var vertexPosAttrib = -1;
var uniformPM = null;
var uniformZ = null;
var bgColor = new Color_1.default(0.0, 0.6, 0.05);
function init(_gl) {
    gl = _gl;
    buffer = gl.createBuffer();
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(15), __webpack_require__(16));
    vertexPosAttrib = gl.getAttribLocation(program, "vPosition");
    uniformPM = gl.getUniformLocation(program, "uPMatrix");
    uniformZ = gl.getUniformLocation(program, "zPos");
}
exports.init = init;
function setModelMap(map) {
    data = map;
    bufferVersion = -1;
    updateBuffer();
}
exports.setModelMap = setModelMap;
function updateBuffer() {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.data, gl.STATIC_DRAW);
    bufferVersion = data.version;
}
function draw(proj) {
    bgColor.setClearColor(gl);
    gl.clear(gl.COLOR_BUFFER_BIT);
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
    if (bufferVersion < data.version) {
        setTimeout(updateBuffer, 0);
    }
}
exports.draw = draw;
function drawLayer(index, proj) {
    let z = 0.04 + 0.08 + index * 0.06;
    gl.stencilFunc(gl.LEQUAL, index, 0xFF);
    gl.uniform1f(uniformZ, z);
    proj.uniform(gl, uniformPM);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * data.numTriangles());
}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 vPosition;\r\n\r\nuniform float zPos;\r\n\r\n//varying vec4 color;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\nvoid main(void) {\r\n\tgl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n}"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\n//varying vec4 color;\r\n\r\nvoid main(void) {\r\n\t//gl_FragColor = color;\r\n\tgl_FragColor = vec4(0.0, 0.0, 0.0, 0.55); // blue\r\n}"

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(2);
const TailRenderer = __webpack_require__(18);
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
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(21), __webpack_require__(22));
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
    gl.uniform1f(uniformZ, player.Z);
    gl.uniform1f(uniformRadius, RADIUS);
    gl.uniform2f(uniformPos, player.Position.getX(), player.Position.getY());
    player.Color.setUniform(gl, uniformColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disable(gl.BLEND);
}
exports.draw = draw;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(2);
const AbstractPlayer_1 = __webpack_require__(1);
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
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(19), __webpack_require__(20));
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
    gl.uniform1f(uniformZ, player.Z);
    player.Color.setUniform(gl, uniformColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, AbstractPlayer_1.default.getTailVertexCount());
}
exports.draw = draw;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 vPosition;\r\nattribute float vIntensity;\r\n\r\nuniform float zPos;\r\n\r\n// to be linkable, precision must be explicitly stated\r\nuniform mediump vec4 pColor;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\nvarying mediump float opacity;\r\n\r\nvoid main(void) {\r\n\tgl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n\r\n\topacity = vIntensity;\r\n}"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\nuniform mediump vec4 pColor; // inside color\r\n\r\nvarying mediump float opacity;\r\n\r\nvoid main(void) {\r\n\tgl_FragColor = vec4(pColor.rgb, opacity);\r\n}"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 squareCorner;\r\n\r\nuniform vec2 playerPosition;\r\nuniform float zPos;\r\nuniform float radius;\r\n\r\n// to be linkable, precision must be explicitly stated\r\nuniform mediump vec4 pColor;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\n// interpolate for the fragment-shader\r\nvarying vec2 cPos;\r\n\r\nvoid main(void) {\r\n\tfloat x = playerPosition.x + radius * squareCorner.x;\r\n\tfloat y = playerPosition.y + radius * squareCorner.y;\r\n\r\n\tgl_Position = uPMatrix * vec4(x, y, zPos, 1.0);\r\n\r\n\tcPos = squareCorner;\r\n}"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\nuniform mediump vec4 pColor; // inside color\r\n\r\nvarying vec2 cPos;\r\n\r\nconst vec4 CENTER  = vec4(1.0, 1.0, 1.0, 1.0);\r\nconst vec4 OUTSIDE = vec4(0.0, 0.0, 0.0, 0.0);\r\n\r\nvoid main(void) {\r\n\t\r\n\tfloat d = dot(cPos,cPos);\r\n\r\n\tif(d < 1.0) { // inside\r\n\t\tfloat r = sqrt(d);\r\n\r\n\t\tif(r <= 0.5) {\r\n\t\t\tgl_FragColor = mix(CENTER, pColor, 2.0 * r);\r\n\t\t} else {\r\n\t\t\t//gl_FragColor = mix(pColor, OUTSIDE, 2.0 * r - 1.0);\r\n\t\t\tgl_FragColor = vec4(pColor.rgb, 2.0 - 2.0 * r);\r\n\t\t}\r\n\t} else { // outside\r\n\t\tgl_FragColor = OUTSIDE;\r\n\t}\r\n}"

/***/ }),
/* 23 */
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
/* 24 */
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const UPDATE_RATE = 100;
class LocalTestServer {
    constructor() {
        this.connected = false;
        this.gameStarted = false;
        this.Rotation = 0.0;
        this.callback = null;
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
                    this.Rotation += 0.01;
                    if (this.callback) {
                        this.callback({
                            type: "state",
                            time: time,
                            pdata: [{
                                    pos: { x: 0, y: 0 },
                                    alv: true
                                }],
                            rotation: this.Rotation,
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
                    mapInit: [-.9, -1, .9, -1, -.9, .75, .9, .75]
                });
                setTimeout(_this => { _this.sendMapUpdate(0); }, 0, this);
                setTimeout(_this => { _this.sendMapUpdate(1); }, 100, this);
            }
        });
    }
    sendMapUpdate(i) {
        if (!this.callback) {
            return;
        }
        if (i === 0) {
            this.callback(__webpack_require__(26));
        }
        else {
            this.callback(__webpack_require__(27));
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
    updateState(model) {
    }
    setUpdateListener(listener) {
        if (this.isConnected()) {
            this.callback = listener;
        }
    }
}
exports.default = LocalTestServer;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = {"type":"map","data":[-1.2567491951446539,1.3445819919077564,0.5432508048553462,1.3445819919077564,-1.122651007261123,1.568078971713641,0.6773489927388769,1.568078971713641,-1.3834448257719114,2.0027353358982882,0.41655517422808863,2.0027353358982882,-1.0773135919210213,2.512954058983105,0.7226864080789788,2.512954058983105,-1.1849631092653963,2.6923699212237304,0.6150368907346038,2.6923699212237304,-0.9430349052798374,3.0955835945329953,0.7331417509388428,3.0955835945329953,-1.1275178381561315,3.403055149326819,0.5363599558707957,3.403055149326819,-0.8397876365245871,3.8826054853793934,0.8049081440602373,3.8826054853793934,-0.9513184380665051,4.068490154615923,0.6859419557488579,4.068490154615923,-0.6034624622262623,4.648250114349661,1.010607533199751,4.648250114349661,-0.8875675331935604,5.121758565961825,0.7075621241679666,5.121758565961825,-0.6359120542038282,5.541184364278045,0.94244057122505,5.541184364278045,-0.9888896766505006,6.129480401689166,0.5659311072819329,6.129480401689166,-0.8109563813807901,6.42603589380535,0.7320021828669958,6.42603589380535,-0.9011379072633698,6.576338436942983,0.6358085552589108,6.576338436942983,-0.8564039649610105,6.650895007446915,0.6775602347411129,6.650895007446915,-1.0301645665173644,6.940496010040839,0.49221559308100216,6.940496010040839,-0.6054490499477574,7.648355204323517,0.8886167418793021,7.648355204323517,-1.0698686223175566,8.422387824939848,0.3932358646848495,8.422387824939848,-0.7273110423402294,8.993317124902061,0.7129562726636882,8.993317124902061]}

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = {"type":"map","data":[-1.0080734019414304,9.461254390904063,0.413476422422407,9.461254390904063,-0.7277169803963022,9.928515093479277,0.6751424158645267,9.928515093479277,-0.8677685192623494,10.161934324922688,0.525754107740743,10.161934324922688,-0.5721506818024685,10.654630720689157,0.8016640893699652,10.654630720689157,-0.8363961020155437,11.095039754377616,0.5198023078093517,11.095039754377616,-0.7481915414167064,11.242047355375679,0.6021265643682665,11.242047355375679,-0.8114755431344904,11.347520691571985,0.5346236292026301,11.347520691571985,-0.7237808480894027,11.493678516647131,0.6164720112447121,11.493678516647131,-0.8159696818175824,11.647326572860765,0.5181372552679869,11.647326572860765,-0.6192016067811303,11.975273364588185,0.7017874586353423,11.975273364588185,-0.9252354722940108,12.485329807109652,0.37535133542160315,12.485329807109652,-0.5712537187196196,13.075299396400304,0.7057343054243683,13.075299396400304,-0.6493902471513565,13.205526943786532,0.6223886750971822,13.205526943786532,-0.5639806806640104,13.347876221265443,0.7021042704853717,13.347876221265443,-0.9721138166270396,14.028098114537158,0.26676225879147397,14.028098114537158,-0.7771761346906204,14.352994251097858,0.4487040952654654,14.352994251097858,-0.8937413944529286,14.547269684035038,0.32436781818566984,14.547269684035038,-0.46831821500683585,15.256308316445192,0.7214294523353564,15.256308316445192,-0.928886736057452,16.02392251819622,0.23015636321469923,16.02392251819622,-0.9016956321911779,16.06924102464001,0.25553472682322165,16.06924102464001]}

/***/ })
/******/ ]);