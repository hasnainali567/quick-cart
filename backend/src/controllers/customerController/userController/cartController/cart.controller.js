import prisma from '../../../../lib/prisma.js'
import ApiResponse from '../../../../utils/apiResponse.js'
import { asyncHandler } from '../../../../utils/asyncHandler.js'
import { uploadToCloudinary } from '../../../../utils/cloudinary.js'
import { InternalServerError, NotFoundError, ValidationError } from '../../../../utils/errors.js'

export const getUserCart = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const cart = await prisma.cart.findFirst({
        where: {
            userId: id
        },
        select: {
            id: true,
            items: {
                select: {
                    id: true,
                    quantity: true,
                    createdAt: true,
                    product: {
                        select: {
                            images: true,
                            name: true,
                            price: true,
                            salePrice: true
                        }
                    },
                    variant: {
                        select: {
                            name: true,
                            price: true,
                            salePrice: true
                        }
                    }
                }
            },
        },
        o,
        orderBy: {
            createdAt: true
        }
    })

    return new ApiResponse(200, cart, 'Cart retrieved Successfully')
})

export const addToCart = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { item } = req.body;

    if (!item) {
        throw new ValidationError('item is required')
    }

    const cartItems = await prisma.$transaction(async (tx) => {
        let cart = await tx.cart.findFirst({
            where: { userId: id },
            select: {
                id: true
            }
        });

        if (!cart || !cart.id) {
            cart = await tx.cart.create({
                data: {
                    userId: id,
                },
                select: {
                    id: true
                }
            })
        }

        if (!cart) {
            throw new InternalServerError('Something went wrong')
        }

        return await tx.cartItem.create({
            data: {
                productId: item?.productId,
                variantId: item?.variantId,
                quantity: item?.quantity,
                cartId: cart?.id,
            }
        })
    })

    return new ApiResponse(201, cartItems, 'cart added successfully')
})

export const updateItemQuatity = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.update({
        where: { id: itemId, cart: { userId: id } },
        data: {
            quantity,
        },
        select: {
            id: true,
            quantity: true
        }
    })
    if ((!cartItem)) {
        throw new NotFoundError('cart item not found')
    }

    return new ApiResponse(200, cartItem, 'quantity update successfully')
})

export const deleteCartItem = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { itemId } = req.params;

    const cartItem = await prisma.cartItem.delete({
        where: { id: itemId, cart: { userId: id } },
    })

    if ((!cartItem)) {
        throw new NotFoundError('cart item not found')
    }

    return new ApiResponse(200, cartItem, 'quantity update successfully')
})

export const clearCart = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const cart = await prisma.cart.findFirst({
        where: {
            userId: id
        },
        select: {
            id: true
        }
    })
    if (!cart) {
        throw new NotFoundError('cart not found')
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id
        }
    })
    
    return new ApiResponse(200, null, 'cart cleared successfully')
})