import multer from 'multer'
import { BadRequestError } from '../utils/errors.js'

const storage = multer.memoryStorage()

const imageFileFilter = (req, file, cb) => {
    if (!file?.mimetype?.startsWith('image/')) {
        return cb(new BadRequestError('Only image files are allowed'))
    }

    cb(null, true)
}

export const upload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})

export const uploadSingleImage = (fieldName = 'image') => upload.single(fieldName)