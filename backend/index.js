import { Queue } from 'bullmq'

const messageQueue = new Queue('message-queue', {
    connection: {
        host: 'localhost',
        port: 6379
    }
})

const userId = Math.floor(Math.random() * 1000);

console.log(userId);


messageQueue.add('message', {
    message: "hello",
    userId,
})
