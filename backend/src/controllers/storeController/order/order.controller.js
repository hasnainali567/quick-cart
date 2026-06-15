import prisma from "../../../lib/prisma.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import slugify from "slugify";
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";
import {
  deleteFromCloudinary,
  uploadToCloudinaryMultiple,
} from "../../../utils/cloudinary.js";
import { generateSkuCode, getPagination } from "../../helpers.js";
import notify from "../../../utils/notify.js";
// import { addDriverAssignmentJob } from "../../../jobs/driver.assignment.js";

export const acceptOrder = asynHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new BadRequestError("Only pending orders can be accepted");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: "CONFIRMED" },
  });

  await notify({
    to: `user:${order.customerId}`,
    userId: order.customerId,
    data: {
      title: "Order Confirmed",
      type: "ORDER_CONFIRMED",
      body: "Your order has been accepted and confirmed by the store",
    },
  });

  // await addDriverAssignmentJob(orderId);

  return new ApiResponse(200, updatedOrder, "Order accepted successfully").send(
    res,
  );
});

export const markOrderPrepared = asynHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.status !== "CONFIRMED") {
    throw new BadRequestError(
      "Only confirmed orders can be marked as prepared",
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: "PREPARED" },
  });

  return new ApiResponse(
    200,
    updatedOrder,
    "Order marked as prepared successfully",
  ).send(res);
});

export const rejectOrder = asynHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new BadRequestError("Only pending orders can be rejected");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: "REJECTED" },
  });

  return new ApiResponse(200, updatedOrder, "Order rejected").send(res);
});

export const getOrders = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { skip, take } = getPagination(req.query);

  const orders = await prisma.order.findMany({
    where: {
      store: {
        ownerId: id,
      },
    },
    skip,
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customer: {
        select: {
          name: true,
          email: true,
          image: true,
          id: true,
        },
      },
      status: true,
      subtotal: true,
      total: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalOrders = await prisma.order.count({
    where: {
      store: {
        ownerId: id,
      },
    },
  });

  return new ApiResponse(
    200,
    { orders, total: totalOrders },
    "Orders retrieved successfully",
  ).send(res);
});

export const getOrderbyId = asynHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
        },
      },
      address: {
        select: {
          addressLine1: true,
          area: true,
          city: true,
          country: true,
          phone: true,
          id: true,
          addressLine2: true,
        },
      },
      items: {
        select: {
          id: true,
          image: true,
          quantity: true,
          product: {
            select: {
              id: true,
              images: true,
            },
          },
        },
      },
    },
  });

  return new ApiResponse(200, order, "Order retrieved successfully").send(res);
});
