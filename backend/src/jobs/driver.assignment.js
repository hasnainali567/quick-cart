import { Queue, Worker } from "bullmq";

const driverQueue = new Queue('driver-assignment-queue', {
    connection : {
        host : "localhost",
        port : 6379
    },
    defaultJobOptions : {
        attempts : 2
    }
})

driverQueue.add('driver-assignment-queue', {orderId : "12344", orderTotal : '560'})

const worker = new Worker('driver-assignment-queue', (job) => {
    console.log(job.data);
    throw new Error('job failed')
}, {
    connection : {
        host : "localhost",
        port : 6379
    }
})