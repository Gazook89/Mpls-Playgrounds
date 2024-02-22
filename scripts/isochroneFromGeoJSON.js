// Load environment variables from .env file
const MAPBOX_API_TOKEN = process.env.MAPBOX_API_TOKEN;

const turf = require('@turf/turf');

// setup api query
async function isochroneFromGeoJSON(object) {
    let isoFeatures = [];
    await Promise.all(
        object.data.map(async (point, index) => { // Added index parameter
            let coordinates;
            if (Array.isArray(point.geometry.coordinates[0])) {
                console.log(point)
                coordinates = turf.centerOfMass(point.geometry).geometry.coordinates;
            } else {
                coordinates = point.geometry.coordinates;
            }
            console.log(coordinates)
            try {
                const response = await fetch(`${object.urlBase}${object.profile}/${coordinates[0]},${coordinates[1]}?contours_minutes=${object.minutes}&polygons=true&access_token=${MAPBOX_API_TOKEN}`);
                const data = await response.json();
                isoFeatures.push(...data.features);
            } catch (error) {
                console.error(`An error occurred for item at index ${index}:`, error); // Log index and error
            }
        })
    );

    return isoFeatures;
}


module.exports = isochroneFromGeoJSON;
