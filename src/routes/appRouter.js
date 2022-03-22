const express = require('express');
const { createQueue } = require('../middleware/sqs');
const { io } = require('../sockets/socket-server');
const router = new express.Router();
const CrawlingTask = require("../models/crawl-task-model");
const { onlineWorkers, onlineTasks } = require('../engine/onlne-data');

router.post('/start-crawling', createQueue, async (req, res) => {
    
    try{
        const newCrawlerTask = new CrawlingTask(req.body)
        onlineTasks.push(newCrawlerTask)
        io.to(onlineWorkers[0]).emit('new-task', newCrawlerTask)
    }catch (err){
        res.send(err.message)
    }
    res.send('Status OK');
});


module.exports = router;