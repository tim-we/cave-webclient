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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __webpack_require__(1);
const View = __webpack_require__(5);
const LocalTestServer_1 = __webpack_require__(13);
var connection = null;
var model = null;
window.addEventListener("load", () => {
    test();
    View.init(model);
    mainloop();
});
function mainloop() {
    if (model) {
        View.draw();
        model.update();
    }
}
function test() {
    connection = new LocalTestServer_1.default();
    model = new Model_1.default({
        type: 0,
        n: 1,
        i: 0,
        t: -3,
        names: ["Bob"]
    });
    model.onUserInputChange = (pressed) => {
        connection.sendInput(pressed);
    };
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(2);
const Map_1 = __webpack_require__(4);
class Model {
    constructor(data) {
        this.userInput = false;
        this.onUserInputChange = () => { };
        let n = data.n;
        console.assert(n > 0);
        console.assert(data.names.length === n);
        console.assert(data.t < 0);
        this.Time = data.t;
        this.TimeDelta = 0.0;
        this.Players = new Array(n);
        let z = 1.0;
        for (let i = 0; i < n; i++) {
            if (i === data.i) {
                this.Players[i] = new Player_1.default(data.names[i], 0);
            }
            else {
                this.Players[i] = new Player_1.default(data.names[i], z);
                z += 1.0;
            }
        }
        this.Player = this.Players[data.i];
        Object.freeze(this.Players);
        this.Map = new Map_1.default();
    }
    setUserInput(pressed) {
        if (this.userInput !== pressed) {
            this.userInput = pressed;
            this.onUserInputChange(pressed);
        }
    }
    updateData(data) {
        console.assert(data.t >= this.NextTime);
        console.assert(data.ps.length === this.Players.length);
        console.assert(data.as.length === this.Players.length);
        this.TimeDelta = Math.max(32, data.t - this.Time);
        this.NextTime = data.t;
        this.Players.forEach((p, i) => {
            let pos = data.ps[i];
            p.updateData(pos.x, pos.y, data.as[i]);
        });
    }
    update() {
        if (this.TimeDelta <= 0.0) {
            return;
        }
        let d = performance.now() - this.LastUpdate;
        this.LastUpdate = performance.now();
        if (this.Time > this.NextTime) {
            this.Time = this.NextTime;
        }
        else {
            this.Time += d;
        }
        let t = d / this.TimeDelta;
        t = Math.max(Math.min(t, 2.0), 0.0);
        this.Players.forEach(p => {
            p.move(t);
        });
    }
}
exports.default = Model;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __webpack_require__(3);
exports.TAILLENGTH = 42;
class Player {
    constructor(name, zPos) {
        this.Position = new Vector_1.default(0, 0);
        this.Z = zPos;
        this.PDelta = new Vector_1.default(0, 0);
        this.PDeltaLength = 0;
        this.Alive = true;
        this.Tail = new Float32Array(exports.TAILLENGTH * 3);
    }
    updateData(px, py, alive) {
        this.PDelta.diff2d(px, py);
        this.PDeltaLength = this.PDelta.length();
        this.Alive = alive;
    }
    move(a) {
        Vector_1.default.axpy(a, this.PDelta, this.Position);
        typedArrayUnshift(this.Tail, 3);
        this.Tail[0] = this.Position.getX();
        this.Tail[1] = this.Position.getY();
        this.Tail[2] = this.Z;
    }
}
exports.default = Player;
function typedArrayUnshift(arr, k) {
    let n = arr.length;
    let p;
    let i;
    let j;
    for (i = n - k; i > 0; i -= k) {
        p = i - k;
        for (j = 0; j < k; j++) {
            arr[i + j] = arr[p + j];
        }
    }
}


/***/ }),
/* 3 */
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
        y.data[0] = a * x.data[0] + y.data[0];
        y.data[1] = a * x.data[1] + y.data[1];
    }
    static distance2(a, b) {
        let dx = a.data[0] - b.data[0];
        let dy = a.data[1] - b.data[1];
        return dx * dx + dy * dy;
    }
}
exports.default = Vector;


/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Renderer = __webpack_require__(6);
var canvas;
function init(model) {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Renderer.init(canvas);
    Renderer.setModel(model);
    window.addEventListener("resize", function () {
        let w = window.innerWidth;
        let h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        Renderer.resize(w, h);
        Renderer.draw();
    });
}
exports.init = init;
function draw() {
    Renderer.draw();
}
exports.draw = draw;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__(7);
const MapRenderer = __webpack_require__(8);
var gl = null;
var model = null;
var projMatrix = new Matrix_1.default();
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
    MapRenderer.draw(projMatrix);
}
exports.draw = draw;
function resize(width, height) {
    if (width > height) {
        projMatrix.makeScale(height / width, 1.0, 1.0, false);
    }
    else {
        projMatrix.makeScale(1.0, width / height, 1.0, false);
    }
}
exports.resize = resize;


/***/ }),
/* 7 */
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
    uniform(gl, location) {
        gl.uniformMatrix4fv(location, false, this.data);
    }
}
exports.default = Matrix;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ShaderTools_1 = __webpack_require__(9);
const Color_1 = __webpack_require__(10);
var data = null;
var bufferVersion = -1;
var gl = null;
var buffer = null;
var program = null;
var vertexPosAttrib = -1;
var uniformPM = null;
var uniformZ = null;
var bgColor = new Color_1.default(0.0, 1.0, 0.42);
function init(_gl) {
    gl = _gl;
    buffer = gl.createBuffer();
    program = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(11), __webpack_require__(12));
    vertexPosAttrib = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vertexPosAttrib);
    uniformPM = gl.getUniformLocation(program, "uPMatrix");
    uniformZ = gl.getUniformLocation(program, "zPos");
    gl.useProgram(program);
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
/* 9 */
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
/* 10 */
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
    static interpolate(a, b, x, result) {
        let xb = 1.0 - x;
        result.red = x * a.red + xb * b.red;
        result.green = x * a.green + xb * b.green;
        result.blue = x * a.blue + xb * b.blue;
        result.alpha = x * a.alpha + xb * b.alpha;
    }
}
exports.default = Color;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "//precision mediump float;\r\n\r\nattribute vec2 vPosition;\r\n\r\nuniform float zPos;\r\n\r\n//varying vec4 color;\r\n\r\n//uniform mat4 uMVMatrix;\r\nuniform mat4 uPMatrix;\r\n\r\nvoid main(void) {\r\n\tgl_Position = vec4(vPosition.x, vPosition.y, zPos, 1.0);\r\n\t//gl_Position = uPMatrix * vec4(vPosition, zPos, 1.0);\r\n\t//gl_Position = uPMatrix * uMVMatrix * vec4(vPosition + vec3(0.0,0.0,zPos), 1.0);\r\n}"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\r\n\r\n//varying vec4 color;\r\n\r\nvoid main(void) {\r\n\t//gl_FragColor = color;\r\n\tgl_FragColor = vec4(0.0,0.0,1.0,1.0); // blue\r\n}"

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class LocalTestServer {
    constructor() {
        this.connected = false;
    }
    connect() {
        this.connected = true;
    }
    disconnect() {
        this.connected = false;
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