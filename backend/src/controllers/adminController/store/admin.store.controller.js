import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { NotFoundError } from "../../../utils/errors.js";
import { getNotFoundMessage, getPagination, getSuccessMessage } from "../../helpers.js";

export const getAllStores = asynHandler(async (req, res) => {
    const { take, skip } = getPagination(req.query)

    const stores = await prisma.store.findMany({
        take,
        skip,
        orderBy: { createdAt: 'desc' }
    })

    return new ApiResponse(200, stores, getSuccessMessage('stores')).send(res);
})

export const getStorebyId = asynHandler(async (req, res) => {
    const { id } = req.params;
    const store = await prisma.store.findUnique({
        where: { id }
    })

    if (!store) {
        throw new NotFoundError(getNotFoundMessage('store'))
    }

    return new ApiResponse(200, store, getSuccessMessage('store'))

})

export const verifyStore = asynHandler(async (req, res) => {
    const { id } = req.params;

    const store = await prisma.$transaction(async (tx) => {
        const store = await tx.store.findUnique({
            where: { id }
        })

        if (!store) {
            throw new NotFoundError(getNotFoundMessage('store'))
        }

        return await tx.store.update({
            where: { id: store.id },
            data: {
                isVerified: true
            }
        })
    })


    return new ApiResponse(200, store, 'store Verified successfully').send(res);
})

export const approveStore = asynHandler(async (req, res) => {
    const { id } = req.params;

    const store = await prisma.$transaction(async (tx) => {
        const store = await tx.store.findUnique({
            where: { id }
        })

        if (!store) {
            throw new NotFoundError(getNotFoundMessage('store'))
        }

        const updatedStore = await tx.store.update({
            where: { id: store.id },
            data: {
                partnerStatus: 'APPROVED'
            }
        })

        return updatedStore;
    })

    return new ApiResponse(200, store, 'store Approved successfully').send(res);
})

export const suspendStore = asynHandler(async (req, res) => {
    const { id } = req.params;

    const store = await prisma.$transaction(async (tx) => {
        const store = await tx.store.findUnique({
            where: { id }
        })

        if (!store) {
            throw new NotFoundError(getNotFoundMessage('store'))
        }

        const updatedStore = await tx.store.update({
            where: { id: store.id },
            data: {
                partnerStatus: 'SUSPENDED'
            }
        })

        return updatedStore;
    })

    return new ApiResponse(200, store, 'store Suspended').send(res);
})

export const rejectStore = asynHandler(async (req, res) => {
    const { id } = req.params;
    const { rejectionReason } = req.body

    const store = await prisma.$transaction(async (tx) => {
        const store = await tx.store.findUnique({
            where: { id }
        })

        if (!store) {
            throw new NotFoundError(getNotFoundMessage('store'))
        }

        const updatedStore = await tx.store.update({
            where: { id: store.id },
            data: {
                partnerStatus: 'REJECTED',
                rejectionReason,
            }
        })

        return updatedStore;
    })

    return new ApiResponse(200, store, 'store Rejected').send(res);
})

export const updateStoreCommission = asynHandler(async (req, res) => {
    const { id } = req.params;
    const { commissionPercent = 15 } = req.body

    const store = await prisma.$transaction(async (tx) => {
        const store = await tx.store.findUnique({
            where: { id }
        })

        if (!store) {
            throw new NotFoundError(getNotFoundMessage('store'))
        }

        const updatedStore = await tx.store.update({
            where: { id: store.id },
            data: {
                commissionPercent: parseFloat(commissionPercent)
            }
        })

        return updatedStore;
    })

    return new ApiResponse(200, store, 'store Commission updated successfully').send(res);
})


