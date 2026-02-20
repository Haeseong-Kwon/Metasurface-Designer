/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "(ssr)/./lib/physics/engine.ts":
/*!*******************************!*\
  !*** ./lib/physics/engine.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PhaseCalculator: () => (/* binding */ PhaseCalculator),\n/* harmony export */   UnitCellMapper: () => (/* binding */ UnitCellMapper)\n/* harmony export */ });\n/**\n * PhaseCalculator\n * 하이퍼볼릭 위상 프로파일을 계산하고 메타렌즈의 위상 맵을 생성합니다.\n */ class PhaseCalculator {\n    constructor(params){\n        this.validateParameters(params);\n        this.params = params;\n    }\n    /**\n     * 입력 파라미터 유효성 검사\n     */ validateParameters(params) {\n        if (params.focalLength <= 0) throw new Error(\"Focal length must be positive.\");\n        if (params.wavelength <= 0) throw new Error(\"Wavelength must be positive.\");\n        if (params.numericalAperture <= 0 || params.numericalAperture >= 1) {\n            throw new Error(\"Numerical Aperture (NA) must be between 0 and 1.\");\n        }\n    }\n    /**\n     * 하이퍼볼릭 위상 수식 적용\n     * phi(r) = -(2pi/lambda) * (sqrt(r^2 + f^2) - f)\n     * @param r 중심으로부터의 거리 (um)\n     */ calculatePhaseAt(r) {\n        const { wavelength, focalLength } = this.params;\n        const phase = -(2 * Math.PI / wavelength) * (Math.sqrt(Math.pow(r, 2) + Math.pow(focalLength, 2)) - focalLength);\n        // Wrap phase into [0, 2pi] range for meta-atom mapping\n        return (phase % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);\n    }\n    /**\n     * 그리드 기반 위상 맵 생성\n     */ generatePhaseMap(config) {\n        const { size, resolution } = config;\n        const steps = Math.floor(size / resolution);\n        const start = -size / 2;\n        const gridX = [];\n        const gridY = [];\n        const phaseMap = [];\n        for(let i = 0; i <= steps; i++){\n            const x = start + i * resolution;\n            gridX.push(x);\n            const row = [];\n            for(let j = 0; j <= steps; j++){\n                const y = start + j * resolution;\n                if (i === 0) gridY.push(y);\n                const r = Math.sqrt(x * x + y * y);\n                // 렌즈 반경(NA 기반)을 벗어나는 영역 처리\n                const lensRadius = this.params.focalLength * Math.tan(Math.asin(this.params.numericalAperture));\n                if (r <= lensRadius) {\n                    row.push(this.calculatePhaseAt(r));\n                } else {\n                    row.push(0); // Out of aperture\n                }\n            }\n            phaseMap.push(row);\n        }\n        return {\n            phaseMap,\n            gridX,\n            gridY\n        };\n    }\n}\n/**\n * UnitCellMapper\n * 계산된 위상 값을 Meta-Atom Library와 매핑하여 최적의 구조를 선택합니다.\n */ class UnitCellMapper {\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9saWIvcGh5c2ljcy9lbmdpbmUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQTs7O0NBR0MsR0FDTSxNQUFNQTtJQUdUQyxZQUFZQyxNQUF5QixDQUFFO1FBQ25DLElBQUksQ0FBQ0Msa0JBQWtCLENBQUNEO1FBQ3hCLElBQUksQ0FBQ0EsTUFBTSxHQUFHQTtJQUNsQjtJQUVBOztLQUVDLEdBQ0QsbUJBQTJCQSxNQUF5QixFQUFRO1FBQ3hELElBQUlBLE9BQU9FLFdBQVcsSUFBSSxHQUFHLE1BQU0sSUFBSUMsTUFBTTtRQUM3QyxJQUFJSCxPQUFPSSxVQUFVLElBQUksR0FBRyxNQUFNLElBQUlELE1BQU07UUFDNUMsSUFBSUgsT0FBT0ssaUJBQWlCLElBQUksS0FBS0wsT0FBT0ssaUJBQWlCLElBQUksR0FBRztZQUNoRSxNQUFNLElBQUlGLE1BQU07UUFDcEI7SUFDSjtJQUVBOzs7O0tBSUMsR0FDRCxpQkFBd0JJLENBQVMsRUFBVTtRQUN2QyxNQUFNLEVBQUVILFVBQVUsRUFBRUYsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDRixNQUFNO1FBQy9DLE1BQU1RLFFBQVEsQ0FBRSxLQUFJQyxLQUFLQyxFQUFFLEdBQUdOLFVBQVMsSUFBTUssQ0FBQUEsS0FBS0UsSUFBSSxDQUFDRixLQUFLRyxHQUFHLENBQUNMLEdBQUcsS0FBS0UsS0FBS0csR0FBRyxDQUFDVixhQUFhLE1BQU1BLFdBQVU7UUFFOUcsdURBQXVEO1FBQ3ZELE9BQU8sQ0FBQyxRQUFVLEtBQUlPLEtBQUtDLEVBQUUsSUFBSyxJQUFJRCxLQUFLQyxFQUFFLElBQUssS0FBSUQsS0FBS0MsRUFBRTtJQUNqRTtJQUVBOztLQUVDLEdBQ0QsaUJBQXdCSSxNQUFrQixFQUFvQjtRQUMxRCxNQUFNLEVBQUVDLElBQUksRUFBRUMsVUFBVSxFQUFFLEdBQUdGO1FBQzdCLE1BQU1HLFFBQVFSLEtBQUtTLEtBQUssQ0FBQ0gsT0FBT0M7UUFDaEMsTUFBTUcsUUFBUSxDQUFDSixPQUFPO1FBRXRCLE1BQU1LLFFBQWtCLEVBQUU7UUFDMUIsTUFBTUMsUUFBa0IsRUFBRTtRQUMxQixNQUFNQyxXQUF1QixFQUFFO1FBRS9CLElBQUssSUFBSUMsSUFBSSxHQUFHQSxLQUFLTixPQUFPTSxJQUFLO1lBQzdCLE1BQU1DLElBQUlMLFFBQVFJLElBQUlQO1lBQ3RCSSxNQUFNSyxJQUFJLENBQUNEO1lBRVgsTUFBTUUsTUFBZ0IsRUFBRTtZQUN4QixJQUFLLElBQUlDLElBQUksR0FBR0EsS0FBS1YsT0FBT1UsSUFBSztnQkFDN0IsTUFBTUMsSUFBSVQsUUFBUVEsSUFBSVg7Z0JBQ3RCLElBQUlPLE1BQU0sR0FBR0YsTUFBTUksSUFBSSxDQUFDRztnQkFFeEIsTUFBTXJCLElBQUlFLEtBQUtFLElBQUksQ0FBQ2EsSUFBSUEsSUFBSUksSUFBSUE7Z0JBQ2hDLDJCQUEyQjtnQkFDM0IsTUFBTUMsYUFBYSxJQUFJLENBQUM3QixNQUFNLENBQUNFLFdBQVcsR0FBR08sS0FBS3FCLEdBQUcsQ0FBQ3JCLEtBQUtzQixJQUFJLENBQUMsSUFBSSxDQUFDL0IsTUFBTSxDQUFDSyxpQkFBaUI7Z0JBRTdGLElBQUlFLEtBQUtzQixZQUFZO29CQUNqQkgsSUFBSUQsSUFBSSxDQUFDLElBQUksQ0FBQ25CLGdCQUFnQixDQUFDQztnQkFDbkMsT0FBTztvQkFDSG1CLElBQUlELElBQUksQ0FBQyxJQUFJLGtCQUFrQjtnQkFDbkM7WUFDSjtZQUNBSCxTQUFTRyxJQUFJLENBQUNDO1FBQ2xCO1FBRUEsT0FBTztZQUFFSjtZQUFVRjtZQUFPQztRQUFNO0lBQ3BDO0FBQ0o7QUFFQTs7O0NBR0MsR0FDTSxNQUFNVztBQUViIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWV0YXN1cmZhY2UtZGVzaWduZXIvLi9saWIvcGh5c2ljcy9lbmdpbmUudHM/MjU1ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcHRpY2FsUGFyYW1ldGVycywgR3JpZENvbmZpZywgU2ltdWxhdGlvblJlc3VsdCB9IGZyb20gJ0AvdHlwZXMvcGh5c2ljcyc7XG5cbi8qKlxuICogUGhhc2VDYWxjdWxhdG9yXG4gKiDtlZjsnbTtjbzrs7zrpq0g7JyE7IOBIO2UhOuhnO2MjOydvOydhCDqs4TsgrDtlZjqs6Ag66mU7YOA66CM7KaI7J2YIOychOyDgSDrp7XsnYQg7IOd7ISx7ZWp64uI64ukLlxuICovXG5leHBvcnQgY2xhc3MgUGhhc2VDYWxjdWxhdG9yIHtcbiAgICBwcml2YXRlIHBhcmFtczogT3B0aWNhbFBhcmFtZXRlcnM7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IE9wdGljYWxQYXJhbWV0ZXJzKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVQYXJhbWV0ZXJzKHBhcmFtcyk7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOyeheugpSDtjIzrnbzrr7jthLAg7Jyg7Zqo7ISxIOqygOyCrFxuICAgICAqL1xuICAgIHByaXZhdGUgdmFsaWRhdGVQYXJhbWV0ZXJzKHBhcmFtczogT3B0aWNhbFBhcmFtZXRlcnMpOiB2b2lkIHtcbiAgICAgICAgaWYgKHBhcmFtcy5mb2NhbExlbmd0aCA8PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0ZvY2FsIGxlbmd0aCBtdXN0IGJlIHBvc2l0aXZlLicpO1xuICAgICAgICBpZiAocGFyYW1zLndhdmVsZW5ndGggPD0gMCkgdGhyb3cgbmV3IEVycm9yKCdXYXZlbGVuZ3RoIG11c3QgYmUgcG9zaXRpdmUuJyk7XG4gICAgICAgIGlmIChwYXJhbXMubnVtZXJpY2FsQXBlcnR1cmUgPD0gMCB8fCBwYXJhbXMubnVtZXJpY2FsQXBlcnR1cmUgPj0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOdW1lcmljYWwgQXBlcnR1cmUgKE5BKSBtdXN0IGJlIGJldHdlZW4gMCBhbmQgMS4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIO2VmOydtO2NvOuzvOumrSDsnITsg4Eg7IiY7IudIOyggeyaqVxuICAgICAqIHBoaShyKSA9IC0oMnBpL2xhbWJkYSkgKiAoc3FydChyXjIgKyBmXjIpIC0gZilcbiAgICAgKiBAcGFyYW0gciDspJHsi6zsnLzroZzrtoDthLDsnZgg6rGw66asICh1bSlcbiAgICAgKi9cbiAgICBwdWJsaWMgY2FsY3VsYXRlUGhhc2VBdChyOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB7IHdhdmVsZW5ndGgsIGZvY2FsTGVuZ3RoIH0gPSB0aGlzLnBhcmFtcztcbiAgICAgICAgY29uc3QgcGhhc2UgPSAtKDIgKiBNYXRoLlBJIC8gd2F2ZWxlbmd0aCkgKiAoTWF0aC5zcXJ0KE1hdGgucG93KHIsIDIpICsgTWF0aC5wb3coZm9jYWxMZW5ndGgsIDIpKSAtIGZvY2FsTGVuZ3RoKTtcblxuICAgICAgICAvLyBXcmFwIHBoYXNlIGludG8gWzAsIDJwaV0gcmFuZ2UgZm9yIG1ldGEtYXRvbSBtYXBwaW5nXG4gICAgICAgIHJldHVybiAoKHBoYXNlICUgKDIgKiBNYXRoLlBJKSkgKyAyICogTWF0aC5QSSkgJSAoMiAqIE1hdGguUEkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOq3uOumrOuTnCDquLDrsJgg7JyE7IOBIOuntSDsg53shLFcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2VuZXJhdGVQaGFzZU1hcChjb25maWc6IEdyaWRDb25maWcpOiBTaW11bGF0aW9uUmVzdWx0IHtcbiAgICAgICAgY29uc3QgeyBzaXplLCByZXNvbHV0aW9uIH0gPSBjb25maWc7XG4gICAgICAgIGNvbnN0IHN0ZXBzID0gTWF0aC5mbG9vcihzaXplIC8gcmVzb2x1dGlvbik7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gLXNpemUgLyAyO1xuXG4gICAgICAgIGNvbnN0IGdyaWRYOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBjb25zdCBncmlkWTogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgY29uc3QgcGhhc2VNYXA6IG51bWJlcltdW10gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gc3RhcnQgKyBpICogcmVzb2x1dGlvbjtcbiAgICAgICAgICAgIGdyaWRYLnB1c2goeCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJvdzogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHN0ZXBzOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gc3RhcnQgKyBqICogcmVzb2x1dGlvbjtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkgZ3JpZFkucHVzaCh5KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgICAgICAgICAgICAgLy8g66CM7KaIIOuwmOqyvShOQSDquLDrsJgp7J2EIOuyl+yWtOuCmOuKlCDsmIHsl60g7LKY66asXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuc1JhZGl1cyA9IHRoaXMucGFyYW1zLmZvY2FsTGVuZ3RoICogTWF0aC50YW4oTWF0aC5hc2luKHRoaXMucGFyYW1zLm51bWVyaWNhbEFwZXJ0dXJlKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAociA8PSBsZW5zUmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5wdXNoKHRoaXMuY2FsY3VsYXRlUGhhc2VBdChyKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm93LnB1c2goMCk7IC8vIE91dCBvZiBhcGVydHVyZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBoYXNlTWFwLnB1c2gocm93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHBoYXNlTWFwLCBncmlkWCwgZ3JpZFkgfTtcbiAgICB9XG59XG5cbi8qKlxuICogVW5pdENlbGxNYXBwZXJcbiAqIOqzhOyCsOuQnCDsnITsg4Eg6rCS7J2EIE1ldGEtQXRvbSBMaWJyYXJ57JmAIOunpO2Vke2VmOyXrCDstZzsoIHsnZgg6rWs7KGw66W8IOyEoO2Dne2VqeuLiOuLpC5cbiAqL1xuZXhwb3J0IGNsYXNzIFVuaXRDZWxsTWFwcGVyIHtcbiAgICAvLyBUT0RPOiBTdXBhYmFzZSDsl7Drj5kg66Gc7KeBIOuwjyDstZzsoIHtmZQg6rKA7IOJIOyVjOqzoOumrOymmCDqtaztmIRcbn1cbiJdLCJuYW1lcyI6WyJQaGFzZUNhbGN1bGF0b3IiLCJjb25zdHJ1Y3RvciIsInBhcmFtcyIsInZhbGlkYXRlUGFyYW1ldGVycyIsImZvY2FsTGVuZ3RoIiwiRXJyb3IiLCJ3YXZlbGVuZ3RoIiwibnVtZXJpY2FsQXBlcnR1cmUiLCJjYWxjdWxhdGVQaGFzZUF0IiwiciIsInBoYXNlIiwiTWF0aCIsIlBJIiwic3FydCIsInBvdyIsImdlbmVyYXRlUGhhc2VNYXAiLCJjb25maWciLCJzaXplIiwicmVzb2x1dGlvbiIsInN0ZXBzIiwiZmxvb3IiLCJzdGFydCIsImdyaWRYIiwiZ3JpZFkiLCJwaGFzZU1hcCIsImkiLCJ4IiwicHVzaCIsInJvdyIsImoiLCJ5IiwibGVuc1JhZGl1cyIsInRhbiIsImFzaW4iLCJVbml0Q2VsbE1hcHBlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./lib/physics/engine.ts\n");

/***/ }),

