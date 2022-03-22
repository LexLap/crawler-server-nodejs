const redisClient = require('../db/redis');

const getPhotosFromRedis = async (req, res, next) => {
    try {
        const photos = await redisClient.getAsync("search:" + req.params.searchValue);
        console.log("search:" + req.params.searchValue);
        if (photos) {
            console.log("redis");
            // res.send(JSON.parse(photos));
            res.send(photos);
        }
        else next();
    } catch (err) {
        console.log(err);
    }
};


module.exports = {
    getPhotosFromRedis
};