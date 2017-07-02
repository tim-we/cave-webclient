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
var ws = null;
var model = null;
function connect() {
    ws = new WebSocket("ws://destroids.io:8000");
}
window.addEventListener("load", () => {
    let canvas = document.getElementById("game");
    View.setCanvas(canvas);
    test();
});
function mainloop() {
    if (model) {
        View.draw(model);
        model.update();
    }
    window.requestAnimationFrame(mainloop);
}
function test() {
    model = new Model_1.default({
        type: 0,
        n: 1,
        i: 0,
        t: -3,
        names: ["Bob"]
    });
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
        this.userInput = pressed;
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
class Map {
}
exports.default = Map;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var webgl = null;
function setCanvas(canvas) {
    try {
        webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch (e) {
        console.warn("Error initializing webgl.");
    }
    if (!webgl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
}
exports.setCanvas = setCanvas;
function draw(model) {
    let gl = webgl;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.Map.VertexBuffer);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
exports.draw = draw;


/***/ })
/******/ ]);
//# sourceMappingURL=game.js.map