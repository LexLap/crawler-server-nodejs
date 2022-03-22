const CrawlingTask = require("../models/crawl-task-model");


const newCrawler = async (req) => {
    const newTask = new CrawlingTask(req.body)
    return newTask
}


module.exports = newCrawler