/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/isochroneFromGeoJSON.js":
/*!*****************************************!*\
  !*** ./scripts/isochroneFromGeoJSON.js ***!
  \*****************************************/
/***/ ((module) => {

eval("// Load environment variables from .env file\nconst MAPBOX_API_TOKEN = \"pk.eyJ1IjoiZ2F6b29rODkiLCJhIjoiY2xweDhkOHprMDg0ZzJpcGE4ZHgzemRydiJ9.T9rvwrur6YBeqtae3FO5cQ\";\n\n\n\n// setup api query\nasync function isochroneFromGeoJSON(object) {\n    let isoFeatures = [];\n\n    await Promise.all(\n        object.data.features.map(async (point) => {\n            const coordinates = point.geojson.geometry.coordinates;\n            const response = await fetch(`${object.urlBase}${object.profile}/${coordinates[0]},${coordinates[1]}?contours_minutes=${object.minutes}&polygons=true&access_token=${MAPBOX_API_TOKEN}`);\n            const data = await response.json();\n            isoFeatures.push(...data.features);\n        })\n    );\n\n    return isoFeatures;\n}\n\nmodule.exports = isochroneFromGeoJSON;\n\n\n//# sourceURL=webpack://map-box-test/./scripts/isochroneFromGeoJSON.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const isochroneFromGeoJSON = __webpack_require__(/*! ../scripts/isochroneFromGeoJSON.js */ \"./scripts/isochroneFromGeoJSON.js\");\n\n\n// Load environment variables from .env file\nconst MAPBOX_API_TOKEN = \"pk.eyJ1IjoiZ2F6b29rODkiLCJhIjoiY2xweDhkOHprMDg0ZzJpcGE4ZHgzemRydiJ9.T9rvwrur6YBeqtae3FO5cQ\";\n\nmapboxgl.accessToken = MAPBOX_API_TOKEN;\n\n// setup the basic map layer.\nconst map = new mapboxgl.Map({\n    container: 'map',\n    style: 'mapbox://styles/mapbox/streets-v12',\n    center: [-93.2662673, 44.9771477],\n    zoom: 11\n});\n\n\n\n// add data source and layers to map\nmap.on('load', async () => {\n    try {\n        // Fetch the JSON data\n        const response = await fetch('data/MPRB-Parks-scrape-results.json');\n        const data = await response.json();\n\n        // Your code to place the data on the map\n        // For example, iterate through the data and add markers to the map\n        map.addSource('iso', {\n            type: 'geojson',\n            data: {\n                type: 'FeatureCollection',\n                features: [],\n            },\n        });\n\n        map.addLayer(\n            {\n                id: 'isoLayer',\n                type: 'fill',\n                source: 'iso',\n                layout: {},\n                paint: {\n                    'fill-color': '#5a3fc0',\n                    'fill-opacity': 0.3,\n                },\n            },\n            'poi-label'\n        );\n\n        const isoFeatures = await isochroneFromGeoJSON({\n            data: data,\n            minutes: 10,\n            profile: 'walking',\n            urlBase: 'https://api.mapbox.com/isochrone/v1/mapbox/',\n        });\n\n        map.getSource('iso').setData({\n            type: 'FeatureCollection',\n            features: isoFeatures,\n        });\n    } catch (error) {\n        console.error('Error fetching or processing JSON:', error);\n    }\n});\n\n//# sourceURL=webpack://map-box-test/./src/main.js?");

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;