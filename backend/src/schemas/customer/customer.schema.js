import Joi from "joi"

const LABEL = ['Home', 'Work', 'Other']

export const addressSchema = {
    create: Joi.object({
        fullName: Joi.string().required().min(3).max(100).messages({
            'string.base': 'Full name must be a string',
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 3 characters',
            'string.max': 'Full name must be at most 100 characters',
            'any.required': 'Full name is required',
        }),
        label: Joi.string().valid(...LABEL).optional().messages({
            'string.base': 'Label must be a string',
            'any.only': 'Label must be one of the allowed values',
        }),
        phone: Joi.string().required().pattern(/^\+?[1-9]\d{1,14}$/).messages({
            'string.base': 'Phone number must be a string',
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Phone number must be a valid E.164 format',
            'any.required': 'Phone number is required',
        }),
        addressLine1: Joi.string().required().max(255).messages({
            'string.base': 'Address Line 1 must be a string',
            'string.empty': 'Address Line 1 is required',
            'string.max': 'Address Line 1 must be at most 255 characters',
            'any.required': 'Address Line 1 is required',
        }),
        addressLine2: Joi.string().optional().max(255).messages({
            'string.base': 'Address Line 2 must be a string',
            'string.max': 'Address Line 2 must be at most 255 characters',
        }),
        area: Joi.string().required().max(100).messages({
            'string.base': 'Area must be a string',
            'string.empty': 'Area is required',
            'string.max': 'Area must be at most 100 characters',
            'any.required': 'Area is required',
        }),
        city: Joi.string().required().max(100).messages({
            'string.base': 'City must be a string',
            'string.empty': 'City is required',
            'string.max': 'City must be at most 100 characters',
            'any.required': 'City is required',
        }),
        province: Joi.string().required().max(100).messages({
            'string.base': 'Province must be a string',
            'string.empty': 'Province is required',
            'string.max': 'Province must be at most 100 characters',
            'any.required': 'Province is required',
        }),
        country: Joi.string().required().max(100).messages({
            'string.base': 'Country must be a string',
            'string.empty': 'Country is required',
            'string.max': 'Country must be at most 100 characters',
            'any.required': 'Country is required',
        }),
        isDefault: Joi.boolean().optional().messages({
            'boolean.base': 'isDefault must be a boolean',
            'any.only': 'isDefault must be true or false',
        }),


    }),

    update: Joi.object({
        fullName: Joi.string().optional().min(3).max(100).messages({
            'string.base': 'Full name must be a string',
            'string.empty': 'Full name cannot be empty',
            'string.min': 'Full name must be at least 3 characters',
            'string.max': 'Full name must be at most 100 characters',
        }),
        label: Joi.string().valid(...LABEL).optional().messages({
            'string.base': 'Label must be a string',
            'any.only': 'Label must be one of the allowed values',
        }),
        phone: Joi.string().optional().pattern(/^\+?[1-9]\d{1,14}$/).messages({
            'string.base': 'Phone number must be a string',
            'string.pattern.base': 'Phone number must be a valid E.164 format',
        }),
        addressLine1: Joi.string().optional().max(255).messages({
            'string.base': 'Address Line 1 must be a string',
            'string.max': 'Address Line 1 must be at most 255 characters',
        }),

        addressLine2: Joi.string().optional().max(255).messages({
            'string.base': 'Address Line 2 must be a string',
            'string.max': 'Address Line 2 must be at most 255 characters',
        }),
        area: Joi.string().optional().max(100).messages({
            'string.base': 'Area must be a string',
            'string.max': 'Area must be at most 100 characters',
        }),
        city: Joi.string().optional().max(100).messages({
            'string.base': 'City must be a string',
            'string.max': 'City must be at most 100 characters',
        }),
        province: Joi.string().optional().max(100).messages({
            'string.base': 'Province must be a string',
            'string.max': 'Province must be at most 100 characters',
        }),
        country: Joi.string().optional().max(100).messages({
            'string.base': 'Country must be a string',
            'string.max': 'Country must be at most 100 characters',
        }),
        isDefault: Joi.boolean().optional().messages({
            'boolean.base': 'isDefault must be a boolean',
            'any.only': 'isDefault must be true or false',
        }),
        latitude: Joi.number().optional().min(-90).max(90).messages({
            'number.base': 'Latitude must be a number',
            'number.min': 'Latitude must be at least -90',
            'number.max': 'Latitude must be at most 90',
        }),
        longitude: Joi.number().optional().min(-180).max(180).messages({
            'number.base': 'Longitude must be a number',
            'number.min': 'Longitude must be at least -180',
            'number.max': 'Longitude must be at most 180',
        }),


    })
}

export const orderSchema = {
    create: Joi.object({
        items : 
    })
}