import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import {  NotFoundError,  ValidationError } from "../../../utils/errors.js";
import {  getNotFoundMessage, getSuccessMessage } from "../../helpers.js";


export const getAllUser = asynHandler(async (req, res) => {
    const { take = 10, skip = 0 } = req.query;

    const users = await prisma.user.findMany({
        take,
        skip,
    })

    return new ApiResponse(200, users, getSuccessMessage('users'));
})

export const getUserbyId = asynHandler(async (req, res) => {
    const { id } = req.params;

    const userbyId = await prisma.user.findUnique({
        where: { id }
    })

    if (!userbyId) {
        throw new NotFoundError(getNotFoundMessage('user'))
    }

    return new ApiResponse(200, userbyId, getSuccessMessage('user'))
})

export const suspendUser = asynHandler(async (req, res) => {
    const { id } = req.params;

    const user = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
            where: { id }
        })
        if (!user) {
            throw new NotFoundError(getNotFoundMessage('user'))
        }

        if (user.isSuspended) {
            throw new ValidationError('User is already suspended')
        }

        return await prisma.user.update({
            where: { id },
            data: { isSuspended: true }
        })

    })

    return new ApiResponse(200, user, 'User suspended successfully').send(res)
})
