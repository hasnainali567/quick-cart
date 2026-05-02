import prisma from '../../../../lib/prisma.js'
import ApiResponse from '../../../../utils/apiResponse.js'
import { asyncHandler } from '../../../../utils/asyncHandler.js'
import { uploadToCloudinary } from '../../../../utils/cloudinary.js'
import { NotFoundError } from '../../../../utils/errors.js'

export const getAddresses = asyncHandler(async (req, res) => {
    const user = req.user;
    const addresses = await prisma.address.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
    })

    return new ApiResponse(200, addresses, 'Addresses retrieved successfully').send(res)
})

export const addAddress = asyncHandler(async (req, res) => {
    const user = req.user;
    const { label = null, fullName, phone, addressLine1, addressLine2 = null, area, city, province, country, latitude = null, longitude = null, isDefault = false, } = req.body

    const address = await prisma.$transaction(async (tx) => {
        if (isDefault) {
            await tx.address.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false }
            })
        }

        const address = await tx.address.create({
            data: {
                userId: user.id,
                label,
                fullName,
                phone,
                addressLine1,
                addressLine2,
                area,
                city,
                province,
                country,
                latitude,
                longitude,
                isDefault
            }
        })
        return address;
    })

    return new ApiResponse(201, address, 'Address added successfully').send(res)

})

export const updateAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const { label, fullName, phone, addressLine2, latitude, longitude, isDefault } = req.body;

    if (isDefault) {
        await prisma.address.updateMany({
            where: { userId: user.id, isDefault: true },
            data: { isDefault: false }
        })
    }

    const address = await prisma.address.update({
        where: {
            id,
            userId: user.id
        },
        data: {
            label,
            fullName,
            phone,
            addressLine2,
            latitude,
            longitude,
            isDefault
        }
    })


    return new ApiResponse(200, address, 'Address updated successfully').send(res)
})

export const deleteAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user

    const address = await prisma.$transaction(async (tx) => {
        const address = await tx.address.findFirst({
            where: { id, userId: user.id }
        })

        if (!address) {
            throw new NotFoundError('Address not found')
        }

        if (address.isDefault) {
            const anotherAddress = await tx.address.findFirst({
                where: {
                    userId: user.id,
                    id: { not: id }
                }
            })
            if (anotherAddress) {
                await tx.address.update({
                    where: { id: anotherAddress.id },
                    data: { isDefault: true }
                })
            }
        }

        await tx.address.delete({
            where: { id, userId: user.id }
        })

        return address;
    })

    return new ApiResponse(200, address, 'Address deleted successfully').send(res)
})

export const setDefaultAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user
    const address = await prisma.$transaction(async (tx) => {
        const address = await tx.address.findFirst({
            where: { id, userId: user.id }
        })

        if (!address) {
            throw new NotFoundError('Address not found')
        }

        await tx.address.updateMany({
            where: { userId: user.id, isDefault: true },
            data: { isDefault: false }
        })

        await tx.address.update({
            where: { id, userId: user.id },
            data: { isDefault: !address.isDefault }
        })
        return address;
    })

    return new ApiResponse(200, address, 'Default address set successfully').send(res)
})