const express = require('express');
const redisClient = require('../db/redis');
const { getPhotosFromRedis } = require('../middleware/redis');
const fetchPhotos = require('../utils/flickrFetcher');

const router = new express.Router();

router.get('/search-photos/:searchValue', getPhotosFromRedis, async (req, res) => {
    const searchValue = req.params.searchValue;
    try {
        req.photos = await fetchPhotos(searchValue);
        if (req.photos.length > 0) {
            redisClient.setexAsync(
                "search:" + searchValue,
                300,
                JSON.stringify(req.photos)
            );
        }

        res.send(req.photos);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/get-search-suggestions/:searchValue', async (req, res) => {
    const searchValue = req.params.searchValue;
    try {
        let suggestions = await redisClient.keysAsync("search:*" + searchValue + "*");

        suggestions = suggestions ? suggestions.map(suggestion => suggestion.split(":")[1]) : [];
        console.log(suggestions);
        res.send(suggestions);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;