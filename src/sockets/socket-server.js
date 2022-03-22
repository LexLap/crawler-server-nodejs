const express = require('express');
const { onlineWorkers, onlineClients, onlineTasks } = require('../engine/onlne-data');
const { createQueue } = require('../middleware/sqs');
const CrawlingTask = require('../models/crawl-task-model');

const app = express()
app.use(express.json())
const server = require('http').createServer(app);



const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["*"],
      allowedHeaders: ["*"],
      credentials: true
    }
});

io.on('connection', (socket) => {
    // console.log('New WebSocket connected:', socket.id)
    socket.on('worker-join', () =>{
        onlineWorkers.push(socket.id)
        socket.join('workers')
        console.log('New worker connected:', socket.id)
    })

    socket.on('client-join', () =>{
        onlineClients.push(socket.id)
        console.log('New client connected:', socket.id)
    })
    
    socket.on('new-task', async (data) =>{
        console.log('New task received')
        data.initiator = socket.id
        data.queueUrl = await createQueue(data)
        const newCrawlerTask = new CrawlingTask(data)
        onlineTasks.push(newCrawlerTask)
        io.to(onlineWorkers[0]).emit('new-task', newCrawlerTask)
    })

    socket.on('page-data', async (data) =>{

        let index = onlineTasks.findIndex((task) => task.queueUrl == data.task.queueUrl)
        
        if (index !== -1) {
            const maxDepth = onlineTasks[index].maxDepth
            const maxTotalPages = onlineTasks[index].maxTotalPages

            if(onlineTasks[index].currentDepth === 0){
                onlineTasks[index].data.title = data.scrappedData.title
                onlineTasks[index].currentDepth = 1
            }else{

            }


            while(onlineTasks[index].data.childPages.length < maxTotalPages && data.scrappedData.childPages.length > 0)
                onlineTasks[index].data.childPages.push(data.scrappedData.childPages.shift())
                
            // console.log(onlineTasks[index])

            io.to(data.task.initiator).emit('visual-data', onlineTasks[index].data)

            // based on some logic, if task not completed send signal to all workers
            let levelClear = true
            while(levelClear && onlineTasks[index].currentDepth <= maxDepth){

                onlineTasks[index].data.childPages.map((page)=>{
                    if(page.url == data.scrappedData.url || page.url == data.scrappedData.url + '/') 
                        page.title = data.scrappedData.title
                    console.log(page.depth, onlineTasks[index].currentDepth)
                    if(page.depth == onlineTasks[index].currentDepth)
                        if(!page.title){
                            levelClear = false
                            // console.log(page.url, '~', page.depth)
                        }
                })

                if(levelClear) onlineTasks[index].currentDepth ++
                else {
                    io.to('workers').emit('task-update', onlineTasks[index])
                }
                // console.log(onlineTasks[index].currentDepth)
            }

            
        }
    })



    socket.on('disconnect', () => {
        let index = onlineWorkers.findIndex((worker) => worker == socket.id)
        if (index !== -1) {
            console.log('Worker disconnected')
            onlineWorkers.splice(index, 1)[0]
            return
        }   
        index = onlineClients.findIndex((client) => client == socket.id)
        if (index !== -1) {
            console.log('Client disconnected')
            onlineClients.splice(index, 1)[0]
            return
        }     
    })
})

module.exports = {
    app,
    server,
    io
}