// import { Queue, Worker } from "bullmq";
// import prisma from "../lib/prisma.js";
// import { getDistance } from "../utils/geo.js";
// import notify from "../utils/notify.js";
// import { acquireLockWithRetry, releaseLock } from "../utils/redlock.js";

// const connection = {
//   host: "localhost",
//   port: 6379,
// };

// const DRIVER_LOCK_TTL_MS = 30000; // 30 seconds
// const DRIVER_LOCK_MAX_RETRIES = 3;
// const DRIVER_LOCK_RETRY_DELAY_MS = 50;

// export const driverAssignmentQueue = new Queue("driver-assignment", {
//   connection,
//   defaultJobOptions: {
//     attempts: 3,
//     backoff: {
//       type: "exponential",
//       delay: 5000,
//     },
//     removeOnComplete: 100,
//     removeOnFail: 50,
//   },
// });

// async function findNearestAvailableDrivers(storeId, orderId) {
//   const store = await prisma.store.findUnique({
//     where: { id: storeId },
//     select: {
//       latitude: true,
//       longitude: true,
//       serviceRadiusKm: true,
//     },
//   });

//   if (!store) {
//     throw new Error(`Store ${storeId} not found`);
//   }

//   const drivers = await prisma.$queryRaw`
//     SELECT
//       d.id,
//       d."userId",
//       d."currentLatitude",
//       d."currentLongitude",
//       d."vehicleType",
//       d."acceptanceRate",
//       dl.latitude AS lastLat,
//       dl.longitude AS lastLng,
//       dl."createdAt" AS lastUpdate
//     FROM "Driver" d
//     LEFT JOIN LATERAL (
//       SELECT latitude, longitude, "createdAt"
//       FROM "DriverLocation"
//       WHERE "driverId" = d.id
//       ORDER BY "createdAt" DESC
//       LIMIT 1
//     ) dl ON true
//     WHERE d.status = 'ONLINE'
//     AND d."approvalStatus" = 'APPROVED'
//     AND d."currentLatitude" IS NOT NULL
//     AND d."currentLongitude" IS NOT NULL
//   `;

//   if (!drivers || drivers.length === 0) {
//     return [];
//   }

//   const { latitude: storeLat, longitude: storeLng, serviceRadiusKm } = store;
//   const radius = serviceRadiusKm || 5;

//   const driversWithDistance = drivers
//     .map((driver) => {
//       const driverLat = driver.lastLat ?? driver.currentLatitude;
//       const driverLng = driver.lastLng ?? driver.currentLongitude;

//       if (!driverLat || !driverLng) return null;

//       const distance = getDistance(storeLat, storeLng, driverLat, driverLng);
//       return { ...driver, distance };
//     })
//     .filter((d) => d !== null && d.distance <= radius)
//     .sort((a, b) => a.distance - b.distance);

//   if (driversWithDistance.length === 0) {
//     return [];
//   }

//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     select: { id: true, storeId: true, status: true },
//   });

//   if (!order || order.status !== "CONFIRMED") {
//     return [];
//   }

//   // Return all drivers who don't have an active delivery
//   const availableDrivers = [];
//   for (const driver of driversWithDistance) {
//     const existingDelivery = await prisma.delivery.findFirst({
//       where: {
//         driverId: driver.id,
//         order: {
//           status: {
//             in: [
//               "DRIVER_ASSIGNED",
//               "HEADING_TO_STORE",
//               "PICKED_UP",
//               "OUT_FOR_DELIVERY",
//             ],
//           },
//         },
//       },
//     });

//     if (!existingDelivery) {
//       availableDrivers.push(driver);
//     }
//   }

//   return availableDrivers;
// }

// async function assignDriverToOrder(orderId, driverId) {
//   return await prisma.$transaction(async (tx) => {
//     const order = await tx.order.update({
//       where: { id: orderId },
//       data: { status: "DRIVER_ASSIGNED" },
//       select: {
//         id: true,
//         storeId: true,
//         customerId: true,
//         total: true,
//         store: { select: { name: true } },
//       },
//     });

//     await tx.orderStatusHistory.create({
//       data: {
//         orderId,
//         status: "DRIVER_ASSIGNED",
//         note: `Driver assigned automatically`,
//         changedBy: driverId,
//       },
//     });

//     const delivery = await tx.delivery.create({
//       data: {
//         orderId,
//         driverId,
//         assignedAt: new Date(),
//       },
//     });

//     await tx.driver.update({
//       where: { id: driverId },
//       data: { status: "ON_DELIVERY" },
//     });

//     return { order, delivery };
//   });
// }

// async function processDriverAssignment(job) {
//   const { orderId } = job.data;

//   console.log(`[Driver Assignment] Processing order ${orderId}`);

//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     select: {
//       id: true,
//       storeId: true,
//       customerId: true,
//       total: true,
//       status: true,
//       store: { select: { name: true } },
//     },
//   });

