import prisma from './prisma.js'

const connectDb = async () => {
    try {
        await prisma.$connect()
        console.log('database connected')
    } catch (error) {
        console.log('unable to connect db', error)
        throw error
    }
}

export default connectDb