import { NotFoundError } from "../utils/errors.js"

export const getPagination = (query) => {
    return {
        take: parseInt(query.take, 10) || 10,
        skip: parseInt(query.skip, 10) || 0
    }
}

export const getSuccessMessage = (success) => {
    return `${success} retrieved successfully`
}


export const getNotFoundMessage = (entity) => {
    return `${entity} not found`
}


export const generateSkuCode = (productName) => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
    const namePart = productName.substring(0, 3).toUpperCase()
    return `${namePart}-${randomString}`
}
