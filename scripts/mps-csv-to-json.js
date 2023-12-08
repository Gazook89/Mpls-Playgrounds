// const fs = require('fs');
// const csv = require('csv-parser');

// const csvFilePath = 'MPS-Properties-Full-List.csv';
// const jsonArray = [];

// fs.createReadStream(csvFilePath)
//     .pipe(csv())
//     .on('headers', (headers) => {
//         // Assuming the first row contains column headers
//         // Do nothing here, as we'll use headers from the 'data' event
//     })
//     .on('data', (row) => {
//         const row_data = {};
//         for (const header in row) {
//             row_data[header] = row[header];
//         }
//         jsonArray.push(row_data);
//     })
//     .on('end', () => {
//         fs.writeFileSync('mps-properties-output.json', JSON.stringify(jsonArray, null, 2));
//     });

const { google } = require('googleapis');
const fs = require('fs');

const spreadsheetId = '1s2ftbM7Bj5806vNdltHM5sIboBqBw4s-ujJB2Em6xPA';
const range = 'Full List!A1:F75';
const apiKeyOrServiceAccountKeyPath = process.env.GOOGLE_SHEETS_KEY_PATH;

const sheetsApi = google.sheets({
    version: 'v4',
    auth: apiKeyOrServiceAccountKeyPath
        ? require(apiKeyOrServiceAccountKeyPath)
        : undefined,
});

sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range,
}, async (err, res) => {
    if (err) {
        console.error(`Error reading Google Sheets: ${err}`);
        return;
    }

    const rows = res.data.values;

    if (rows.length) {
        const headers = rows[0];
        const jsonArray = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const row_data = {};

            for (let j = 0; j < headers.length; j++) {
                row_data[headers[j]] = row[j];
            }

            jsonArray.push(row_data);
        }

        // Write jsonArray to a JSON file
        const jsonFilePath = 'output.json';
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));

        console.log(`JSON file created: ${jsonFilePath}`);
    } else {
        console.log('No data found.');
    }
});
