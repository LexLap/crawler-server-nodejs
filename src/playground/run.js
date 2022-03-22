const AWS = require('aws-sdk');
const sqs = new AWS.SQS({

    apiVersion: "2012-11-05",
    region: "eu-west-1"
});

const runAsync = async () =>{
    
    try {
        const data = await sqs.createQueue({
            QueueName: 'queue1'
        }).promise();
        // req.queueUrl = data.QueueUrl;
        console.log('queueURL: ', data.QueueUrl)
        next();
    } catch (err) {
        console.log(err);
    }
}


module.exports = {runAsync}
// const { scrapPage } = require("../utils/scrapper");
// scrapPage('https://www.amazon.com').then(result => console.log(result))
