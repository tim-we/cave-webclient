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
/*!**************************!*\
  !*** ./ts/Controller.ts ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Model_1 = __webpack_require__(/*! ./Model */ 1);\r\nconst View = __webpack_require__(/*! ./View */ 5);\r\nconst LocalTestServer_1 = __webpack_require__(/*! ./LocalTestServer */ 10);\r\nvar connection = null;\r\nvar model = null;\r\nwindow.addEventListener(\"load\", () => {\r\n    View.init();\r\n    test();\r\n    mainloop();\r\n});\r\nfunction mainloop() {\r\n    if (model) {\r\n        View.draw(model);\r\n        model.update();\r\n    }\r\n    window.requestAnimationFrame(mainloop);\r\n}\r\nfunction test() {\r\n    connection = new LocalTestServer_1.default();\r\n    model = new Model_1.default({\r\n        type: 0,\r\n        n: 1,\r\n        i: 0,\r\n        t: -3,\r\n        names: [\"Bob\"]\r\n    });\r\n    model.onUserInputChange = (pressed) => {\r\n        connection.sendInput(pressed);\r\n    };\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3RzL0NvbnRyb2xsZXIudHM/NGQzNSJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBNb2RlbF8xID0gcmVxdWlyZShcIi4vTW9kZWxcIik7XHJcbmNvbnN0IFZpZXcgPSByZXF1aXJlKFwiLi9WaWV3XCIpO1xyXG5jb25zdCBMb2NhbFRlc3RTZXJ2ZXJfMSA9IHJlcXVpcmUoXCIuL0xvY2FsVGVzdFNlcnZlclwiKTtcclxudmFyIGNvbm5lY3Rpb24gPSBudWxsO1xyXG52YXIgbW9kZWwgPSBudWxsO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgVmlldy5pbml0KCk7XHJcbiAgICB0ZXN0KCk7XHJcbiAgICBtYWlubG9vcCgpO1xyXG59KTtcclxuZnVuY3Rpb24gbWFpbmxvb3AoKSB7XHJcbiAgICBpZiAobW9kZWwpIHtcclxuICAgICAgICBWaWV3LmRyYXcobW9kZWwpO1xyXG4gICAgICAgIG1vZGVsLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShtYWlubG9vcCk7XHJcbn1cclxuZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIGNvbm5lY3Rpb24gPSBuZXcgTG9jYWxUZXN0U2VydmVyXzEuZGVmYXVsdCgpO1xyXG4gICAgbW9kZWwgPSBuZXcgTW9kZWxfMS5kZWZhdWx0KHtcclxuICAgICAgICB0eXBlOiAwLFxyXG4gICAgICAgIG46IDEsXHJcbiAgICAgICAgaTogMCxcclxuICAgICAgICB0OiAtMyxcclxuICAgICAgICBuYW1lczogW1wiQm9iXCJdXHJcbiAgICB9KTtcclxuICAgIG1vZGVsLm9uVXNlcklucHV0Q2hhbmdlID0gKHByZXNzZWQpID0+IHtcclxuICAgICAgICBjb25uZWN0aW9uLnNlbmRJbnB1dChwcmVzc2VkKTtcclxuICAgIH07XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9Db250cm9sbGVyLnRzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/*!*********************!*\
  !*** ./ts/Model.ts ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Player_1 = __webpack_require__(/*! ./Player */ 2);\r\nconst Map_1 = __webpack_require__(/*! ./Map */ 4);\r\nclass Model {\r\n    constructor(data) {\r\n        this.userInput = false;\r\n        this.onUserInputChange = () => { };\r\n        let n = data.n;\r\n        console.assert(n > 0);\r\n        console.assert(data.names.length === n);\r\n        console.assert(data.t < 0);\r\n        this.Time = data.t;\r\n        this.TimeDelta = 0.0;\r\n        this.Players = new Array(n);\r\n        let z = 1.0;\r\n        for (let i = 0; i < n; i++) {\r\n            if (i === data.i) {\r\n                this.Players[i] = new Player_1.default(data.names[i], 0);\r\n            }\r\n            else {\r\n                this.Players[i] = new Player_1.default(data.names[i], z);\r\n                z += 1.0;\r\n            }\r\n        }\r\n        this.Player = this.Players[data.i];\r\n        Object.freeze(this.Players);\r\n        this.Map = new Map_1.default();\r\n    }\r\n    setUserInput(pressed) {\r\n        if (this.userInput !== pressed) {\r\n            this.userInput = pressed;\r\n            this.onUserInputChange(pressed);\r\n        }\r\n    }\r\n    updateData(data) {\r\n        console.assert(data.t >= this.NextTime);\r\n        console.assert(data.ps.length === this.Players.length);\r\n        console.assert(data.as.length === this.Players.length);\r\n        this.TimeDelta = Math.max(32, data.t - this.Time);\r\n        this.NextTime = data.t;\r\n        this.Players.forEach((p, i) => {\r\n            let pos = data.ps[i];\r\n            p.updateData(pos.x, pos.y, data.as[i]);\r\n        });\r\n    }\r\n    update() {\r\n        if (this.TimeDelta <= 0.0) {\r\n            return;\r\n        }\r\n        let d = performance.now() - this.LastUpdate;\r\n        this.LastUpdate = performance.now();\r\n        if (this.Time > this.NextTime) {\r\n            this.Time = this.NextTime;\r\n        }\r\n        else {\r\n            this.Time += d;\r\n        }\r\n        let t = d / this.TimeDelta;\r\n        t = Math.max(Math.min(t, 2.0), 0.0);\r\n        this.Players.forEach(p => {\r\n            p.move(t);\r\n        });\r\n    }\r\n}\r\nexports.default = Model;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3RzL01vZGVsLnRzP2Q5NzYiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgUGxheWVyXzEgPSByZXF1aXJlKFwiLi9QbGF5ZXJcIik7XHJcbmNvbnN0IE1hcF8xID0gcmVxdWlyZShcIi4vTWFwXCIpO1xyXG5jbGFzcyBNb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcbiAgICAgICAgdGhpcy51c2VySW5wdXQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9uVXNlcklucHV0Q2hhbmdlID0gKCkgPT4geyB9O1xyXG4gICAgICAgIGxldCBuID0gZGF0YS5uO1xyXG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KG4gPiAwKTtcclxuICAgICAgICBjb25zb2xlLmFzc2VydChkYXRhLm5hbWVzLmxlbmd0aCA9PT0gbik7XHJcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZGF0YS50IDwgMCk7XHJcbiAgICAgICAgdGhpcy5UaW1lID0gZGF0YS50O1xyXG4gICAgICAgIHRoaXMuVGltZURlbHRhID0gMC4wO1xyXG4gICAgICAgIHRoaXMuUGxheWVycyA9IG5ldyBBcnJheShuKTtcclxuICAgICAgICBsZXQgeiA9IDEuMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gZGF0YS5pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlBsYXllcnNbaV0gPSBuZXcgUGxheWVyXzEuZGVmYXVsdChkYXRhLm5hbWVzW2ldLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuUGxheWVyc1tpXSA9IG5ldyBQbGF5ZXJfMS5kZWZhdWx0KGRhdGEubmFtZXNbaV0sIHopO1xyXG4gICAgICAgICAgICAgICAgeiArPSAxLjA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5QbGF5ZXIgPSB0aGlzLlBsYXllcnNbZGF0YS5pXTtcclxuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuUGxheWVycyk7XHJcbiAgICAgICAgdGhpcy5NYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgc2V0VXNlcklucHV0KHByZXNzZWQpIHtcclxuICAgICAgICBpZiAodGhpcy51c2VySW5wdXQgIT09IHByZXNzZWQpIHtcclxuICAgICAgICAgICAgdGhpcy51c2VySW5wdXQgPSBwcmVzc2VkO1xyXG4gICAgICAgICAgICB0aGlzLm9uVXNlcklucHV0Q2hhbmdlKHByZXNzZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZURhdGEoZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGRhdGEudCA+PSB0aGlzLk5leHRUaW1lKTtcclxuICAgICAgICBjb25zb2xlLmFzc2VydChkYXRhLnBzLmxlbmd0aCA9PT0gdGhpcy5QbGF5ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZGF0YS5hcy5sZW5ndGggPT09IHRoaXMuUGxheWVycy5sZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuVGltZURlbHRhID0gTWF0aC5tYXgoMzIsIGRhdGEudCAtIHRoaXMuVGltZSk7XHJcbiAgICAgICAgdGhpcy5OZXh0VGltZSA9IGRhdGEudDtcclxuICAgICAgICB0aGlzLlBsYXllcnMuZm9yRWFjaCgocCwgaSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcG9zID0gZGF0YS5wc1tpXTtcclxuICAgICAgICAgICAgcC51cGRhdGVEYXRhKHBvcy54LCBwb3MueSwgZGF0YS5hc1tpXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuVGltZURlbHRhIDw9IDAuMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBkID0gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLkxhc3RVcGRhdGU7XHJcbiAgICAgICAgdGhpcy5MYXN0VXBkYXRlID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuVGltZSA+IHRoaXMuTmV4dFRpbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5UaW1lID0gdGhpcy5OZXh0VGltZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuVGltZSArPSBkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdCA9IGQgLyB0aGlzLlRpbWVEZWx0YTtcclxuICAgICAgICB0ID0gTWF0aC5tYXgoTWF0aC5taW4odCwgMi4wKSwgMC4wKTtcclxuICAgICAgICB0aGlzLlBsYXllcnMuZm9yRWFjaChwID0+IHtcclxuICAgICAgICAgICAgcC5tb3ZlKHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IE1vZGVsO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL01vZGVsLnRzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///1\n");

