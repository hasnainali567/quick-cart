// import prisma from '../../../../lib/prisma.js'
// import ApiResponse from '../../../../utils/apiResponse.js'
// import { asyncHandler } from '../../../../utils/asyncHandler.js'
// import { uploadToCloudinary } from '../../../../utils/cloudinary.js'
// import { InternalServerError, NotFoundError, ValidationError } from '../../../../utils/errors.js'

// // export const getUserOrders = asyncHandler(async (req, res) => {
// //     const { id } = req.user;
// //     const orders = await prisma.order.findMany({
// //         where: { customerId: id,},
// //         select: {
// //             id: true,
// //             status: true,

// //         }
// //     })
// // })

// export const placeOrder = asyncHandler(async (req, res) => {
//     const { id } = req.user;
//     const { items } = req.body;

//     if (!items || !Array.isArray(items) || items.length < 1) {
//         throw new ValidationError('order items is required')
//     }

//     const orderItems = await prisma.$transaction(async (tx) => {
//         const order
//         const orderItems = await tx.orderItem.createMany({
//             data : 
//         })
//     })
// })