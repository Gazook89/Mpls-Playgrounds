const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'https://www.minneapolisparks.org/parks-destinations/park__destination_search/?fwp_outdoor_amenity=playground';
const TOTAL_PAGES = 7;
const MAPBOX_API_TOKEN = 'pk.eyJ1IjoiZ2F6b29rODkiLCJhIjoiY2xvejlteGMxMGEzYjJvbGV5NXRiNHBkZSJ9.Tuqh-azZda6b4Tb0bYDrIw'; // Replace with your actual Mapbox API token

async function getLocationData(){
    let locationsData;
    fetch('mps-properties-output.json')
    .then(response => response.json())
    .then(data => {
        locationsData.push(data);
    })
    return locationsData;
}



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
  fs.writeFileSync('mps-output.json', JSON.stringify(geojsonData, null, 2));

  console.log('Data has been written to output.json');
})();
