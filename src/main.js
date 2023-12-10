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
map.on('load', () => {
    (async () => {
        try {
            // Array of file paths
            const filePaths = ['data/MPRB-Parks-scrape-results.json', 'data/MPS-Properties-output.json'];

            // Fetch all JSON files in parallel
            const responses = await Promise.all(filePaths.map(filePath => fetch(filePath)));

            // Extract JSON data from responses
            const geoJSONObject = await Promise.all(responses.map(response => response.json()));


            // Filter data based on category property
            const filteredDataArray = geoJSONObject.features.map((jsonData, index) => {
                if (jsonData[0]?.hasOwnProperty('category')) {
                    return jsonData.filter(item => (item.category === 'Elementary School') || (item.name.includes('Elementary')) );
                } else {
                    return jsonData;
                }
            });

            // Your code to place the data on the map
            filteredDataArray.forEach(async (jsonData, index) => {
                const sourceId = `iso-${index}`;
                const layerId = `isoLayer-${index}`;
                const colors = ['#0A7B83', '#F19C65', '#2AA876', '#FFD265', '#CE4D45'];

                map.addSource(sourceId, {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [],
                    },
                });

                map.addLayer(
                    {
                        id: layerId,
                        type: 'fill',
                        source: sourceId,
                        layout: {},
                        paint: {
                            'fill-color': colors[index],
                            'fill-opacity': 0.3,
                        },
                    },
                    'poi-label'
                );

                const isoFeatures = await isochroneFromGeoJSON({
                    data: jsonData,
                    minutes: 10,
                    profile: 'walking',
                    urlBase: 'https://api.mapbox.com/isochrone/v1/mapbox/',
                });

                map.getSource(sourceId).setData({
                    type: 'FeatureCollection',
                    features: isoFeatures,
                });
            });
        } catch (error) {
            console.error('Error fetching or processing JSON:', error);
        }
    })();
});
