const express = require('express');
const { createQueue, sendMessageToQueue, pollMessages, deleteQueue } = require('../middleware/sqs');

const router = new express.Router();

router.post('/create-queue', createQueue, (req, res) => {
    res.send({
        queueUrl: req.queueUrl
    });
});

router.post("/send-message", sendMessageToQueue, (req, res) => {
    res.send({
        messageId: req.messageId
    });
});

router.get("/poll-messages", pollMessages, (req, res) => {
    res.send(req.messages);
});

router.delete("/delete-queue", deleteQueue, (req, res) => {
    res.send();
});

module.exports = router;