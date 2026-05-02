import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { NotFoundError } from "../../../utils/errors.js";
import { getPagination, getSuccessMessage, getNotFoundMessage } from "../../helpers.js";


export const getAllDrivers = asynHandler(async (req, res) => {
    const { query } = req;
    const { skip, take } = getPagination(query);
    const { status, approvalStatus } = query;

    const drivers = await prisma.driver.findMany({
        where: {
            ...(status && { status }),
            ...(approvalStatus && { approvalStatus })
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            user: {
                select: {
                    name: true,
                    id: true,
                    email: true,
                    image: true,
                    phone: true
                }
            },
            status: true,
            approvalStatus: true
        }
    })

    return new ApiResponse(200, drivers, getSuccessMessage('drivers')).send(res);
})

export const getDriverById = asynHandler(async (req, res) => {
    const { id } = req.params;

    const driver = await prisma.driver.findUnique({
        where: { id },
    })

    if (!driver) {
        throw new NotFoundError(getNotFoundMessage('driver'))

    }

    return new ApiResponse(200, driver, getSuccessMessage('driver')).send(res);
})

export const approveDriver = asynHandler(async (req, res) => {
    const { id } = req.params;

    const driver = await prisma.driver.update({
        where: { id },
        data: { status: 'APPROVED' },
        select: {
            id: true,
            approvalStatus: true
        }
    })

    if (!driver) {
        throw new NotFoundError(getNotFoundMessage('driver'))
    }

    return new ApiResponse(200, driver, getSuccessMessage('driver approved')).send(res);
})

export const rejectDriver = asynHandler(async (req, res) => {
    const { id } = req.params;

    // check if driver already approved first if yes then throw you cant reject appreved driver intead suspend

    const checkForstatus = await prisma.driver.findUnique({
        where: { id },
        select: { status: true }
    })

    if (checkForstatus.status === 'APPROVED') {
        return new ApiResponse(400, null, 'You cant reject approved driver instead suspend').send(res)
    }

    const driver = await prisma.driver.update({
        where: { id },
        data: {
            approvalStatus: 'REJECTED'
        },
        select: {
            id: true,
            approvalStatus: true
        }
    })

    if (!driver) {
        throw new NotFoundError(getNotFoundMessage('driver'));
    }

    return new ApiResponse(200, driver, getSuccessMessage('driver rejected')).send(res);
})

export const suspendDriver = asynHandler(async (req, res) => {
    const { id } = req.params;

    const driver = await prisma.driver.update({
        where: { id },
        data: {
            approvalStatus: 'SUSPENDED'
        },
        select: {
            id: true,
            approvalStatus: true
        }
    })

    if (!driver) {
        throw new NotFoundError(getNotFoundMessage('driver'));
    }

    return new ApiResponse(200, driver, getSuccessMessage('driver suspended')).send(res);
})
