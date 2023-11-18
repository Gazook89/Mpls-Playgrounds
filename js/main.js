mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F6b29rODkiLCJhIjoiY2xvejlteGMxMGEzYjJvbGV5NXRiNHBkZSJ9.Tuqh-azZda6b4Tb0bYDrIw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-93.20847, 44.94299],
    zoom: 12
});

// isochrone
const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
const lon = -93.20847;
const lat = 44.94299;
const profile = 'walking';
const minutes = 10;

// setup api query
async function getIso() {
    const query = await fetch(
        `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const data = await query.json();
    
    map.getSource('iso').setData(data);
}

// create a marker for the center of the isochrone polygon (chosen origin)
const marker = new mapboxgl.Marker({
    color: '#314ccd'
});
const lngLat = {
    lon: lon,
    lat: lat
};
marker.setLngLat(lngLat).addTo(map);


// add data source and layers to map.
map.on('load', ()=>{
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
    )
    getIso();
})