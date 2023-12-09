// 2023-12-08

// Summary: This script uses Puppeteer to scrape data from a website
// that lists parks and playgrounds in Minneapolis. It extracts
// information about park names, addresses, and URLs, and then
// saves the data to a JSON file.

// This script is ONLY good for scraping the URL below, which is the
// list of MPRB parks WITH a playground amenity.  Right now, this
// result gives 7 pages of search results. If that number changes,
// the TOTAL_PAGES constant should be adjusted.

// In the future, I may try to update this script to work with any
// number of pages, with custom amenity options being chosen via 
// script arguments.

// Import required modules
const puppeteer = require('puppeteer');
const fs = require('fs');
const geocodeAddresses = require('./geocode-addresses');

// Constants
const BASE_URL = 'https://www.minneapolisparks.org/parks-destinations/park__destination_search/?fwp_outdoor_amenity=playground';
const TOTAL_PAGES = 7;
const OUTPUT_FILE = 'data/MPRB-Parks-scrape-results.json';

// Function to retrieve location data using Puppeteer
async function getLocationData() {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Array to store location data
    const locationsData = [];

    // Loop through each page
    for (let currentPage = 1; currentPage <= TOTAL_PAGES; currentPage++) {
        // Construct URL for the current page
        const url = `${BASE_URL}&fwp_paged=${currentPage}`;

        // Navigate to the page
        await page.goto(url, { waitUntil: 'domcontentloaded' });

		console.log(`Opened page ${currentPage}...`);

        // Extract location data from the page using page.evaluate
        const pageLocationsData = await page.evaluate(() => {
            const locations = [];

            // Select all list items containing location information
            const locationItems = document.querySelectorAll('.search-results li');

			console.log(`Found ${locationItems.length} items in search results on this page.`);

            // Loop through each location item
            locationItems.forEach(item => {
                // Extract name, address, and URL from each item
                const nameElement = item.querySelector('h2 > a');
                const name = nameElement ? nameElement.textContent.trim() : '';

                const addressElement = item.querySelector('p');
                const address = addressElement ? addressElement.textContent.trim().replace('\n',' ') : '';

                const urlElement = item.querySelector('h2 a');
                const url = urlElement ? urlElement.getAttribute('href') : '';

                // Push extracted data to the locations array
                locations.push({ name, address, url });
            });

            return locations;
        });

        // Concatenate page-specific location data to the main array
        locationsData.push(...pageLocationsData);

    }


	console.log(`Collected ${locationsData.length} locations across all pages!`)

    // Close the browser
    await browser.close();

    // Return the aggregated location data
    console.log(locationsData)

    const geocodedLocations = geocodeAddresses(locationsData)
    console.log(geocodedLocations)

    return geocodedLocations;
}

// Main execution block (IIFE)
(async () => {
    // Call the function to get location data
    const geocodedLocations = await getLocationData();

    // Write the geojsonData to a JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(geocodedLocations, null, 2));

    // Log a message indicating the successful write
    console.log(`Data has been written to ${OUTPUT_FILE}`);
})();
