import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { NotFoundError } from "../../../utils/errors.js";
import { getPagination, getSuccessMessage } from "../../helpers.js";
import slugify from 'slugify';


export const getAllCategories = asynHandler(async (req, res) => {
    const { query } = req;
    const { take, skip } = getPagination(query);

    const categories = await prisma.category.findMany({
        take,
        skip,
        orderBy: { createdAt: 'desc' }
    })

    return new ApiResponse(200, categories, getSuccessMessage('categories')).send(res)
})

export const getCategorybyId = asynHandler(async (req, res) => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
        where: { id }
    })

    if (!category) {
        throw new NotFoundError(getNotFoundMessage('category'))
    }

    return new ApiResponse(200, category, getSuccessMessage('categories')).send(res)
})

export const createCategory = asynHandler(async (req, res) => {
    const { body } = req;
    const { name, icon, description } = body;
    const slugiFiedSlug = slugify(name, { lower: true, strict: true, trim: true });

    const category = await prisma.category.create({
        data: {
            name,
            slug: slugiFiedSlug,
            icon,
            description
        }
    })

    return new ApiResponse(201, category, 'Category created successfully').send(res)
})

export const updateCategory = asynHandler(async (req, res) => {
    const { body, params } = req;
    const { id } = params;
    const { name, icon, description } = body;
    const slugifiedSlug = slugify(name, { lower: true, strict: true, trim: true })


    const category = await prisma.category.update({
        where: { id },
        data: {
            name,
            slug: slugifiedSlug,
            icon,
            description
        }
    })

    if (!category) {
        throw new NotFoundError(getNotFoundMessage('category'))
    }

    return new ApiResponse(200, category, 'Category updated successfully').send(res)
})

export const deleteCategory = asynHandler(async (req, res) => {
    const { params } = req;
    const { id } = params;

    const category = await prisma.category.delete({
        where: { id }
    })

    if (!category) {
        throw new NotFoundError(getNotFoundMessage('category'))
    }

    return new ApiResponse(200, category, 'Category deleted successfully').send(res)
})

export const getCategoryProducts = asynHandler(async (req, res) => {
    const { params, query } = req;
    const { id } = params;
    const { take, skip } = getPagination(query);

    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            products: {
                take,
                skip,
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!category) {
        throw new NotFoundError(getNotFoundMessage('category'))
    }

    return new ApiResponse(200, category.products, 'Products retrieved successfully').send(res)
})


