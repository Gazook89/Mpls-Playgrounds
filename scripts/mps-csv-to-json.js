// Date: 2023-12-07
// Description: This script fetches data from a specified Google Sheet using the Google Sheets API,
// converts it to JSON format, and writes the output to a designated JSON file.

// This works with a SPECIFIC Google Sheet, containing a list of MPS properties.
// However, the sheet and range can be changed...essentially it creates a basic array of JSON Bbjects with 
// each header as a property name and each row it's own Object (and the row cells as the Object values).

// Required Libraries
const { google } = require('googleapis');
const fs = require('fs');

// Load environment variables from .env file
require('dotenv').config();

// Access environment variables
const apiKeyOrServiceAccountKeyPath = process.env.GOOGLE_SHEETS_KEY_PATH || '/absolute/path/to/your/keyfile.json';

// Load the service account key JSON file
const keyPath = apiKeyOrServiceAccountKeyPath;
const keyFile = require(keyPath);

// Create an authentication client using the service account key
const authClient = new google.auth.JWT({
    email: keyFile.client_email,
    key: keyFile.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Set the authentication client for the sheets API
const sheetsApi = google.sheets({
    version: 'v4',
    auth: authClient,
});

// Google Sheet and Output Configuration
const spreadsheetId = '1s2ftbM7Bj5806vNdltHM5sIboBqBw4s-ujJB2Em6xPA';
const range = 'Full List!A1:F75';
const OUTPUT_FILE = 'data/MPS-Properties-output.json';

// Fetch data from Google Sheet
sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range,
}, async (err, res) => {
    if (err) {
        console.error(`Error reading Google Sheets: ${err}`);
        return;
    }

    const rows = res.data.values;
    console.log(`${rows.length} rows found. Converting to JSON...`);

    if (rows.length) {
        const headers = rows[0];
        const jsonArray = [];

        // Convert rows to JSON objects
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const row_data = {};

            for (let j = 0; j < headers.length; j++) {
                row_data[headers[j]] = row[j];
            }

            jsonArray.push(row_data);
        }

        // Write jsonArray to a JSON file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jsonArray, null, 2));
        console.log(`Data has been written to ${OUTPUT_FILE}`);
    } else {
        console.log('No data found.');
    }
});
