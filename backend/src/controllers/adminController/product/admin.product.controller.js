import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { NotFoundError } from "../../../utils/errors.js";
import { getPagination, getSuccessMessage, getNotFoundMessage } from "../../helpers.js";

const ADMIN_STATUS = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']
const PRODUCT_STATUS = ['ACTIVE', 'INACTIVE']

export const getAllProducts = asynHandler(async (req, res) => {
    const { query } = req
    const { take, skip } = getPagination(query);
    const { status, productStatus, category, inStock, price = 'asc', store, lowStock } = query;

    if (status && !ADMIN_STATUS.includes(status.toUpperCase())) {
        throw new NotFoundError('Invalid status provided')
    }

    if (productStatus && !PRODUCT_STATUS.includes(productStatus.toUpperCase())) {
        throw new NotFoundError('Invalid product status provided')
    }

    const products = await prisma.product.findMany({
        where: {
            adminStatus: status ? status.toUpperCase() : undefined,
            status: productStatus ? productStatus.toUpperCase() : undefined,
            category: category ? { slug: category } : undefined,
            stock: inStock === 'true' ? { gt: 0 } : lowStock === 'true' ? { lte: 10 } : undefined,
            store: store ? { slug: store } : undefined
        },
        orderBy: {
            price: price === 'asc' ? 'asc' : 'desc'
        },
        skip,
        take
    })

    return new ApiResponse(200, products, getSuccessMessage('products')).send(res)
})

export const getStoresforProductFiltering = asynHandler(async (req, res) => {
    const stores = await prisma.store.findMany({
        select: {
            id: true,
            name: true,
            slug: true
        }
    })

    return new ApiResponse(200, stores, getSuccessMessage('stores')).send(res)
})

export const getCategoriesforProductFiltering = asynHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true
        }
    })

    return new ApiResponse(200, categories, getSuccessMessage('categories')).send(res)
})

export const getProductById = asynHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
            reviews: {
                select: {
                    comment: true,
                    rating: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    createdAt: true,
                }
            }
        }
    })

    if (!product) {
        throw new NotFoundError(getNotFoundMessage('product'))
    }

    return new ApiResponse(200, product, getSuccessMessage('product')).send(res)
})

export const approveProduct = asynHandler(async (req, res) => {
    const { id } = req.params;

    const product = await prisma.product.update({
        where: { id },
        data: {
            adminStatus: 'APPROVED'
        },
        select: {
            id: true,
            name: true,
            slug: true,
            adminStatus: true,
        }
    })

    if (!product) {
        throw new NotFoundError(getNotFoundMessage('product'))
    }

    return new ApiResponse(200, product, 'Product approved successfully').send(res)
})

export const rejectProduct = asynHandler(async (req, res) => {
    const { id } = req.params;

    const product = await prisma.product.update({

        where: { id },
        data: {
            adminStatus: 'REJECTED'
        },
        select: {
            id: true,
            name: true,
            slug: true,
            adminStatus: true,
        }
    }
    )

    if (!product) {
        throw new NotFoundError(getNotFoundMessage('product'))
    }

    return new ApiResponse(200, product, 'Product rejected successfully').send(res)
})

export const suspendProduct = asynHandler(async (req, res) => {
    const { id } = req.params;

    const product = await prisma.product.update({
        where: { id },
        data: {
            adminStatus: 'SUSPENDED'
        },
        select: {
            id: true,
            name: true,
            slug: true,
            adminStatus: true,
        }
    })
    if (!product) {
        throw new NotFoundError(getNotFoundMessage('product'))
    }

    return new ApiResponse(200, product, 'Product suspended successfully').send(res)
})

export const setProductFeatured = asynHandler(async (req, res) => {
    const { id } = req.params;

    const product = await prisma.product.update({
        where: { id },
        data: {
            isFeatured: true
        },
        select: {
            id: true,
            name: true,
            slug: true,
            isFeatured: true,
        }
    })

    if (!product) {
        throw new NotFoundError(getNotFoundMessage('product'))
    }

    return new ApiResponse(200, product, 'Product set as featured successfully').send(res)
})