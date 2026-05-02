import { Server } from "socket.io";

let io;
const connectedUsers = new Map();
// connectedUsers = { "userId123": "socketId_abc" }

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Client must emit this right after connecting
    // with their userId from JWT
    socket.on("user:join", (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      // Remove user from map on disconnect
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