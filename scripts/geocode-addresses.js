const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();

const MAPBOX_API_TOKEN = process.env.MAPBOX_API_TOKEN;
const OUTPUT_FILE = 'data/geoJSON-test-output.json';

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

async function runScript(filePath) {
  try {
	// Read the JSON file
	console.log(`Opening ${filePath}...`)
	const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

	// Check if the JSON data is an array
	if (!Array.isArray(jsonData)) {
	  console.error('The JSON file should contain an array of locations.');
	  process.exit(1);
	} else {
		console.log(`Looks good.  Sending to Mapbox...`)
	}

	const geojsonData = await geocodeAddresses(jsonData);

	console.log(`${geojsonData.length} locations returned.`)

	// Write the geojsonData to a JSON file
	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(geojsonData, null, 2));

	console.log(`Data has been written to ${OUTPUT_FILE}`);
  } catch (error) {
	console.error(`Error reading or processing the JSON file: ${error.message}`);
	process.exit(1);
  }
}

// Check if an argument is provided
if (process.argv.length < 3) {
  console.error('Please provide a file path to the JSON file.');
  process.exit(1);
}

// Get the argument from the command line
const filePath = process.argv[2];

// Run the script with the provided argument (file path)
runScript(filePath);
