import server from './app.js'
import connectDb from './lib/db.js'
import { env } from './config/env.js'

const startServer = async () => {
    await connectDb()

    server.listen(env.port, () => {
        console.log(`Server is running on port ${env.port}`)
    })
}

startServer()