const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;
const timeout = 500;

app.get('/numbers', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'Please provide at least one URL' });
        }

        const urls = Array.isArray(url) ? url : [url]; 

        const fetchPromises = urls.map(async url => {
            try {
                const response = await axios.get(url, { timeout });
                return response.data;
            } catch (error) {
                console.error(`Error fetching from ${url}:`, error.message);
                return [];
            }
        });

        const results = await Promise.all(fetchPromises);

        const combinedNumbers = Array.from(new Set(results.flat()));

      
        combinedNumbers.sort((a, b) => a - b);

        res.json({ numbers: combinedNumbers });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`number-management-service is running on port ${port}`);
});
