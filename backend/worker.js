import { Worker } from "bullmq";

const messageWorker = new Worker('message-queue', async (job) => {
    console.log('got a job')
    console.log('sending a message to user with userId :', job.data?.userId)

    return await new Promise((res, rej) => {
        setTimeout(() => {
            console.log('message has been sent to user : ', job?.data?.userId)
            res()
        }, 5000);
    })
}, {
    connection: {
        host: 'localhost',
        port: 6379
    }
})
