import connectDb from "./lib/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./utils/socket.js";
import { createServer, Server } from "http";
import app from "./app.js";

const server = new createServer(app);
const io = initSocket(server);

const startServer = async () => {
  await connectDb();
  server.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

startServer();
