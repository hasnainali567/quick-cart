import { v2 as cloudinary } from 'cloudinary'
import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { env } from '../config/env.js'
import { BadRequestError, InternalServerError } from './errors.js'

const ensureCloudinaryConfig = () => {
    if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
        throw new InternalServerError('Cloudinary credentials are not configured')
    }
}

cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
})

const normalizeUploadResult = (result) => {
    if (!result) {
        return result
    }

    return {
        ...result,
        secureUrl: result.secure_url,
        publicId: result.public_id,
        url: result.secure_url,
    }
}

const createUploadSource = (file) => {
    if (file?.buffer) {
        return Readable.from([file.buffer])
    }

    if (file?.path) {
        return createReadStream(file.path)
    }

    throw new BadRequestError('No file buffer or path provided for upload')
}

const uploadFileStream = async (file, options = {}) => {
    ensureCloudinaryConfig()

    const source = createUploadSource(file)

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder || 'quickcart',
                resource_type: options.resourceType || 'image',
                public_id: options.publicId,
                overwrite: options.overwrite ?? true,
            },
            (error, result) => {
                if (error) {
                    reject(new InternalServerError('Failed to upload file to Cloudinary', error))
                    return
                }

                resolve(normalizeUploadResult(result))
            },
        )

        source.on('error', (error) => {
            reject(new InternalServerError('Failed to read file for Cloudinary upload', error))
        })

        source.pipe(uploadStream)
    })
}

export const uploadToCloudinary = async (file, options = {}) => {
    return uploadFileStream(file, options)
}

export const uploadToCloudinaryMultiple = async (files, options = {}) => {
    const minFiles = options.minFiles ?? 3
    const maxFiles = options.maxFiles

    if (!Array.isArray(files) || files.length < minFiles) {
        throw new BadRequestError(`At least ${minFiles} images are required`)
    }

    if (typeof maxFiles === 'number' && files.length > maxFiles) {
        throw new BadRequestError(`At most ${maxFiles} images are allowed`)
    }

    const uploadedFiles = []

    try {
        for (const file of files) {
            const uploadedFile = await uploadFileStream(file, options)
            uploadedFiles.push(uploadedFile)
        }

        return uploadedFiles
    } catch (error) {
        await Promise.allSettled(
            uploadedFiles.map((uploadedFile) =>
                deleteFromCloudinary(uploadedFile.publicId, {
                    resourceType: options.resourceType || 'image',
                    invalidate: options.invalidate ?? true,
                }),
            ),
        )

        throw new InternalServerError('Failed to upload multiple images to Cloudinary', error)
    }
}

export const deleteFromCloudinary = async (publicId, options = {}) => {
    if (!publicId) {
        throw new BadRequestError('Cloudinary publicId is required')
    }

    ensureCloudinaryConfig()

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: options.resourceType || 'image',
            invalidate: options.invalidate ?? true,
        })

        return result
    } catch (error) {
        throw new InternalServerError('Failed to delete file from Cloudinary', error)
    }
}

export default cloudinary