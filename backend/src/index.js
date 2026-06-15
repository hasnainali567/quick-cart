import connectDb from "./lib/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./utils/socket.js";
import { createServer } from "http";
import app from "./app.js";
// import { driverAssignmentWorker } from "./jobs/driver.assignment.js";

const server = createServer(app);
initSocket(server);

// driverAssignmentWorker.on("error", (err) => {
//   console.error("[Driver Assignment Worker] Error:", err);
// });

const startServer = async () => {
  await connectDb();
  server.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

startServer();
