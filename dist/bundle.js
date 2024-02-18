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

eval("// Load environment variables from .env file\nconst MAPBOX_API_TOKEN = \"pk.eyJ1IjoiZ2F6b29rODkiLCJhIjoiY2xzcXYybHByMTNsZDJqbnl3djI2dmJlNSJ9.Jwm81eAvCR2uB2VLPXNDqw\";\n\n\n\n// setup api query\nasync function isochroneFromGeoJSON(object) {\n    let isoFeatures = [];\n    await Promise.all(\n        object.data.map(async (point) => {\n            const coordinates = point.geometry.coordinates;\n            const response = await fetch(`${object.urlBase}${object.profile}/${coordinates[0]},${coordinates[1]}?contours_minutes=${object.minutes}&polygons=true&access_token=${MAPBOX_API_TOKEN}`);\n            const data = await response.json();\n            isoFeatures.push(...data.features);\n        })\n    );\n\n    return isoFeatures;\n}\n\nmodule.exports = isochroneFromGeoJSON;\n\n\n//# sourceURL=webpack://map-box-test/./scripts/isochroneFromGeoJSON.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("\nconst isochroneFromGeoJSON = __webpack_require__(/*! ../scripts/isochroneFromGeoJSON.js */ \"./scripts/isochroneFromGeoJSON.js\");\n\n// Load environment variables from .env file\nconst MAPBOX_API_TOKEN = \"pk.eyJ1IjoiZ2F6b29rODkiLCJhIjoiY2xzcXYybHByMTNsZDJqbnl3djI2dmJlNSJ9.Jwm81eAvCR2uB2VLPXNDqw\";\n\nmapboxgl.accessToken = MAPBOX_API_TOKEN;\n\n// setup the basic map layer.\nconst map = new mapboxgl.Map({\n    container: 'map',\n    style: 'mapbox://styles/mapbox/streets-v12',\n    center: [-93.2662673, 44.9771477],\n    zoom: 11,\n});\n\n// add data source and layers to map\n\nmap.on('load', () => {\n    (async () => {\n        try {\n            // Array of file paths\n            const filePaths = ['data/MPRB-Parks-scrape-results.json', 'data/MPS-Properties-output.json'];\n\n            // Fetch all JSON files in parallel\n            const responses = await Promise.all(filePaths.map(filePath => fetch(filePath)));\n\n            // Extract JSON data from responses\n            const geoJSONObject = await Promise.all(responses.map(response => response.json()));\n\n            // Filter data based on category property\n            const filteredDataArray = geoJSONObject.map((collection, index) => {\n                if (\n                    collection.features[0] &&\n                    collection.features[0].properties &&\n                    collection.features[0].properties.hasOwnProperty('category')\n                ) {\n                    return {\n                        ...collection,\n                        features: collection.features.filter(\n                            item => item.properties && (item.properties.category === 'Elementary School' || item.properties.name.includes('Elementary'))\n                        ),\n                    };                    \n                } else {\n                    return collection;\n                }\n            });\n\n\n\n            // Your code to place the data on the map\n            filteredDataArray.forEach(async (jsonData, index) => {\n                const sourceId = `iso-${index}`;\n                const layerId = `isoLayer-${index}`;\n                const colors = ['#0A7B83', '#F19C65', '#2AA876', '#FFD265', '#CE4D45'];\n\n                map.addSource(sourceId, {\n                    type: 'geojson',\n                    data: {\n                        type: 'FeatureCollection',\n                        features: [],\n                    },\n                });\n\n                map.addLayer(\n                    {\n                        id: layerId,\n                        type: 'fill',\n                        source: sourceId,\n                        layout: {},\n                        paint: {\n                            'fill-color': colors[index],\n                            'fill-opacity': 0.3,\n                        },\n                    },\n                    'poi-label'\n                );\n\n                const isoFeatures = await isochroneFromGeoJSON({\n                    data: jsonData.features,\n                    minutes: 10,\n                    profile: 'walking',\n                    urlBase: 'https://api.mapbox.com/isochrone/v1/mapbox/',\n                });\n\n                const isoFeatureCollection = {\n                    type: 'FeatureCollection',\n                    features: isoFeatures,\n                }\n\n                // console.log(jsonData)\n                // // Create a Blob containing the JSON data\n                // const blob = new Blob([JSON.stringify(isoFeatureCollection, null, 2)], { type: 'application/json' });\n\n                // // Create a download link\n                // const downloadLink = document.createElement('a');\n                // downloadLink.href = window.URL.createObjectURL(blob);\n                // downloadLink.download = `isoFeatureCollection-${jsonData.source_agency.short}.json`;\n\n                // // Append the link to the body\n                // document.body.appendChild(downloadLink);\n\n                // // Programmatically click the link to trigger the download\n                // downloadLink.click();\n\n                // // Remove the link from the DOM\n                // document.body.removeChild(downloadLink);\n\n\n                map.getSource(sourceId).setData(isoFeatureCollection);\n            });\n        } catch (error) {\n            console.error('Error fetching or processing JSON:', error);\n        }\n    })();\n});\n\n//# sourceURL=webpack://map-box-test/./src/main.js?");

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