//   if (!order) {
//     throw new Error(`Order ${orderId} not found`);
//   }

//   if (order.status !== "CONFIRMED") {
//     console.log(
//       `[Driver Assignment] Order ${orderId} is not CONFIRMED (current: ${order.status}), skipping`,
//     );
//     return { skipped: true, reason: "Order not in CONFIRMED status" };
//   }

//   const drivers = await findNearestAvailableDrivers(order.storeId, orderId);

//   if (!drivers || drivers.length === 0) {
//     console.log(
//       `[Driver Assignment] No available drivers for order ${orderId}, will retry`,
//     );
//     throw new Error("NO_DRIVERS_AVAILABLE");
//   }

//   let assignedDriver = null;
//   let lockAcquired = false;

//   for (const driver of drivers) {
//     const lockKey = `driver:lock:${driver.id}`;
//     const lockValue = `job:${job.id}:order:${orderId}`;

//     console.log(
//       `[Driver Assignment] Attempting to acquire lock for driver ${driver.id} (order ${orderId})`,
//     );
//     lockAcquired = await acquireLockWithRetry(lockKey, lockValue, {
//       maxRetries: DRIVER_LOCK_MAX_RETRIES,
//       retryDelayMs: DRIVER_LOCK_RETRY_DELAY_MS,
//       ttlMs: DRIVER_LOCK_TTL_MS,
//     });

//     if (lockAcquired) {
//       console.log(
//         `[Driver Assignment] Lock acquired for driver ${driver.id}, assigning to order ${orderId}`,
//       );
//       assignedDriver = driver;
//       break;
//     } else {
//       console.log(
//         `[Driver Assignment] Could not acquire lock for driver ${driver.id}, trying next driver`,
//       );
//     }
//   }

//   if (!assignedDriver || !lockAcquired) {
//     console.log(
//       `[Driver Assignment] No drivers available for order ${orderId} (all locked), will retry`,
//     );
//     throw new Error("NO_DRIVERS_AVAILABLE");
//   }

//   let result;
//   try {
//     result = await assignDriverToOrder(orderId, assignedDriver.id);
//   } finally {
//     // Always release the lock
//     const lockKey = `driver:lock:${assignedDriver.id}`;
//     const lockValue = `job:${job.id}:order:${orderId}`;
//     await releaseLock(lockKey, lockValue);
//     console.log(
//       `[Driver Assignment] Released lock for driver ${assignedDriver.id}`,
//     );
//   }

//   const { order: updatedOrder, delivery } = result;

//   await notify({
//     to: `user:${assignedDriver.userId}`,
//     userId: assignedDriver.userId,
//     data: {
//       title: "New Delivery Assignment",
//       type: "DRIVER_ASSIGNED",
//       body: `You have been assigned to deliver order from ${updatedOrder.store.name}`,
//     },
//     extra: {
//       orderId: updatedOrder.id,
//       deliveryId: delivery.id,
//       storeName: updatedOrder.store.name,
//       amount: updatedOrder.total,
//       distanceKm: Math.round(assignedDriver.distance * 100) / 100,
//     },
//   });

//   const io = (await import("../utils/socket.js")).getIO();
//   io.to(`user:${assignedDriver.userId}`).emit("delivery:assigned", {
//     orderId: updatedOrder.id,
//     deliveryId: delivery.id,
//     storeName: updatedOrder.store.name,
//     amount: updatedOrder.total,
//     distanceKm: Math.round(assignedDriver.distance * 100) / 100,
//   });

//   console.log(
//     `[Driver Assignment] Assigned driver ${assignedDriver.id} to order ${orderId} (distance: ${assignedDriver.distance.toFixed(
//       2,
//     )}km)`,
//   );

//   return {
//     assigned: true,
//     driverId: assignedDriver.id,
//     distance: assignedDriver.distance,
//   };
// }

// export const driverAssignmentWorker = new Worker(
//   "driver-assignment",
//   processDriverAssignment,
//   {
//     connection,
//     concurrency: 5,
//   },
// );

// driverAssignmentWorker.on("completed", (job) => {
//   console.log(`[Driver Assignment] Job ${job.id} completed`);
// });

// driverAssignmentWorker.on("failed", async (job, err) => {
//   if (job.attemptsMade >= job.opts.attempts) {
//     await prisma.order.update({
//       where: { id: job.data.orderId },
//       data: { status: "DRIVER_ASSIGNMENT_FAILED" },
//     });
//   }
//   console.error(`[Driver Assignment] Job ${job?.id} failed:`, err.message);
// });

// export async function addDriverAssignmentJob(orderId) {
//   const job = await driverAssignmentQueue.add(
//     "assign-driver",
//     { orderId },
//     {
//       delay: 1000,
//     },
//   );
//   return job;
// }

// export default driverAssignmentQueue;
