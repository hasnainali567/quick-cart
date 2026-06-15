import { getIO, isUserOnline } from "./socket.js";
import prisma from "../lib/prisma.js";

const notify = async ({ to, userId, data = {}, extra }) => {
  try {
    if (!data.title || !data.body || !data.type)
      throw new Error(`Unknown notification type: ${data.type}`);

    const title = data.title;
    const body = data.body;
    const type = data.type;

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: extra ? JSON.stringify(extra) : null,
      },
    });

    const io = getIO();

    io.to(to).emit("notification:new", {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: extra,
      isRead: false,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};

export default notify;
