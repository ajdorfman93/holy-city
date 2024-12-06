// fetchData.js

const fetch = require('node-fetch');
const fs = require('fs');

// The API endpoint
const url = 'https://lakewoodluach.getgrist.com/api/docs/mfG1uWuVC9zw/tables/Times/records';

// Options for the fetch request
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_API_TOKEN', // Uncomment and replace with your token if needed
    }
};

// Function to fetch and save data
async function fetchAndSaveData() {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Save JSON data to a file
        fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                throw err;
            }
            console.log('Data saved to data.json');
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Execute the function
fetchAndSaveData();
