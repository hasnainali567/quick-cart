import {
    AppError,
    BadRequestError,
    ConflictError,
    InternalServerError,
    ValidationError,
} from '../utils/errors.js'

const normalizeError = (error) => {
    if (error instanceof AppError) {
        return error
    }

    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return new BadRequestError('Invalid JSON payload')
    }

    if (error?.code === 'P2002') {
        return new ConflictError('Unique constraint violation', error?.meta)
    }

    if (error?.code === 'P2003' || error?.code === 'P2025') {
        return new ValidationError('Invalid relation or missing record', error?.meta)
    }

    return new InternalServerError(error?.message || 'Internal server error')
}

export const errorHandler = (error, req, res, next) => {
    const appError = normalizeError(error)

    res.status(appError.statusCode).json({
        success: false,
        message: appError.message,
        ...(appError.details && { details: appError.details }),
    })
}
