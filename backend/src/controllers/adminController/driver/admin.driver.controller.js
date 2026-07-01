import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { NotFoundError } from "../../../utils/errors.js";
import { buildPagination, getPagination, getSuccessMessage, getNotFoundMessage } from "../../helpers.js";


export const getAllDrivers = asynHandler(async (req, res) => {
    const { query } = req;
    const { skip, take } = getPagination(query);
    const { status, approvalStatus, search } = query;

    const where = {
        ...(status && { status }),
        ...(approvalStatus && { approvalStatus }),
        ...(search && {
            user: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ]
            }
        })
    };

    const totalDocs = await prisma.driver.count({ where });

    const drivers = await prisma.driver.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            userId: true,
            status: true,
            approvalStatus: true,
            vehicleType: true,
            vehicleName: true,
            vehicleNumber: true,
            totalDeliveries: true,
            avgRating: true,
            totalEarnings: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    id: true,
                    email: true,
                    image: true,
                    phone: true
                }
            },
        }
    })

    const pagination = buildPagination(totalDocs, skip, take);

    return new ApiResponse(200, { docs: drivers, ...pagination }, getSuccessMessage('drivers')).send(res);
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
        data: { approvalStatus: 'APPROVED' },
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

    // check if driver already approved first if yes then throw you cant reject approved driver instead suspend

    const checkForstatus = await prisma.driver.findUnique({
        where: { id },
        select: { approvalStatus: true }
    })

    if (checkForstatus.approvalStatus === 'APPROVED') {
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
