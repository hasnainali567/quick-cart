import { Server } from "socket.io";
import { UnauthorizedError } from "./errors";
import { auth } from "../lib/auth";

let io;
const connectedUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  console.log("socket initialized");

  io.use(async (socket, next) => {
    const token = socket.handshake.headers.cookie;

    if (!token) {
      return next(new UnauthorizedError("Authentication token missing"));
    }

    const session = await auth.api.getSession({
      headers: {
        cookie: token,
      },
    });

    if (!session || !session.user) {
      return next(new UnauthorizedError("Invalid session"));
    }

    socket.user = session.user;
    socket.userId = session.user.id;
    socket.role = session.user?.role;

    next();
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("user:join", () => {
      connectedUsers.set(socket.userId, socket.id);
      socket.join(`user:${socket.userId}`);
      console.log(`User ${socket.userId} joined their room`);
    });

    socket.on("store:join", (storeId) => {
      socket.join(`store:${storeId}`);
      console.log(`store ${storeId} joined their room`);
      socket.to(`store:${storeId}`).emit('notification:new', 'recieving')
    });

    socket.on("driver:join", (driverId) => {
      socket.join(`dirver:${driverId}`);
      console.log(`driver ${driverId} joined their room`);
    });

    socket.on("customer:order:join", (orderId) => {
      connectedUsers.set(socket.userId, socket.id);
      socket.join(`order:${orderId}`);
      console.log("user joined order room");
    });

    socket.on("store:order:join", ({ orderId }) => {
      socket.join(`order:${orderId}`);
      console.log("store joined order room");
    });

    socket.on("driver:order:join", ({ orderId }) => {
      socket.join(`order:${orderId}`);
      console.log("driver joined order");
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};

const isUserOnline = (userId) => {
  if (!io) throw new Error("Socket.IO not initialized");
  const room = io.sockets.adapter.rooms.get(`user:${userId}`);
  return room && room.size > 0;
};

export { initSocket, getIO, isUserOnline };
