import prisma from '../../../lib/prisma.js'
import ApiResponse from '../../../utils/apiResponse.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { NotFoundError } from '../../../utils/errors.js'
import { deleteFromCloudinary, uploadToCloudinary } from '../../../utils/cloudinary.js'

export const getMe = asyncHandler(async (req, res) => {
    const user = req.user;

    return new ApiResponse(200, user, 'User profile retrieved successfully').send(res)
})

export const updateMe = asyncHandler(async (req, res) => {
    const { name, phone } = req.body
    const { id } = req.params

    if (!name && !phone) {
        return res.status(400).json({ message: 'At least one of name or phone must be provided' })
    }
    const user = req.user;

    if (user.id !== id) {
        return new ApiResponse(403, null, 'Forbidden').send(res)
    }

    const result = await prisma.user.update({
        where: { id: user.id },
        data: { name, phone },
    })

    if (!result) {
        return new NotFoundError('User not found').send(res)
    }

    return new ApiResponse(200, result, 'User updated successfully').send(res)
})

export const updateAvatar = asyncHandler(async (req, res) => {
    const avatar = req.file;
    const { id } = req.user;

    if (!avatar) {
        return new ApiResponse(400, null, 'No avatar file uploaded').send(res)
    }

    const user = await prisma.user.findUnique({
        where: { id }
    })

    const oldImage = user?.image ? user?.publicId : null;

    const result = await uploadToCloudinary(avatar)
    //todo : delete old avatar file from cloudinary if exists
    //todo : upload new avatar file to cloudinary and save url to database instead of local uploads folder

    const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: { image: result.secureUrl, publicId: result.publicId },
    });

    if (oldImage) {
        try {
            await deleteFromCloudinary(oldImage);
        } catch (error) {
            console.log('Failed to delete profile image with id : ', oldImage)
        }
    }

    return new ApiResponse(200, updated, 'Avatar updated successfully').send(res)
})

export const getUserReviews = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = req.user;

    if (user.id !== id) {
        return new ApiResponse(403, null, 'Forbidden').send(res)
    }
    const reviews = await prisma.review.findMany({
        where: { userId: id },
        include: {
            product: true,
            user: true
        }
    })
    return new ApiResponse(200, reviews, 'Reviews retrieved successfully').send(res)
})

export const getUserNotifications = asyncHandler(async (req, res) => {
    const {id} = req.user;

    const notifications = await prisma.notification.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' }
    })
    return new ApiResponse(200, notifications, 'Notifications retrieved successfully').send(res)
})