// src/utils/notify.js

const { PrismaClient } = require("@prisma/client");
const { getIO, isUserOnline } = require("./socket");

const prisma = new PrismaClient();

// All notification templates in one place
const TEMPLATES = {
  STORE_APPROVED: {
    title: "Store Approved! 🎉",
    body: "Your store is now live on QuickCart",
  },
  STORE_REJECTED: {
    title: "Application Update",
    body: "Your store application was not approved",
  },
  ORDER_PLACED: {
    title: "New Order! 🛒",
    body: "You have a new incoming order",
  },
  ORDER_CONFIRMED: {
    title: "Order Confirmed ✅",
    body: "Your order is being prepared",
  },
  ORDER_REJECTED: {
    title: "Order Rejected",
    body: "Your order was rejected by the store",
  },
  ORDER_READY: {
    title: "Order Ready 📦",
    body: "Your order is packed and waiting for pickup",
  },
  DRIVER_ASSIGNED: {
    title: "Driver Assigned 🚴",
    body: "A driver is heading to the store",
  },
  ORDER_PICKED_UP: {
    title: "Order Picked Up 🛵",
    body: "Your order is on the way",
  },
  ORDER_DELIVERED: {
    title: "Delivered! 🎉",
    body: "Your order has arrived. Enjoy!",
  },
  ORDER_CANCELLED: {
    title: "Order Cancelled",
    body: "Your order has been cancelled",
  },
  DRIVER_APPROVED: {
    title: "Welcome to QuickCart! 🚴",
    body: "Your driver account is approved. Go online!",
  },
  DRIVER_REJECTED: {
    title: "Application Update",
    body: "Your driver application was not approved",
  },
  LOW_STOCK: {
    title: "Low Stock Alert ⚠️",
    body: "One of your products is running low on stock",
  },
  NEW_REVIEW: {
    title: "New Review ⭐",
    body: "Someone left a review on your store",
  },
  WITHDRAWAL_APPROVED: {
    title: "Withdrawal Approved 💰",
    body: "Your withdrawal request has been approved",
  },
  WITHDRAWAL_REJECTED: {
    title: "Withdrawal Rejected",
    body: "Your withdrawal request was rejected",
  },
};

const notify = async ({ userId, data = {} }) => {
  try {

    if (!data.title || !data.body) throw new Error(`Unknown notification type: ${type}`);

    const title = data.title;
    const body = data.body;

    // 1. Always save to DB
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data ? JSON.stringify(data) : null,
      },
    });

    // 2. Emit in real-time only if user is online
    if (isUserOnline(userId)) {
      const io = getIO();
      io.to(`user:${userId}`).emit("notification:new", {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        data: data,
        isRead: false,
        createdAt: notification.createdAt,
      });
    }

    return notification;

  } catch (error) {
    // Never crash the main flow because of a notification failure
    console.error("Notification error:", error.message);
  }
};

module.exports = { notify };