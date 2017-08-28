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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __webpack_require__(1);
const Color_1 = __webpack_require__(2);
exports.TAILLENGTH = 80;
const TAILNODESIZE = 2 * (2 + 1);
const TAILWIDTH = 0.005;
var tmp1 = new Vector_1.default();
var tmp2 = new Vector_1.default();
class AbstractPlayer {
    constructor(name, zPos) {
        this.Color = new Color_1.default(0.0, 0.5, 1.0);
        this.Position = new Vector_1.default(0, 0);
        this.PreviousPosition = this.Position.clone();
        this.Z = zPos;
        this.Alive = true;
        this.Tail = new Float32Array(exports.TAILLENGTH * TAILNODESIZE);
        let h = 1.0 / (exports.TAILLENGTH - 1);
        for (let i = 0; i < exports.TAILLENGTH; i++) {
            this.Tail[i * TAILNODESIZE + 2] = i * h;
            this.Tail[i * TAILNODESIZE + 5] = i * h;
        }
    }
    updateTail() {
        Vector_1.default.axpy2(-1, this.PreviousPosition, this.Position, tmp1);
        tmp1.ortho(tmp1);
        tmp1.scale(1.0 / tmp1.length());
        shiftTailData(this.Tail);
        let n = this.Tail.length;
        Vector_1.default.axpy2(TAILWIDTH, tmp1, this.Position, tmp2);
        this.Tail[n - 6] = tmp2.getX();
        this.Tail[n - 5] = tmp2.getY();
        Vector_1.default.axpy2(-TAILWIDTH, tmp1, this.Position, tmp2);
        this.Tail[n - 3] = tmp2.getX();
        this.Tail[n - 2] = tmp2.getY();
        this.PreviousPosition.copyFrom(this.Position);
    }
    die() {
        this.Alive = false;
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x = 0.0, y = 0.0) {
        this.data = new Float64Array(2);
        this.data[0] = x;
        this.data[1] = y;
    }
    getX() {
        return this.data[0];
    }
    getY() {
        return this.data[1];
    }
    diff2d(x, y) {
        this.data[0] = x - this.data[0];
        this.data[1] = y - this.data[1];
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
/* 2 */
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
}
exports.default = Color;


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __webpack_require__(5);
const View = __webpack_require__(9);
const LocalTestServer_1 = __webpack_require__(21);
var connection = new LocalTestServer_1.default(serverUpdateHandler);
var model = null;
var tmp = 0;
window.addEventListener("load", () => {
    test();
    View.init(model, mainloop);
    mainloop();
    View.startDrawLoop();
});
function mainloop() {
    if (model) {
        model.update();
    }
}
function serverUpdateHandler(data) {
    if (model) {
        model.updateData(data);
    }
}
function test() {
    connection.connect();
    model = new Model_1.default({
        type: 0,
        n: 1,
        i: 0,
        t: -3,
        names: ["Bob"]
    });
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(6);
const OnlinePlayer_1 = __webpack_require__(7);
const Map_1 = __webpack_require__(8);
class Model {
    constructor(data) {
        this.Rotation = 0.1 * Math.PI;
        this.RotationDelta = 0.0;
        let n = data.n;
        console.assert(n > 0);
        console.assert(data.names.length === n);
        console.assert(data.t < 0);
        this.Time = data.t;
        this.NextTime = data.t;
        this.TimeDelta = 0.0;
        this.LastUpdate = performance.now();
        this.OnlinePlayers = new Array(n - 1);
        let z = 0.2;
        let j = 0;
        this.Player = new Player_1.default(data.names[data.i], data.i);
        for (let i = 0; i < n - 1; i++) {
            if (data.i === i) {
                j++;
            }
            else {
                this.OnlinePlayers[j] = new OnlinePlayer_1.default(data.names[j], z);
                z += 0.1;
                j++;
            }
        }
        Object.freeze(this.OnlinePlayers);
        this.Map = new Map_1.default();
    }
    updateData(data) {
        console.assert(data.t >= this.NextTime);
        console.assert(data.ps.length === this.OnlinePlayers.length + 1);
        console.assert(data.as.length === this.OnlinePlayers.length + 1);
        this.TimeDelta = Math.max(32, data.t - this.Time);
        this.NextTime = data.t;
        this.OnlinePlayers.forEach((p, i) => {
            let pos = data.ps[i];
            p.updateData(pos.x, pos.y, data.as[i]);
        });
        this.RotationDelta = data.r - this.Rotation;
    }
    update() {
        if (this.TimeDelta <= 0.0) {
            return;
        }
        let d = performance.now() - this.LastUpdate;
        this.LastUpdate = performance.now();
        this.Time = Math.min(this.Time + d, this.NextTime);
        let t = d / this.TimeDelta;
        t = Math.max(Math.min(t, 2.0), 0.0);
        this.Player.move(t);
        this.OnlinePlayers.forEach(p => {
            p.move(t);
        });
    }
}
exports.default = Model;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPlayer_1 = __webpack_require__(0);
const Vector_1 = __webpack_require__(1);
class Player extends AbstractPlayer_1.default {
    constructor(name, index) {
        super(name, 0);
        this.tmp = 0;
        this.Index = index;
        this.Velocity = new Vector_1.default(0, 0);
    }
    move(a) {
        this.tmp += a;
        let v = new Vector_1.default(Math.sin(0.1 * this.tmp), Math.sin(0.2 * this.tmp));
        v.scale(0.5);
        this.Position.copyFrom(v);
        super.updateTail();
    }
    die() {
        super.die();
    }
}
exports.default = Player;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPlayer_1 = __webpack_require__(0);
const Vector_1 = __webpack_require__(1);
class OnlinePlayer extends AbstractPlayer_1.default {
    constructor(name, zPos) {
        super(name, zPos);
        this.PDelta = new Vector_1.default(0, 0);
        this.PDeltaLength = 0;
    }
    updateData(px, py, alive) {
        this.PDelta.diff2d(px, py);
        this.PDeltaLength = this.PDelta.length();
        if (this.Alive && !alive) {
            super.die();
        }
    }
    move(a) {
        Vector_1.default.axpy(a, this.PDelta, this.Position);
        this.updateTail();
    }
}
exports.default = OnlinePlayer;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const N = 1;
const SEGMENT_SIZE = 2 * 3 * 2;
const SEGMENT_DATA_SIZE = 4 * 2;
function setUpExampleData(map) {
    console.assert(N === 1, "invalid number of segments");
    let i = 0;
    let data = new Float32Array(4 * 2);
    data[i++] = -0.8;
    data[i++] = -0.5;
    data[i++] = 0.2;
    data[i++] = -0.5;
    data[i++] = 0.5;
    data[i++] = 0.5;
    data[i++] = -0.5;
    data[i++] = 0.5;
    for (i = 0; i < 4; i++) {
        map.updatePoint(0, i, data);
    }
}
class Map {
    constructor() {
        this.data = new Float32Array(SEGMENT_SIZE * N);
        this.version = 0;
        setUpExampleData(this);
    }
    numTriangles() {
        return 2 * N;
    }
    updateSegment(segmentIndex, data) {
        console.assert(data.length === SEGMENT_DATA_SIZE, "Invalid segment data.");
        console.assert(0 <= segmentIndex && segmentIndex < N, "Index out of bounds. (updateSegment)");
        let offset = segmentIndex * SEGMENT_SIZE;
        let i;
        for (i = 0; i < 3; i++) {
            this.updatePoint(offset, i, data);
        }
        for (i = 2; i <= 4; i++) {
            this.updatePoint(offset, i % 4, data);
        }
        this.version++;
    }
    updatePoint(segment, pointIndex, data) {
        let offset;
        if (pointIndex % 2 === 0) {
            offset = 2 * pointIndex;
            this.data[offset] = data[2 * pointIndex];
            this.data[offset + 1] = data[2 * pointIndex + 1];
            offset = pointIndex + 6;
            this.data[offset] = data[2 * pointIndex];
            this.data[offset + 1] = data[2 * pointIndex + 1];
        }
        else {
            offset = 4 * pointIndex - 2;
            this.data[offset] = data[2 * pointIndex];
            this.data[offset + 1] = data[2 * pointIndex + 1];
        }
    }
}
exports.default = Map;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Renderer = __webpack_require__(10);
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
    afterDraw();
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__(11);
const MapRenderer = __webpack_require__(12);
const PlayerRenderer = __webpack_require__(15);
var gl = null;
var model = null;
var projMatrix = new Matrix_1.default();
var rotationMatrix = new Matrix_1.default();
var transformMatrix = new Matrix_1.default();
function init(canvas) {
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch (e) {
        console.warn("Error initializing webgl.");
        return;
    }
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }
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
    gl.clear(gl.COLOR_BUFFER_BIT);
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
    gl.viewport(0, 0, width, height);
}
exports.resize = resize;
function updateTransformation() {
    rotationMatrix.makeZRotation(model.Rotation);
    Matrix_1.default.multiply(projMatrix, rotationMatrix, transformMatrix);
}


/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(3);
const Color_1 = __webpack_require__(2);
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
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(13), __webpack_require__(14));
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
    gl.bufferData(gl.ARRAY_BUFFER, data.data, gl.STREAM_DRAW);
    bufferVersion = data.version;
}
function draw(proj) {
    bgColor.setClearColor(gl);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!data) {
        return;
    }
    gl.useProgram(program);
    gl.enableVertexAttribArray(vertexPosAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
    proj.uniform(gl, uniformPM);
    gl.uniform1f(uniformZ, 0.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * data.numTriangles());
    if (bufferVersion < data.version) {
        setTimeout(updateBuffer, 0);
    }
}
exports.draw = draw;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 vPosition;\r\n\r\nuniform float zPos;\r\n\r\n//varying vec4 color;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\nvoid main(void) {\r\n\tgl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n}"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\n//varying vec4 color;\r\n\r\nvoid main(void) {\r\n\t//gl_FragColor = color;\r\n\tgl_FragColor = vec4(0.0, 0.05, 0.01, 1.0); // blue\r\n}"

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(3);
const Color_1 = __webpack_require__(2);
const TailRenderer = __webpack_require__(16);
const RADIUS = 0.05;
var gl = null;
var buffer = null;
var program = null;
var vertexAttribPos = -1;
var vertexAttribCSQ = -1;
var color = new Color_1.default(0.0, 0.5, 1.0);
var uniformColor = null;
var uniformPM = null;
var uniformZ = null;
var data = new Float32Array(4 * 4);
function init(_gl) {
    gl = _gl;
    buffer = gl.createBuffer();
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(19), __webpack_require__(20));
    vertexAttribPos = gl.getAttribLocation(program, "vPosition");
    vertexAttribCSQ = gl.getAttribLocation(program, "csqPosition");
    uniformColor = gl.getUniformLocation(program, "pColor");
    uniformPM = gl.getUniformLocation(program, "uPMatrix");
    uniformZ = gl.getUniformLocation(program, "zPos");
    data[2] = -1.0;
    data[3] = -1.0;
    data[6] = -1.0;
    data[7] = 1.0;
    data[10] = 1.0;
    data[11] = -1.0;
    data[14] = 1.0;
    data[15] = 1.0;
    TailRenderer.init(_gl);
}
exports.init = init;
function setUpBuffer(player) {
    let x = player.Position.getX();
    let y = player.Position.getY();
    data[0] = x - RADIUS;
    data[1] = y - RADIUS;
    data[4] = x - RADIUS;
    data[5] = y + RADIUS;
    data[8] = x + RADIUS;
    data[9] = y - RADIUS;
    data[12] = x + RADIUS;
    data[13] = y + RADIUS;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);
}
function draw(transform, player) {
    gl.enable(gl.BLEND);
    TailRenderer.draw(transform, player);
    gl.useProgram(program);
    setUpBuffer(player);
    gl.enableVertexAttribArray(vertexAttribPos);
    gl.enableVertexAttribArray(vertexAttribCSQ);
    gl.vertexAttribPointer(vertexAttribPos, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.vertexAttribPointer(vertexAttribCSQ, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    transform.uniform(gl, uniformPM);
    gl.uniform1f(uniformZ, player.Z);
    color.setUniform(gl, uniformColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disable(gl.BLEND);
}
exports.draw = draw;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(3);
const AbstractPlayer_1 = __webpack_require__(0);
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
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(17), __webpack_require__(18));
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
    transform.uniform(gl, uniformPM);
    gl.uniform1f(uniformZ, player.Z);
    player.Color.setUniform(gl, uniformColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, AbstractPlayer_1.default.getTailVertexCount());
}
exports.draw = draw;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 vPosition;\r\nattribute float vIntensity;\r\n\r\nuniform float zPos;\r\n\r\n// to be linkable, precision must be explicitly stated\r\nuniform mediump vec4 pColor;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\nvarying mediump float opacity;\r\n\r\nvoid main(void) {\r\n\tgl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n\r\n\topacity = vIntensity;\r\n}"

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\nuniform mediump vec4 pColor; // inside color\r\n\r\nvarying mediump float opacity;\r\n\r\nvoid main(void) {\r\n\tgl_FragColor = vec4(pColor.rgb, opacity);\r\n}"

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 vPosition;\r\nattribute vec2 csqPosition; // circle square position (one of the corners)\r\n\r\nuniform float zPos;\r\n\r\n// to be linkable, precision must be explicitly stated\r\nuniform mediump vec4 pColor;\r\n\r\nuniform mat4 uPMatrix;\r\n\r\nvarying vec2 cPos;\r\n\r\nvoid main(void) {\r\n\tgl_Position = uPMatrix * vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n\r\n\tcPos = csqPosition;\r\n}"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\nuniform mediump vec4 pColor; // inside color\r\n\r\nvarying vec2 cPos;\r\n\r\nconst vec4 CENTER  = vec4(1.0, 1.0, 1.0, 1.0);\r\nconst vec4 OUTSIDE = vec4(0.0, 0.0, 0.0, 0.0);\r\n\r\nvoid main(void) {\r\n\t\r\n\tfloat d = dot(cPos,cPos);\r\n\r\n\tif(d < 1.0) { // inside\r\n\t\tfloat r = sqrt(d);\r\n\r\n\t\tif(r <= 0.5) {\r\n\t\t\tgl_FragColor = mix(CENTER, pColor, 2.0 * r);\r\n\t\t} else {\r\n\t\t\t//gl_FragColor = mix(pColor, OUTSIDE, 2.0 * r - 1.0);\r\n\t\t\tgl_FragColor = vec4(pColor.rgb, 2.0 - 2.0 * r);\r\n\t\t}\r\n\t} else { // outside\r\n\t\tgl_FragColor = OUTSIDE;\r\n\t}\r\n}"

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const UPDATE_RATE = 100;
class LocalTestServer {
    constructor(updateHandler) {
        this.connected = false;
        this.Rotation = 0.0;
        this.updateHandler = updateHandler;
        this.RoundStart = Date.now() + 3;
    }
    connect() {
        this.connected = true;
        let _this = this;
        this.updateInterval = setInterval(() => {
            let time = Date.now() - _this.RoundStart;
            _this.Rotation += 0.01;
            _this.updateHandler({
                type: 1,
                t: time,
                ps: [{
                        x: 0,
                        y: 0
                    }],
                as: [true],
                r: _this.Rotation
            });
        }, UPDATE_RATE);
    }
    disconnect() {
        this.connected = false;
        clearInterval(this.updateInterval);
    }
    isConnected() {
        return this.connected;
    }
    sendInput(pressed) {
    }
}
exports.default = LocalTestServer;


/***/ })
/******/ ]);