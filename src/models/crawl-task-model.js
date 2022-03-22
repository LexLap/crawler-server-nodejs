class CrawlingTask{

    constructor(task){
        this.startUrl = task.startUrl
        this.maxDepth = task.maxDepth
        this.currentDepth = 0
        this.maxTotalPages = task.maxTotalPages
        this.queueUrl = task.queueUrl
        this.initiator = task.initiator
        this.data = {}
        this.data.title =''
        this.data.url = task.startUrl
        this.data.childPages = []
    }
}

module.exports = CrawlingTask