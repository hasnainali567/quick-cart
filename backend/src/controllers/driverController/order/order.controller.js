import prisma from "../../../lib/prisma.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from '../../../utils/apiResponse.js'
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";
import { notify } from "../../../utils/notify.js";

// Driver accepts delivery request
export const acceptDelivery = asynHandler(async (req, res) => {
    const { orderId } = req.params;

    const driver = await prisma.driver.findUnique({
        where: { userId: req.user.id },
        select: { id: true, user: { select: { name: true, id: true } } }
    })

    if (!driver) throw new NotFoundError('Driver profile not found')

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, status: true, driverId: true, customerId: true }
    })

    if (!order) throw new NotFoundError('Order not found')

    if (order.status !== 'PREPARED') {
        throw new BadRequestError('Order is not available for delivery')
    }

    if (order.driverId) {
        throw new BadRequestError('Order already has a driver assigned')
    }

    const delivery = await prisma.$transaction(async (tx) => {

        await tx.orderStatusHistory.createMany({
            data: [{
                orderId: order.id,
                status: 'DRIVER_ASSIGNED',
                note: `Driver ${driver.user.name} assigned to order`,
                createdAt: new Date()
            },
            {
                orderId: order.id,
                status: 'HEADING_TO_STORE',
                note: `Driver ${driver.user.name} is heading to the store`,
                createdAt: new Date() + 2000
            }
            ]
        })
        // Assign driver to order
        await tx.order.update({
            where: { id: orderId },
            data: { driverId: driver.id, status: "HEADING_TO_STORE" }
        })

        // Create delivery record
        const delivery = await tx.delivery.create({
            data: {
                orderId,
                driverId: driver.id,
                acceptedAt: new Date()
            },
            select: {
                id: true,
                driverId: true,
                order: {
                    select: {
                        statusHistory: {
                            select: {
                                status: true,
                                note: true,
                                createdAt: true
                            }
                        }
                    }
                }
            }
        })

        await tx.driver.update({
            where: { id: driver.id },
            data: { status: 'ON_DELIVERY' }
        })

        return delivery
    })

    //todo: notify customer — driver assigned + heading to store

    // notify({userId : order.customerId, data: { title: 'Driver Assigned 🚴', body: `Driver ${driver.user.name} is heading to the store` }})

    return res.json(new ApiResponse(200, delivery, 'Delivery accepted successfully'))
})

// Driver rejects delivery request — find next driver
export const rejectDelivery = asynHandler(async (req, res) => {
    const { orderId } = req.params

    const driver = await prisma.driver.findUnique({
        where: { userId: req.user.id },
        select: { id: true }
    })

    if (!driver) throw new NotFoundError('Driver profile not found')

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, status: true, driverId: true, customerId: true }
    })

    if (!order) throw new NotFoundError('Order not found')
    if (order.status !== 'PREPARED') {
        throw new BadRequestError('Cannot reject order at this stage')
    }

    // TODO: notify store + customer — driver rejected, finding another driver

    return res.json(new ApiResponse(200, null, 'Delivery rejected — finding another driver'))
})

// Driver picked up order from store
export const pickedUpOrder = asynHandler(async (req, res) => {
    const { orderId } = req.params

    const driver = await prisma.driver.findUnique({
        where: { userId: req.user.id },
        select: {
            id: true,
            user: {
                select: {
                    name: true
                }
            }
        }
    })

    if (!driver) throw new NotFoundError('Driver profile not found')

    const delivery = await prisma.delivery.findUnique({
        where: { orderId },
        select: { id: true, status: true, driverId: true }
    })

    if (!delivery) throw new NotFoundError('Delivery not found')

    if (delivery.driverId !== driver.id) {
        throw new BadRequestError('Not your delivery')
    }

    if (delivery.status !== 'HEADING_TO_STORE') {
        throw new BadRequestError('Invalid status transition')
    }

    const result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
            where: { id: orderId },
            data: {
                status: 'PICKED_UP',
                pickedUpAt: new Date()
            },
            select: { id: true, status: true }
        })

        await tx.orderStatusHistory.createMany({
            data: [{
                orderId: order.id,
                status: 'PICKED_UP',
                note: `Driver ${driver.user.name} picked up the order from the store`,
                createdAt: new Date()
            }, {
                orderId: order.id,
                status: 'OUT_FOR_DELIVERY',
                note: `Driver ${driver.user.name} is out for delivery`,
                createdAt: new Date() + 2000
            }]
        })

        const delivery = await tx.delivery.update({
            where: { orderId },
            data: {
                pickedUpAt: new Date()
            },
            select: {
                id: true, status: true, order: {
                    select: {
                        statusHistory: {
                            select: {
                                status: true,
                                note: true,
                                createdAt: true
                            }
                        }
                    }
                }
            }
        })

        return delivery
    })

    //todo notify customer — order picked up, out for delivery
    // notify({userId : order.customerId, data: { title: 'Order Picked Up 🚴', body: `Your order is on the way!` }})

    return res.json(new ApiResponse(200, result, 'Order picked up — out for delivery'))
})

// Driver delivered order to customer
export const deliveredOrder = asynHandler(async (req, res) => {
    const { orderId } = req.params
    const [driver, delivery, order] = await Promise.all([
        prisma.driver.findUnique({
            where: { userId: req.user.id },
            select: { id: true, user: { select: { name: true } } }
        }),
        prisma.delivery.findUnique({
            where: { orderId },
            select: { id: true, status: true, driverId: true, assignedAt: true }
        }),
        prisma.order.findUnique({
            where: { id: orderId },
            select: { id: true, status: true, total: true }
        })
    ])

    //is this transaction good here coz we was fetching in three separate queries? or should we move all inside transaction block? answer

    if (!driver) throw new NotFoundError('Driver profile not found')

    if (!delivery) throw new NotFoundError('Delivery not found')

    if (delivery.driverId !== driver.id) {
        throw new BadRequestError('Not your delivery')
    }

    if (order.status !== 'OUT_FOR_DELIVERY') {
        throw new BadRequestError('Invalid status transition')
    }

    // Calculate duration
    const durationMins = Math.round(
        (new Date() - new Date(delivery.assignedAt)) / 60000
    )

    const result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
            where: { id: orderId },
            data: {
                status: 'DELIVERED',
                deliveredAt: new Date()
            },
            select: { id: true, status: true, total: true }
        })

        await tx.orderStatusHistory.create({
            data: {
                orderId: order.id,
                status: 'DELIVERED',
                note: `Driver ${driver.user.name} delivered the order to the customer`,
                createdAt: new Date()
            }
        })

        const delivery = await tx.delivery.update({
            where: { orderId },
            data: {
                deliveredAt: new Date(),
                durationMins
            },
            select: {
                id: true,
                status: true,
                order: {
                    select: {
                        statusHistory: {
                            select: {
                                status: true,
                                note: true,
                                createdAt: true
                            }
                        }
                    }
                }
            }
        })

        // Update driver stats
        await tx.driver.update({
            where: { id: driver.id },
            data: {
                totalDeliveries: { increment: 1 },
                status: 'ONLINE' // available again
            }
        })

        return { ...order, deliveryStatus: delivery.status }
    })

    // TODO: BullMQ job → create DriverEarning + Commission records
    // TODO: Socket.IO → notify customer order delivered

    return res.json(new ApiResponse(200, result, 'Order delivered successfully'))
})