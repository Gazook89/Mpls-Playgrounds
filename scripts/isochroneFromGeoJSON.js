// Load environment variables from .env file
const MAPBOX_API_TOKEN = process.env.MAPBOX_API_TOKEN;



// setup api query
async function isochroneFromGeoJSON(object) {
    let isoFeatures = [];
    console.log(object);
    await Promise.all(
        object.data.map(async (point) => {
            const coordinates = point.geojson.geometry.coordinates;
            const response = await fetch(`${object.urlBase}${object.profile}/${coordinates[0]},${coordinates[1]}?contours_minutes=${object.minutes}&polygons=true&access_token=${MAPBOX_API_TOKEN}`);
            const data = await response.json();
            isoFeatures.push(...data.features);
        })
    );

    return isoFeatures;
}

module.exports = isochroneFromGeoJSON;
