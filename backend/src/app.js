import express from 'express'
import { corsMiddleware } from './middlewares/cors.middleware.js'
import { requestLogger } from './middlewares/requestLogger.middleware.js'
import { notFoundHandler } from './middlewares/notFound.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'
import router from './routes/routes.js'
import cookieParser from 'cookie-parser'

const app = express()


    
app.use(corsMiddleware)
app.use(requestLogger)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