/***/ "(ssr)/./workers/physics.worker.ts":
/*!***********************************!*\
  !*** ./workers/physics.worker.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_physics_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/physics/engine */ \"(ssr)/./lib/physics/engine.ts\");\n/* eslint-disable no-restricted-globals */ \n/**\n * Physics Worker\n * 메인 스레드 차단 없이 대규모 그리드의 위상 맵을 계산합니다.\n */ self.onmessage = (e)=>{\n    const { params, gridConfig } = e.data;\n    try {\n        const calculator = new _lib_physics_engine__WEBPACK_IMPORTED_MODULE_0__.PhaseCalculator(params);\n        const result = calculator.generatePhaseMap(gridConfig);\n        // 연산 완료 메시지 전송\n        self.postMessage({\n            type: \"DONE\",\n            result\n        });\n    } catch (error) {\n        self.postMessage({\n            type: \"ERROR\",\n            message: error.message\n        });\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi93b3JrZXJzL3BoeXNpY3Mud29ya2VyLnRzIiwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXdDLEdBQ2dCO0FBR3hEOzs7Q0FHQyxHQUNEQyxLQUFLQyxTQUFTLEdBQUcsQ0FBQ0M7SUFDZCxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsVUFBVSxFQUFFLEdBQUdGLEVBQUVHLElBQUk7SUFFckMsSUFBSTtRQUNBLE1BQU1DLGFBQWEsSUFBSVAsZ0VBQWVBLENBQUNJO1FBQ3ZDLE1BQU1JLFNBQVNELFdBQVdFLGdCQUFnQixDQUFDSjtRQUUzQyxlQUFlO1FBQ2ZKLEtBQUtTLFdBQVcsQ0FBQztZQUFFQyxNQUFNO1lBQVFIO1FBQU87SUFDNUMsRUFBRSxPQUFPSSxPQUFZO1FBQ2pCWCxLQUFLUyxXQUFXLENBQUM7WUFBRUMsTUFBTTtZQUFTRSxTQUFTRCxNQUFNQyxPQUFPO1FBQUM7SUFDN0Q7QUFDSiIsInNvdXJjZXMiOlsid2VicGFjazovL21ldGFzdXJmYWNlLWRlc2lnbmVyLy4vd29ya2Vycy9waHlzaWNzLndvcmtlci50cz81N2NkIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xuaW1wb3J0IHsgUGhhc2VDYWxjdWxhdG9yIH0gZnJvbSAnLi4vbGliL3BoeXNpY3MvZW5naW5lJztcbmltcG9ydCB7IE9wdGljYWxQYXJhbWV0ZXJzLCBHcmlkQ29uZmlnIH0gZnJvbSAnLi4vdHlwZXMvcGh5c2ljcyc7XG5cbi8qKlxuICogUGh5c2ljcyBXb3JrZXJcbiAqIOuplOyduCDsiqTroIjrk5wg7LCo64uoIOyXhuydtCDrjIDqt5zrqqgg6re466as65Oc7J2YIOychOyDgSDrp7XsnYQg6rOE7IKw7ZWp64uI64ukLlxuICovXG5zZWxmLm9ubWVzc2FnZSA9IChlOiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgICBjb25zdCB7IHBhcmFtcywgZ3JpZENvbmZpZyB9ID0gZS5kYXRhIGFzIHsgcGFyYW1zOiBPcHRpY2FsUGFyYW1ldGVyczsgZ3JpZENvbmZpZzogR3JpZENvbmZpZyB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRvciA9IG5ldyBQaGFzZUNhbGN1bGF0b3IocGFyYW1zKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY2FsY3VsYXRvci5nZW5lcmF0ZVBoYXNlTWFwKGdyaWRDb25maWcpO1xuXG4gICAgICAgIC8vIOyXsOyCsCDsmYTro4wg66mU7Iuc7KeAIOyghOyGoVxuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsgdHlwZTogJ0RPTkUnLCByZXN1bHQgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsgdHlwZTogJ0VSUk9SJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcbiAgICB9XG59O1xuIl0sIm5hbWVzIjpbIlBoYXNlQ2FsY3VsYXRvciIsInNlbGYiLCJvbm1lc3NhZ2UiLCJlIiwicGFyYW1zIiwiZ3JpZENvbmZpZyIsImRhdGEiLCJjYWxjdWxhdG9yIiwicmVzdWx0IiwiZ2VuZXJhdGVQaGFzZU1hcCIsInBvc3RNZXNzYWdlIiwidHlwZSIsImVycm9yIiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./workers/physics.worker.ts\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("(ssr)/./workers/physics.worker.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;