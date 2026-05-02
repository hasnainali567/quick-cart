import prisma from "../../../lib/prisma.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from '../../../utils/apiResponse.js'
import slugify from 'slugify'
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";
import { deleteFromCloudinary, uploadToCloudinaryMultiple } from "../../../utils/cloudinary.js";
import { generateSkuCode, getPagination } from "../../helpers.js";

export const acceptOrder = asynHandler(async (req, res) => {
    const { orderId } = req.params
    const order = await prisma.order.findUnique({
        where: { id: orderId },
    })

    if (!order) {
        throw new NotFoundError('Order not found')
    }

    if (order.status !== 'PENDING') {
        throw new BadRequestError('Only pending orders can be accepted')
    }

    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
    })

    //accect http code is 
    return new ApiResponse(200, updatedOrder, 'Order accepted successfully').send(res)
})

export const markOrderPrepared = asynHandler(async (req, res) => {
    const { orderId } = req.params

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true }
    })

    if (!order) {
        throw new NotFoundError('Order not found')
    }

    if (order.status !== 'CONFIRMED') {
        throw new BadRequestError('Only confirmed orders can be marked as prepared')
    }

    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PREPARED' },
    })

    return new ApiResponse(200, updatedOrder, 'Order marked as prepared successfully').send(res)
})

export const rejectOrder = asynHandler(async (req, res) => {
    const { orderId } = req.params
    const order = await prisma.order.findUnique({
        where: { id: orderId },
    })

    if (!order) {
        throw new NotFoundError('Order not found')
    }

    if (order.status !== 'PENDING') {
        throw new BadRequestError('Only pending orders can be rejected')
    }

    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'REJECTED' },
    })

    return new ApiResponse(200, updatedOrder, 'Order rejected').send(res)
})

export const askDriverToPickup = asynHandler(async (req, res) => {
    const { orderId, driverId } = req.params
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true }
    })

    if (!order) {
        throw new NotFoundError('Order not found')
    }

    if (order.status !== 'PREPARED') {
        throw new BadRequestError('Only prepared orders can be sent for pickup')
    }

    const driver = await prisma.driver.findUnique({
        where: { id: driverId },
        select: { id: true, status: true }
    })

    if (!driver) {
        throw new NotFoundError('Driver not found')
    }

    if (driver.status !== 'ONLINE') {
        throw new BadRequestError('Driver is not available for pickup')
    }

    //todo : notify the driver about the pickup request and wait for their response before updating the order status

    return new ApiResponse(200, updatedOrder, 'Driver notified for pickup').send(res)
})

export const getOrders = asynHandler(async (req, res) => {
    const { storeId } = req.params
    const { page, limit } = getPagination(req.query)

    const orders = await prisma.order.findMany({
        where: { storeId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            name: true,
                            price: true,
                        }

                    }
                }
            },
            customer: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                }
            }
        }
    })

    const totalOrders = await prisma.order.count({
        where: { storeId },
    })

    const hasNextPage = page * limit < totalOrders
    return new ApiResponse(200, { orders, total: totalOrders }, 'Orders retrieved successfully').send(res)
})