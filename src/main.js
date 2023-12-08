

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F6b29rODkiLCJhIjoiY2xvejlteGMxMGEzYjJvbGV5NXRiNHBkZSJ9.Tuqh-azZda6b4Tb0bYDrIw';


// setup the basic map layer.
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-93.2662673, 44.9771477],
    zoom: 11
});


// isochrone
const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
const profile = 'walking';
const minutes = 10;

// setup api query
async function getIso(points) {
    let isoFeatures = [];

    const promises = points.features.map(async (point) => {
        const coordinates = point.geojson.geometry.coordinates;
        const response = await fetch(`${urlBase}${profile}/${coordinates[0]},${coordinates[1]}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`);
        const data = await response.json();
        isoFeatures.push(...data.features);
    });

    await Promise.all(promises);

    map.getSource('iso').setData({
        type: "FeatureCollection",
        features: isoFeatures
    });

    // const jsonOutput = {
    //     type: "FeatureCollection",
    //     features: isoFeatures
    // };

    // const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json' });

    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'isochrone-data.json';
    // link.click();
}

// add data source and layers to map
map.on('load', async () => {

    // Fetch the JSON data
    fetch('./mprb-output.json')
    .then(response => response.json())
    .then(data => {
        // Use the loaded JSON data
        console.log(data);

        // Your code to place the data on the map
        // For example, iterate through the data and add markers to the map
        map.addSource('iso', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        });

        map.addLayer(
            {
                id: 'isoLayer',
                type: 'fill',
                source: 'iso',
                layout: {},
                paint: {
                    'fill-color': '#5a3fc0',
                    'fill-opacity': 0.3
                }
            },
            'poi-label'
        );

        getIso(data);
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

});

