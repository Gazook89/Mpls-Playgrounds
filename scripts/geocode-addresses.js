const fetch = require('node-fetch');
require('dotenv').config();

const MAPBOX_API_TOKEN = process.env.MAPBOX_API_TOKEN;

async function geocodeAddresses(locationsData) {
  const featuresArray = [];

  for (const location of locationsData) {
	const mapboxApiEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location.address)}.json?access_token=${MAPBOX_API_TOKEN}`;

	try {
	  const response = await fetch(mapboxApiEndpoint);
	  const data = await response.json();

	  if (data.features && data.features.length > 0) {
		const geojson = data.features[0];
		Object.keys(location).forEach(key=>{
			geojson.properties[key] = location[key];
		});
		featuresArray.push(geojson);
	  }
	} catch (error) {
	  console.error(`Error geocoding address for ${location.name}: ${error.message}`);
	}
  }

  return featuresArray;
}

module.exports = geocodeAddresses;