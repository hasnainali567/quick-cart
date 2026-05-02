import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../lib/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js'
import prisma from '../lib/prisma.js'

const resolveSession = async (req) => {
    return auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    })
}

export const optionalAuth = asyncHandler(async (req, res, next) => {
    const session = await resolveSession(req)

    req.auth = session || null
    req.user = session?.user || null
    req.session = session?.session || null

    next()
})

export const requireAuth = asyncHandler(async (req, res, next) => {
    const session = await resolveSession(req)

    if (!session?.user) {
        throw new UnauthorizedError('Authentication required')
    }

    req.user = session.user
    req.session = session.session

    next()
})

export const requireAuthWithactiveOrder = asyncHandler(async (req, res, next) => {
    const session = await resolveSession(req)

    if (!session?.user) {
        throw new UnauthorizedError('Authentication required')
    }

    //todo turn on this 
    // if (session.user?.role !== 'CUSTOMER') {
    //     throw new ForbiddenError('This route is only accessible to customers')
    // }

    const activeOrder = await prisma.order.findFirst({
        where: {
            customerId: session.user.id,
            status: { notIn: ['DELIVERED', 'CANCELLED', 'REJECTED'] }
        },
        select: { id: true, status: true },
        orderBy: { createdAt: 'desc' }
    })

    req.activeOrder = activeOrder
    req.user = { ...session.user, activeOrder }
    req.session = session.session
    next()
})


export const allowRoles = (...roles) => {
    const allowedRoles = roles
        .flat()
        .filter(Boolean)
        .map((role) => String(role).toUpperCase())

    return (req, res, next) => {
        const role = req.user?.role

        if (!req.user) {
            throw new UnauthorizedError('Authentication required')
        }

        if (!role || !allowedRoles.includes(String(role).toUpperCase())) {
            throw new ForbiddenError('You do not have permission to perform this action')
        }

        next()
    }
}

export const alloweROles = allowRoles