/***/ }),
/* 2 */
/*!**********************!*\
  !*** ./ts/Player.ts ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Vector_1 = __webpack_require__(/*! ./Vector */ 3);\r\nexports.TAILLENGTH = 42;\r\nclass Player {\r\n    constructor(name, zPos) {\r\n        this.Position = new Vector_1.default(0, 0);\r\n        this.Z = zPos;\r\n        this.PDelta = new Vector_1.default(0, 0);\r\n        this.PDeltaLength = 0;\r\n        this.Alive = true;\r\n        this.Tail = new Float32Array(exports.TAILLENGTH * 3);\r\n    }\r\n    updateData(px, py, alive) {\r\n        this.PDelta.diff2d(px, py);\r\n        this.PDeltaLength = this.PDelta.length();\r\n        this.Alive = alive;\r\n    }\r\n    move(a) {\r\n        Vector_1.default.axpy(a, this.PDelta, this.Position);\r\n        typedArrayUnshift(this.Tail, 3);\r\n        this.Tail[0] = this.Position.getX();\r\n        this.Tail[1] = this.Position.getY();\r\n        this.Tail[2] = this.Z;\r\n    }\r\n}\r\nexports.default = Player;\r\nfunction typedArrayUnshift(arr, k) {\r\n    let n = arr.length;\r\n    let p;\r\n    let i;\r\n    let j;\r\n    for (i = n - k; i > 0; i -= k) {\r\n        p = i - k;\r\n        for (j = 0; j < k; j++) {\r\n            arr[i + j] = arr[p + j];\r\n        }\r\n    }\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3RzL1BsYXllci50cz9hYzRkIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IFZlY3Rvcl8xID0gcmVxdWlyZShcIi4vVmVjdG9yXCIpO1xyXG5leHBvcnRzLlRBSUxMRU5HVEggPSA0MjtcclxuY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHpQb3MpIHtcclxuICAgICAgICB0aGlzLlBvc2l0aW9uID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XHJcbiAgICAgICAgdGhpcy5aID0gelBvcztcclxuICAgICAgICB0aGlzLlBEZWx0YSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDApO1xyXG4gICAgICAgIHRoaXMuUERlbHRhTGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLkFsaXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLlRhaWwgPSBuZXcgRmxvYXQzMkFycmF5KGV4cG9ydHMuVEFJTExFTkdUSCAqIDMpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlRGF0YShweCwgcHksIGFsaXZlKSB7XHJcbiAgICAgICAgdGhpcy5QRGVsdGEuZGlmZjJkKHB4LCBweSk7XHJcbiAgICAgICAgdGhpcy5QRGVsdGFMZW5ndGggPSB0aGlzLlBEZWx0YS5sZW5ndGgoKTtcclxuICAgICAgICB0aGlzLkFsaXZlID0gYWxpdmU7XHJcbiAgICB9XHJcbiAgICBtb3ZlKGEpIHtcclxuICAgICAgICBWZWN0b3JfMS5kZWZhdWx0LmF4cHkoYSwgdGhpcy5QRGVsdGEsIHRoaXMuUG9zaXRpb24pO1xyXG4gICAgICAgIHR5cGVkQXJyYXlVbnNoaWZ0KHRoaXMuVGFpbCwgMyk7XHJcbiAgICAgICAgdGhpcy5UYWlsWzBdID0gdGhpcy5Qb3NpdGlvbi5nZXRYKCk7XHJcbiAgICAgICAgdGhpcy5UYWlsWzFdID0gdGhpcy5Qb3NpdGlvbi5nZXRZKCk7XHJcbiAgICAgICAgdGhpcy5UYWlsWzJdID0gdGhpcy5aO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFBsYXllcjtcclxuZnVuY3Rpb24gdHlwZWRBcnJheVVuc2hpZnQoYXJyLCBrKSB7XHJcbiAgICBsZXQgbiA9IGFyci5sZW5ndGg7XHJcbiAgICBsZXQgcDtcclxuICAgIGxldCBpO1xyXG4gICAgbGV0IGo7XHJcbiAgICBmb3IgKGkgPSBuIC0gazsgaSA+IDA7IGkgLT0gaykge1xyXG4gICAgICAgIHAgPSBpIC0gaztcclxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgazsgaisrKSB7XHJcbiAgICAgICAgICAgIGFycltpICsgal0gPSBhcnJbcCArIGpdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL1BsYXllci50c1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///2\n");

/***/ }),
/* 3 */
/*!**********************!*\
  !*** ./ts/Vector.ts ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass Vector {\r\n    constructor(x = 0.0, y = 0.0) {\r\n        this.data = new Float64Array(2);\r\n        this.data[0] = x;\r\n        this.data[1] = y;\r\n    }\r\n    getX() {\r\n        return this.data[0];\r\n    }\r\n    getY() {\r\n        return this.data[1];\r\n    }\r\n    diff2d(x, y) {\r\n        this.data[0] = x - this.data[0];\r\n        this.data[1] = y - this.data[1];\r\n    }\r\n    length() {\r\n        return Math.sqrt(this.data[0] * this.data[0] + this.data[1] * this.data[1]);\r\n    }\r\n    static axpy(a, x, y) {\r\n        y.data[0] = a * x.data[0] + y.data[0];\r\n        y.data[1] = a * x.data[1] + y.data[1];\r\n    }\r\n    static distance2(a, b) {\r\n        let dx = a.data[0] - b.data[0];\r\n        let dy = a.data[1] - b.data[1];\r\n        return dx * dx + dy * dy;\r\n    }\r\n}\r\nexports.default = Vector;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3RzL1ZlY3Rvci50cz9lZTRmIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIFZlY3RvciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4ID0gMC4wLCB5ID0gMC4wKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3IEZsb2F0NjRBcnJheSgyKTtcclxuICAgICAgICB0aGlzLmRhdGFbMF0gPSB4O1xyXG4gICAgICAgIHRoaXMuZGF0YVsxXSA9IHk7XHJcbiAgICB9XHJcbiAgICBnZXRYKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbMF07XHJcbiAgICB9XHJcbiAgICBnZXRZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbMV07XHJcbiAgICB9XHJcbiAgICBkaWZmMmQoeCwgeSkge1xyXG4gICAgICAgIHRoaXMuZGF0YVswXSA9IHggLSB0aGlzLmRhdGFbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhWzFdID0geSAtIHRoaXMuZGF0YVsxXTtcclxuICAgIH1cclxuICAgIGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZGF0YVswXSAqIHRoaXMuZGF0YVswXSArIHRoaXMuZGF0YVsxXSAqIHRoaXMuZGF0YVsxXSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXhweShhLCB4LCB5KSB7XHJcbiAgICAgICAgeS5kYXRhWzBdID0gYSAqIHguZGF0YVswXSArIHkuZGF0YVswXTtcclxuICAgICAgICB5LmRhdGFbMV0gPSBhICogeC5kYXRhWzFdICsgeS5kYXRhWzFdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGRpc3RhbmNlMihhLCBiKSB7XHJcbiAgICAgICAgbGV0IGR4ID0gYS5kYXRhWzBdIC0gYi5kYXRhWzBdO1xyXG4gICAgICAgIGxldCBkeSA9IGEuZGF0YVsxXSAtIGIuZGF0YVsxXTtcclxuICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gVmVjdG9yO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL1ZlY3Rvci50c1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///3\n");

/***/ }),
/* 4 */
/*!*******************!*\
  !*** ./ts/Map.ts ***!
  \*******************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst N = 42;\r\nconst SEGMENT_SIZE = 2 * 3 * 2;\r\nclass Map {\r\n    constructor() {\r\n        this.data = new Float32Array(SEGMENT_SIZE * N);\r\n        this.i = 0;\r\n    }\r\n    update(data) {\r\n        let n = data.length / 8;\r\n        let k, d, i, o, j;\r\n        for (k = 0; k < n; k++) {\r\n            d = this.i * SEGMENT_SIZE;\r\n            o = k * 8;\r\n            for (i = 0; i < 3; i++) {\r\n                this.data[d + 2 * i] = data[o + 2 * i];\r\n                this.data[d + 2 * i + 1] = data[o + 2 * i + 1];\r\n            }\r\n            for (i = 0; i < 3; i++) {\r\n            }\r\n        }\r\n    }\r\n}\r\nexports.default = Map;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3RzL01hcC50cz81Y2FlIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IE4gPSA0MjtcclxuY29uc3QgU0VHTUVOVF9TSVpFID0gMiAqIDMgKiAyO1xyXG5jbGFzcyBNYXAge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3IEZsb2F0MzJBcnJheShTRUdNRU5UX1NJWkUgKiBOKTtcclxuICAgICAgICB0aGlzLmkgPSAwO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuICAgICAgICBsZXQgbiA9IGRhdGEubGVuZ3RoIC8gODtcclxuICAgICAgICBsZXQgaywgZCwgaSwgbywgajtcclxuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbjsgaysrKSB7XHJcbiAgICAgICAgICAgIGQgPSB0aGlzLmkgKiBTRUdNRU5UX1NJWkU7XHJcbiAgICAgICAgICAgIG8gPSBrICogODtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2QgKyAyICogaV0gPSBkYXRhW28gKyAyICogaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbZCArIDIgKiBpICsgMV0gPSBkYXRhW28gKyAyICogaSArIDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBNYXA7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvTWFwLnRzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///4\n");

/***/ }),
/* 5 */
/*!********************!*\
  !*** ./ts/View.ts ***!
  \********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Renderer = __webpack_require__(/*! ./Renderer */ 6);\r\nvar canvas;\r\nfunction init() {\r\n    canvas = document.getElementById(\"game\");\r\n    Renderer.init(canvas);\r\n}\r\nexports.init = init;\r\nfunction draw(model) {\r\n    Renderer.draw();\r\n}\r\nexports.draw = draw;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3RzL1ZpZXcudHM/NGExMCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBSZW5kZXJlciA9IHJlcXVpcmUoXCIuL1JlbmRlcmVyXCIpO1xyXG52YXIgY2FudmFzO1xyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lXCIpO1xyXG4gICAgUmVuZGVyZXIuaW5pdChjYW52YXMpO1xyXG59XHJcbmV4cG9ydHMuaW5pdCA9IGluaXQ7XHJcbmZ1bmN0aW9uIGRyYXcobW9kZWwpIHtcclxuICAgIFJlbmRlcmVyLmRyYXcoKTtcclxufVxyXG5leHBvcnRzLmRyYXcgPSBkcmF3O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL1ZpZXcudHNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///5\n");

/***/ }),
/* 6 */
/*!************************!*\
  !*** ./ts/Renderer.ts ***!
  \************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst ShaderTools_1 = __webpack_require__(/*! ./ShaderTools */ 7);\r\nvar gl = null;\r\nfunction init(canvas) {\r\n    try {\r\n        gl = canvas.getContext(\"webgl\") || canvas.getContext(\"experimental-webgl\");\r\n    }\r\n    catch (e) {\r\n        console.warn(\"Error initializing webgl.\");\r\n    }\r\n    if (!gl) {\r\n        alert(\"Unable to initialize WebGL. Your browser may not support it.\");\r\n        return;\r\n    }\r\n    let p = ShaderTools_1.createProgramFromSource(gl, __webpack_require__(/*! ../shader/map.vert */ 8), __webpack_require__(/*! ../shader/map.frag */ 9));\r\n}\r\nexports.init = init;\r\nfunction draw() {\r\n    gl.clear(gl.COLOR_BUFFER_BIT);\r\n}\r\nexports.draw = draw;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3RzL1JlbmRlcmVyLnRzPzgzZTUiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgU2hhZGVyVG9vbHNfMSA9IHJlcXVpcmUoXCIuL1NoYWRlclRvb2xzXCIpO1xyXG52YXIgZ2wgPSBudWxsO1xyXG5mdW5jdGlvbiBpbml0KGNhbnZhcykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIikgfHwgY2FudmFzLmdldENvbnRleHQoXCJleHBlcmltZW50YWwtd2ViZ2xcIik7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihcIkVycm9yIGluaXRpYWxpemluZyB3ZWJnbC5cIik7XHJcbiAgICB9XHJcbiAgICBpZiAoIWdsKSB7XHJcbiAgICAgICAgYWxlcnQoXCJVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTC4gWW91ciBicm93c2VyIG1heSBub3Qgc3VwcG9ydCBpdC5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IHAgPSBTaGFkZXJUb29sc18xLmNyZWF0ZVByb2dyYW1Gcm9tU291cmNlKGdsLCByZXF1aXJlKFwiLi4vc2hhZGVyL21hcC52ZXJ0XCIpLCByZXF1aXJlKFwiLi4vc2hhZGVyL21hcC5mcmFnXCIpKTtcclxufVxyXG5leHBvcnRzLmluaXQgPSBpbml0O1xyXG5mdW5jdGlvbiBkcmF3KCkge1xyXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcbn1cclxuZXhwb3J0cy5kcmF3ID0gZHJhdztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9SZW5kZXJlci50c1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///6\n");

/***/ }),
/* 7 */
/*!***************************!*\
  !*** ./ts/ShaderTools.ts ***!
  \***************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction makeShader(gl, type, source) {\r\n    console.assert(type === gl.VERTEX_SHADER || type === gl.FRAGMENT_SHADER);\r\n    let shader = gl.createShader(type);\r\n    gl.shaderSource(shader, source);\r\n    gl.compileShader(shader);\r\n    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {\r\n        console.error(\"Shader compile error \", gl.getShaderInfoLog(shader));\r\n        return null;\r\n    }\r\n    return shader;\r\n}\r\nexports.makeShader = makeShader;\r\nfunction createProgram(gl, shaders) {\r\n    console.assert(shaders.length > 0);\r\n    let program = gl.createProgram();\r\n    shaders.forEach(shader => gl.attachShader(program, shader));\r\n    gl.linkProgram(program);\r\n    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {\r\n        console.error(\"Unable to initialize the shader program.\", gl.getProgramInfoLog(program));\r\n        return null;\r\n    }\r\n    return program;\r\n}\r\nexports.createProgram = createProgram;\r\nfunction createProgramFromSource(gl, vssource, fssource) {\r\n    let shaders = [\r\n        makeShader(gl, gl.VERTEX_SHADER, vssource),\r\n        makeShader(gl, gl.FRAGMENT_SHADER, fssource)\r\n    ];\r\n    let shaderProgram = createProgram(gl, shaders);\r\n    gl.useProgram(shaderProgram);\r\n    return shaderProgram;\r\n}\r\nexports.createProgramFromSource = createProgramFromSource;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3RzL1NoYWRlclRvb2xzLnRzP2VmZTkiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gbWFrZVNoYWRlcihnbCwgdHlwZSwgc291cmNlKSB7XHJcbiAgICBjb25zb2xlLmFzc2VydCh0eXBlID09PSBnbC5WRVJURVhfU0hBREVSIHx8IHR5cGUgPT09IGdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICBsZXQgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xyXG4gICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlNoYWRlciBjb21waWxlIGVycm9yIFwiLCBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNoYWRlcjtcclxufVxyXG5leHBvcnRzLm1ha2VTaGFkZXIgPSBtYWtlU2hhZGVyO1xyXG5mdW5jdGlvbiBjcmVhdGVQcm9ncmFtKGdsLCBzaGFkZXJzKSB7XHJcbiAgICBjb25zb2xlLmFzc2VydChzaGFkZXJzLmxlbmd0aCA+IDApO1xyXG4gICAgbGV0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICBzaGFkZXJzLmZvckVhY2goc2hhZGVyID0+IGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBzaGFkZXIpKTtcclxuICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmFibGUgdG8gaW5pdGlhbGl6ZSB0aGUgc2hhZGVyIHByb2dyYW0uXCIsIGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBwcm9ncmFtO1xyXG59XHJcbmV4cG9ydHMuY3JlYXRlUHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW07XHJcbmZ1bmN0aW9uIGNyZWF0ZVByb2dyYW1Gcm9tU291cmNlKGdsLCB2c3NvdXJjZSwgZnNzb3VyY2UpIHtcclxuICAgIGxldCBzaGFkZXJzID0gW1xyXG4gICAgICAgIG1ha2VTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzc291cmNlKSxcclxuICAgICAgICBtYWtlU2hhZGVyKGdsLCBnbC5GUkFHTUVOVF9TSEFERVIsIGZzc291cmNlKVxyXG4gICAgXTtcclxuICAgIGxldCBzaGFkZXJQcm9ncmFtID0gY3JlYXRlUHJvZ3JhbShnbCwgc2hhZGVycyk7XHJcbiAgICBnbC51c2VQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xyXG4gICAgcmV0dXJuIHNoYWRlclByb2dyYW07XHJcbn1cclxuZXhwb3J0cy5jcmVhdGVQcm9ncmFtRnJvbVNvdXJjZSA9IGNyZWF0ZVByb2dyYW1Gcm9tU291cmNlO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL1NoYWRlclRvb2xzLnRzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///7\n");

/***/ }),
/* 8 */
/*!*************************!*\
  !*** ./shader/map.vert ***!
  \*************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

eval("module.exports = \"precision mediump float;\\r\\n\\r\\nattribute vec3 aVertexPosition;\\r\\n\\r\\nuniform float z;\\r\\n\\r\\nvarying vec4 color;\\r\\n\\r\\nuniform mat4 uMVMatrix;\\r\\nuniform mat4 uPMatrix;\\r\\n\\r\\nvoid main(void) {\\r\\n\\tgl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(0.0,0.0,z), 1.0);\\r\\n}\"//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NoYWRlci9tYXAudmVydD9hNDI0Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXHJcXG5cXHJcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxyXFxuXFxyXFxudW5pZm9ybSBmbG9hdCB6O1xcclxcblxcclxcbnZhcnlpbmcgdmVjNCBjb2xvcjtcXHJcXG5cXHJcXG51bmlmb3JtIG1hdDQgdU1WTWF0cml4O1xcclxcbnVuaWZvcm0gbWF0NCB1UE1hdHJpeDtcXHJcXG5cXHJcXG52b2lkIG1haW4odm9pZCkge1xcclxcblxcdGdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiArIHZlYzMoMC4wLDAuMCx6KSwgMS4wKTtcXHJcXG59XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NoYWRlci9tYXAudmVydFxuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///8\n");

/***/ }),
/* 9 */
/*!*************************!*\
  !*** ./shader/map.frag ***!
  \*************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

eval("module.exports = \"precision mediump float;\\r\\n\\r\\nvarying vec4 color;\\r\\n\\r\\nvoid main(void) {\\r\\n\\tgl_FragColor = color;\\r\\n}\"//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NoYWRlci9tYXAuZnJhZz9iYmRjIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXHJcXG5cXHJcXG52YXJ5aW5nIHZlYzQgY29sb3I7XFxyXFxuXFxyXFxudm9pZCBtYWluKHZvaWQpIHtcXHJcXG5cXHRnbF9GcmFnQ29sb3IgPSBjb2xvcjtcXHJcXG59XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NoYWRlci9tYXAuZnJhZ1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///9\n");

/***/ }),
/* 10 */
/*!*******************************!*\
  !*** ./ts/LocalTestServer.ts ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass LocalTestServer {\r\n    constructor() {\r\n        this.connected = false;\r\n    }\r\n    connect() {\r\n        this.connected = true;\r\n    }\r\n    disconnect() {\r\n        this.connected = false;\r\n    }\r\n    isConnected() {\r\n        return this.connected;\r\n    }\r\n    sendInput(pressed) {\r\n    }\r\n}\r\nexports.default = LocalTestServer;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTAuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90cy9Mb2NhbFRlc3RTZXJ2ZXIudHM/MmQ5YiJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBMb2NhbFRlc3RTZXJ2ZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZGlzY29ubmVjdCgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaXNDb25uZWN0ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGVkO1xyXG4gICAgfVxyXG4gICAgc2VuZElucHV0KHByZXNzZWQpIHtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBMb2NhbFRlc3RTZXJ2ZXI7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvTG9jYWxUZXN0U2VydmVyLnRzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///10\n");

/***/ })
/******/ ]);