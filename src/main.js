
const isochroneFromGeoJSON = require('../scripts/isochroneFromGeoJSON.js');

// Load environment variables from .env file
const MAPBOX_API_TOKEN = process.env.MAPBOX_API_TOKEN;

mapboxgl.accessToken = MAPBOX_API_TOKEN;

// setup the basic map layer.
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-93.2662673, 44.9771477],
    zoom: 11,
});

// add data source and layers to map


let datasets = [
    {
        'name': 'MPS Playgrounds',
        'path': 'data/overpass-MPS-Playgrounds.json',
        'type': 'polygons',
        'color': '#0A7B83',
        'note': 'data pulled from OSM via overpass-turbo'
    },
    {
        'name': 'MPRB Playgrounds',
        'path': 'data/overpass-MPRB-Playgrounds.json',
        'type': 'polygons',
        'color': '#F19C65',
        'note': 'data pulled from OSM via overpass-turbo'
    }
]

map.on('load', async () => {
    for (const dataset of datasets) {
        try {
            const response = await fetch(dataset.path);
            const geoJSONObject = await response.json();

            geoJSONObject.properties = { ...dataset };

            console.log(geoJSONObject);
        } catch (error) {
            console.error('Error fetching or processing JSON:', error);
        }
    }

});


// map.on('load', () => {



//     (async () => {
//         try {
//             // Array of file paths
//             const filePaths = ['data/overpass-MPS-Playgrounds.json', 'data/overpass-MPRB-Playgrounds.json'];


//             // Fetch all JSON files in parallel
//             const responses = await Promise.all(filePaths.map(filePath => fetch(filePath)));

//             // Extract JSON data from responses
//             const geoJSONObject = await Promise.all(responses.map(response => response.json()));

//             // Filter data based on category property
//             const filteredDataArray = geoJSONObject.map((collection, index) => {
//                 if(
//                     collection.features[0] &&
//                     collection.features[0].properties &&
//                     collection.features[0].properties.hasOwnProperty('category')
//                 ){
//                     return {
//                         ...collection,
//                         features: collection.features.filter(
//                             item => item.properties && (item.properties.category === 'Elementary School' || item.properties.name.includes('Elementary'))
//                         ),
//                     };                    
//                 } else {
//                     return collection;
//                 }
//             });


//             // Your code to place the data on the map
//             filteredDataArray.forEach(async (jsonData, index) => {
//                 const sourceId = `iso-${index}`;
//                 const layerId = `isoLayer-${index}`;
//                 const colors = ['#0A7B83', '#F19C65', '#2AA876', '#FFD265', '#CE4D45'];

//                 map.addSource(sourceId, {
//                     type: 'geojson',
//                     data: {
//                         type: 'FeatureCollection',
//                         features: [],
//                     },
//                 });

//                 map.addLayer(
//                     {
//                         id: layerId,
//                         type: 'fill',
//                         source: sourceId,
//                         layout: {},
//                         paint: {
//                             'fill-color': colors[index],
//                             'fill-opacity': 0.3,
//                         },
//                     },
//                     'poi-label'
//                 );

//                 const isoFeatures = await isochroneFromGeoJSON({
//                     data: jsonData.features,
//                     minutes: 10,
//                     profile: 'walking',
//                     urlBase: 'https://api.mapbox.com/isochrone/v1/mapbox/',
//                 });

//                 const isoFeatureCollection = {
//                     type: 'FeatureCollection',
//                     features: isoFeatures,
//                 }

//                 // console.log(jsonData)
//                 // // Create a Blob containing the JSON data
//                 // const blob = new Blob([JSON.stringify(isoFeatureCollection, null, 2)], { type: 'application/json' });

//                 // // Create a download link
//                 // const downloadLink = document.createElement('a');
//                 // downloadLink.href = window.URL.createObjectURL(blob);
//                 // downloadLink.download = `isoFeatureCollection-${jsonData.source_agency.short}.json`;

//                 // // Append the link to the body
//                 // document.body.appendChild(downloadLink);

//                 // // Programmatically click the link to trigger the download
//                 // downloadLink.click();

//                 // // Remove the link from the DOM
//                 // document.body.removeChild(downloadLink);


//                 map.getSource(sourceId).setData(isoFeatureCollection);
//             });
//         } catch (error) {
//             console.error('Error fetching or processing JSON:', error);
//         }
//     })();
// });