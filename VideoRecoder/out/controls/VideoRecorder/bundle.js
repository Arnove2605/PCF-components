/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./VideoRecorder/index.ts":
/*!********************************!*\
  !*** ./VideoRecorder/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   VideoRecorder: () => (/* binding */ VideoRecorder)\n/* harmony export */ });\nvar __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {\n  function adopt(value) {\n    return value instanceof P ? value : new P(function (resolve) {\n      resolve(value);\n    });\n  }\n  return new (P || (P = Promise))(function (resolve, reject) {\n    function fulfilled(value) {\n      try {\n        step(generator.next(value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function rejected(value) {\n      try {\n        step(generator[\"throw\"](value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function step(result) {\n      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);\n    }\n    step((generator = generator.apply(thisArg, _arguments || [])).next());\n  });\n};\nclass VideoRecorder {\n  constructor() {\n    this._recordedChunks = [];\n    this._videoUrl = \"\";\n    this._mediaRecorder = null;\n  }\n  init(context, notifyOutputChanged, state, container) {\n    this._context = context;\n    this._notifyOutputChanged = notifyOutputChanged;\n    this._container = container;\n    // Create UI elements\n    this._videoElement = document.createElement(\"video\");\n    this._videoElement.controls = true;\n    this._videoElement.style.width = \"100%\";\n    this._startButton = document.createElement(\"button\");\n    this._startButton.innerText = \"Start Recording\";\n    this._startButton.onclick = () => this.startRecording();\n    this._stopButton = document.createElement(\"button\");\n    this._stopButton.innerText = \"Stop Recording\";\n    this._stopButton.disabled = true;\n    this._stopButton.onclick = () => this.stopRecording();\n    this._uploadButton = document.createElement(\"button\");\n    this._uploadButton.innerText = \"Upload Recording\";\n    this._uploadButton.disabled = true; // Disabled until recording is stopped\n    this._uploadButton.onclick = () => this.uploadVideo();\n    // Create error message element\n    this._errorElement = document.createElement(\"div\");\n    this._errorElement.style.color = \"red\";\n    this._errorElement.style.marginTop = \"10px\";\n    this._errorElement.className = \"errorMessage\";\n    // Append elements to container\n    this._container.appendChild(this._videoElement);\n    this._container.appendChild(this._startButton);\n    this._container.appendChild(this._stopButton);\n    this._container.appendChild(this._uploadButton);\n    this._container.appendChild(this._errorElement);\n  }\n  startRecording() {\n    return __awaiter(this, void 0, void 0, function* () {\n      this._errorElement.innerText = \"\";\n      try {\n        // Request back camera with facingMode: \"environment\"\n        var stream = yield navigator.mediaDevices.getUserMedia({\n          video: {\n            facingMode: \"environment\"\n          },\n          audio: true\n        });\n        this._videoElement.srcObject = stream;\n        this._videoElement.play();\n        this._mediaRecorder = new MediaRecorder(stream);\n        this._recordedChunks = [];\n        this._mediaRecorder.ondataavailable = event => {\n          if (event.data.size > 0) {\n            this._recordedChunks.push(event.data);\n          }\n        };\n        this._mediaRecorder.start();\n        this._startButton.disabled = true;\n        this._stopButton.disabled = false;\n        this._uploadButton.disabled = true;\n      } catch (error) {\n        this._errorElement.innerText = \"Failed to access camera/microphone. Please ensure permissions are granted.\";\n        console.error(\"Recording error:\", error);\n      }\n    });\n  }\n  stopRecording() {\n    if (this._mediaRecorder && this._mediaRecorder.state !== \"inactive\") {\n      this._mediaRecorder.stop();\n      this._videoElement.srcObject = null;\n      this._startButton.disabled = false;\n      this._stopButton.disabled = true;\n      this._uploadButton.disabled = false; // Enable upload button after stopping\n    }\n    console.log(\"from stopRecording() test\");\n  }\n  uploadVideo() {\n    return __awaiter(this, void 0, void 0, function* () {\n      console.log(\"test\");\n      this._errorElement.innerText = \"\";\n      if (this._recordedChunks.length === 0) {\n        this._errorElement.innerText = \"No video recorded. Please record a video first.\";\n        this._errorElement.style.color = \"red\";\n        return;\n      }\n      var blob = new Blob(this._recordedChunks, {\n        type: \"video/webm\"\n      });\n      var fileName = \"Video_\".concat(new Date().toISOString(), \".webm\");\n      var reader = new FileReader();\n      reader.readAsDataURL(blob);\n      reader.onloadend = () => __awaiter(this, void 0, void 0, function* () {\n        var _a;\n        var base64Data = (_a = reader.result) === null || _a === void 0 ? void 0 : _a.toString().split(\",\")[1]; // Remove \"data:...\" prefix\n        console.log(\"Base64 length:\", base64Data === null || base64Data === void 0 ? void 0 : base64Data.length);\n        console.log(\"Sending filename:\", fileName);\n        try {\n          var response = yield fetch(\"https://prod-14.centralindia.logic.azure.com:443/workflows/21547afd4894460a88b9221a249f5a40/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MR1CosjZY0G_UW4KLiQdqNJEu4RmERCh7hPbRopYges\", {\n            method: \"POST\",\n            headers: {\n              \"Content-Type\": \"application/json\"\n            },\n            body: JSON.stringify({\n              VideoFile: base64Data,\n              FileName: fileName\n            })\n          });\n          console.log(\"Upload status:\", response.status);\n          var responseText = yield response.text();\n          console.log(\"Response text:\", responseText);\n          if (!response.ok) {\n            throw new Error(\"Upload failed: \".concat(response.statusText));\n          }\n          // If it's just plain URL in responseText\n          this._videoUrl = responseText.trim();\n          this._notifyOutputChanged();\n          this._videoElement.src = this._videoUrl;\n          this._errorElement.innerText = \"Video uploaded successfully!\";\n          this._errorElement.style.color = \"green\";\n          this._uploadButton.disabled = true; // Disable upload button after successful upload\n        } catch (error) {\n          this._errorElement.innerText = \"Failed to upload video. Check console for details.\";\n          this._errorElement.style.color = \"red\";\n          console.error(\"Upload error:\", error);\n        }\n      });\n    });\n  }\n  updateView(context) {\n    // Update control if needed\n  }\n  getOutputs() {\n    return {\n      videoUrl: this._videoUrl\n    };\n  }\n  destroy() {\n    if (this._mediaRecorder && this._mediaRecorder.state !== \"inactive\") {\n      this._mediaRecorder.stop();\n    }\n    if (this._videoElement.srcObject) {\n      var tracks = this._videoElement.srcObject.getTracks();\n      tracks.forEach(track => track.stop());\n    }\n    this._videoElement.srcObject = null;\n  }\n}\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./VideoRecorder/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./VideoRecorder/index.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = __webpack_exports__;
/******/ 	
/******/ })()
;
if (window.ComponentFramework && window.ComponentFramework.registerControl) {
	ComponentFramework.registerControl('VideoRecorder.VideoRecorder', pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.VideoRecorder);
} else {
	var VideoRecorder = VideoRecorder || {};
	VideoRecorder.VideoRecorder = pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.VideoRecorder;
	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = undefined;
}