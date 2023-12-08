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

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ (() => {

eval("\n\nmapboxgl.accessToken = 'pk.eyJ1IjoiZ2F6b29rODkiLCJhIjoiY2xvejlteGMxMGEzYjJvbGV5NXRiNHBkZSJ9.Tuqh-azZda6b4Tb0bYDrIw';\n\n\n// setup the basic map layer.\nconst map = new mapboxgl.Map({\n    container: 'map',\n    style: 'mapbox://styles/mapbox/streets-v12',\n    center: [-93.2662673, 44.9771477],\n    zoom: 11\n});\n\n\n// isochrone\nconst urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';\nconst profile = 'walking';\nconst minutes = 10;\n\n// setup api query\nasync function getIso(points) {\n    let isoFeatures = [];\n\n    const promises = points.features.map(async (point) => {\n        const coordinates = point.geojson.geometry.coordinates;\n        const response = await fetch(`${urlBase}${profile}/${coordinates[0]},${coordinates[1]}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`);\n        const data = await response.json();\n        isoFeatures.push(...data.features);\n    });\n\n    await Promise.all(promises);\n\n    map.getSource('iso').setData({\n        type: \"FeatureCollection\",\n        features: isoFeatures\n    });\n\n    const jsonOutput = {\n        type: \"FeatureCollection\",\n        features: isoFeatures\n    };\n\n    const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json' });\n\n    const link = document.createElement('a');\n    link.href = URL.createObjectURL(blob);\n    link.download = 'isochrone-data.json';\n    link.click();\n}\n\n// add data source and layers to map\nmap.on('load', async () => {\n\n    // Fetch the JSON data\n    fetch('./mprb-output.json')\n    .then(response => response.json())\n    .then(data => {\n        // Use the loaded JSON data\n        console.log(data);\n\n        // Your code to place the data on the map\n        // For example, iterate through the data and add markers to the map\n        map.addSource('iso', {\n            type: 'geojson',\n            data: {\n                type: 'FeatureCollection',\n                features: []\n            }\n        });\n\n        map.addLayer(\n            {\n                id: 'isoLayer',\n                type: 'fill',\n                source: 'iso',\n                layout: {},\n                paint: {\n                    'fill-color': '#5a3fc0',\n                    'fill-opacity': 0.3\n                }\n            },\n            'poi-label'\n        );\n\n        getIso(data);\n    })\n    .catch(error => {\n        console.error('Error fetching JSON:', error);\n    });\n\n});\n\n\n\n//# sourceURL=webpack://map-box-test/./src/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/main.js"]();
/******/ 	
/******/ })()
;