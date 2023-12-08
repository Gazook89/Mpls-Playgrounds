const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();



const MAPBOX_API_TOKEN = process.env.MAPBOX_API_TOKEN;

async function geocodeAddresses(locationsData) {
  const geojsonData = [];

  for (const location of locationsData) {
    const mapboxApiEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location.address)}.json?access_token=${MAPBOX_API_TOKEN}`;

    try {
      const response = await fetch(mapboxApiEndpoint);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const geojson = data.features[0];
        geojsonData.push({ name: location.name, address: location.address, url: location.url, geojson });
      }
    } catch (error) {
      console.error(`Error geocoding address for ${location.name}: ${error.message}`);
    }
  }

  return geojsonData;
}

(async () => {
  const locationsData = await getLocationData();
  const geojsonData = await geocodeAddresses(locationsData);

  // Write the geojsonData to a JSON file
  fs.writeFileSync('mprb-output.json', JSON.stringify(geojsonData, null, 2));

  console.log('Data has been written to output.json');
})();
