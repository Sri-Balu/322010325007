const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

let cachedTrainData = []; // Initialize as an empty array
const cacheDuration = 60000; // Cache data for 1 minute

// Fetch train data from API and store in cache
async function fetchAndCacheTrainData() {
    try {
        const response = await axios.get('URL_TO_John_Doe_Railways_API');
        cachedTrainData = response.data.trains; // Assuming the API returns an object with a "trains" array
    } catch (error) {
        console.error(error);
    }
}

// Middleware to refresh cached data
async function refreshCachedData() {
    if ((Date.now() - lastFetchTime) > cacheDuration) {
        await fetchAndCacheTrainData();
        lastFetchTime = Date.now();
    }
}

// Route to get sorted and filtered train information
app.get('/trains', async (req, res) => {
    await refreshCachedData();

    try {
        // Perform sorting and filtering on cachedTrainData
        const sortedAndFilteredTrains = cachedTrainData
            .filter(train => {
                // Apply your filtering logic here
                return true;
            })
            .sort((a, b) => {
                // Implement sorting logic based on price, tickets, departure time
                return 0; // Your sorting logic here
            });

        // Transform the data into the desired response format
        const transformedTrains = sortedAndFilteredTrains.map(train => ({
            name: train.name,
            departureTime: train.departureTime,
            seats: {
                sleeper: train.seats.sleeper,
                AC: train.seats.AC
            },
            prices: {
                sleeper: train.prices.sleeper,
                AC: train.prices.AC
            }
        }));

        res.json({ trains: transformedTrains });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
