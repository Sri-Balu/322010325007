const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

let cachedTrainData = []; 
const cacheDuration = 60000;

async function fetchAndCacheTrainData() {
    try {
        const response = await axios.get('URL_TO_John_Doe_Railways_API');
        cachedTrainData = response.data.trains;
    } catch (error) {
        console.error(error);
    }
}

async function refreshCachedData() {
    if ((Date.now() - lastFetchTime) > cacheDuration) {
        await fetchAndCacheTrainData();
        lastFetchTime = Date.now();
    }
}

app.get('/trains', async (req, res) => {
    await refreshCachedData();

    try {
        const sortedAndFilteredTrains = cachedTrainData
            .filter(train => {
                return true;
            })
            .sort((a, b) => {
               
                return 0; 
            });

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
