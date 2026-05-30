import prisma from "../../lib/prisma.js";
import { asynHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  ValidationError,
} from "../../utils/errors.js";
import { parse } from "dotenv";

export const registerDriver = asynHandler(async (req, res) => {
  const { id } = req.user;
  const {
    vehicleType,
    vehicleName,
    vehicleNumber,
    currentLatitude,
    currentLongitude,
  } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: {
      role: true,
      driver: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  if (existingUser.role === "DRIVER" || existingUser.driver) {
    throw new ForbiddenError("You are already a driver");
  }

  if (existingUser.role === "STORE_ADMIN") {
    throw new ForbiddenError(
      "You are already a store admin, cannot register as driver",
    );
  }

  const driver = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id },
      data: {
        role: "DRIVER",
      },
    });

    const createdDriver = await tx.driver.create({
      data: {
        userId: user.id,
        vehicleName,
        vehicleNumber,
        vehicleType,
        currentLatitude: parseFloat(currentLatitude),
        currentLongitude: parseFloat(currentLongitude),
      },
    });

    if (currentLatitude !== undefined && currentLongitude !== undefined) {
      await tx.driverLocation.create({
        data: {
          driverId: createdDriver.id,
          latitude: parseFloat(currentLatitude),
          longitude: parseFloat(currentLongitude),
        },
      });
    }

    return createdDriver;
  });

  return new ApiResponse(201, driver, "driver registered successfully").send(res);
});

export const getDriver = asynHandler(async (req, res) => {
  const { id } = req.user;

  const driver = await prisma.driver.findUnique({
    where: { userId: id },
    select: {
      id: true,
      totalDeliveries: true,
      avgRating: true,
      totalEarnings: true,
      status: true,
      approvalStatus: true,
      acceptanceRate: true,
      completionRate: true,
      onTimeRate: true,
      currentLatitude: true,
      currentLongitude: true,
      deliveries: {
        where: {
            order : {
                status : {in : ['OUT_FOR_DELIVERY', 'DRIVER_ASSIGNED', "HEADING_TO_STORE", 'PICKED_UP']}
            }
        },
        orderBy: [{ updatedAt: "desc" }, { assignedAt: "desc" }],
        take: 1,
        select: {
          id: true,
          order: {
            select: {
              id: true,
              status: true,
              statusHistory: {
                orderBy: { createdAt: "desc" },
                select: {
                  id: true,
                  status: true,
                  note: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!driver) {
    throw new NotFoundError("Driver not found");
  }

  const { deliveries, ...driverSummary } = driver;

  return new ApiResponse(
    200,
    {
      ...driverSummary,
      ongoingDelivery: deliveries[0] ?? null,
    },
    "driver dashboard retrieved successfully",
  ).send(res);
});

export const getNearbyDrivers = asynHandler(async (req, res) => {
  const { id } = req.user;

  const store = await prisma.store.findUnique({
    where: { ownerId: id },
    select: {
      latitude: true,
      longitude: true,
      serviceRadiusKm: true,
    },
  });

  if (!store) {
    throw new NotFoundError("Store not found");
  }

  const drivers = await prisma.$queryRaw`
      SELECT *
      FROM (
        SELECT 
          d.id,
          d."vehicleType",
          d."vehicleName",
          d."vehicleNumber",
          dl.latitude,
          dl.longitude,
          (6371 * acos(
            cos(radians(${store.latitude})) * 
            cos(radians(dl.latitude)) * 
            cos(radians(dl.longitude) - radians(${store.longitude})) +
            sin(radians(${store.latitude})) * 
            sin(radians(dl.latitude))
          )) AS distance_km
        FROM "Driver" d
        LEFT JOIN "DriverLocation" dl ON dl."driverId" = d.id
        WHERE d.status = 'ONLINE'
      ) nearby_drivers
      WHERE distance_km < ${store.serviceRadiusKm}
      ORDER BY distance_km ASC
    `;

  return new ApiResponse(200, drivers, "Nearby drivers retrieved successfully").send(res);
});

export const updateDriverLocation = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { currentLatitude, currentLongitude } = req.body;

  const updatedDriver = await prisma.$transaction(async (tx) => {
    const driver = await tx.driver.update({
      where: { userId: id },
      data: { currentLatitude: parseFloat(currentLatitude), currentLongitude: parseFloat(currentLongitude) },
      select: {
        id: true,
        currentLatitude: true,
        currentLongitude: true,
      },
    });

    await tx.driverLocation.update({
      where : {
        driverId : driver.id
      },
      data: {
        latitude: parseFloat(currentLatitude),
        longitude: parseFloat(currentLongitude),
      },
    });

    return driver;
  });

  // todo emit socket event
  return new ApiResponse(
    200,
    updatedDriver,
    "Driver location updated successfully",
  ).send(res);
});

export const toggleDriverStatus = asynHandler(async (req, res) => {
  const { id } = req.user;
  const driver = await prisma.driver.findUnique({
    where: { userId: id },
    select: {
      status: true,
    },
  });

  if (!driver) {
    throw new InternalServerError("something went wrong");
  }

  if (driver.status === "ON_DELIVERY") {
    throw new ForbiddenError("You cannot change status while on delivery");
  }

  const newStatus = driver.status === "ONLINE" ? "OFFLINE" : "ONLINE";
  const updatedDriver = await prisma.driver.update({
    where: { userId: id },
    data: { status: newStatus },
    select: {
      id: true,
      status: true,
    },
  });

  return new ApiResponse(
    200,
    updatedDriver,
    `Driver status updated to ${newStatus}`,
  ).send(res);
});

export const getDriverDeliveries = asynHandler(async (req, res) => {
  const { id } = req.user;

  const driver = await prisma.driver.findUnique({
    where: { userId: id },
    select: {
      id: true,
    },
  });

  if (!driver) {
    throw new NotFoundError("Driver not found");
  }

  const deliveries = await prisma.delivery.findMany({
    where: { driverId: driver.id },
    select: {
      distanceKm: true,
      durationMins: true,
      earnings: true,
      status: true,
      order: {
        select: {
          id: true,
          store: {
            select: {
              name: true,
              slug: true,
              owner: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return new ApiResponse(
    200,
    deliveries,
    "driver deliveries retrieved successfully",
  ).send(res)   ;
});

export const getDriverProfile = asynHandler(async (req, res) => {
  const { id } = req.user;

  const driver = await prisma.driver.findUnique({
    where: { userId: id },
    select: {
      id: true,
      vehicleType: true,
      vehicleName: true,
      vehicleNumber: true,
      totalDeliveries: true,
      createdAt: true,
      onTimeRate: true,
      completionRate: true,
      acceptanceRate: true,
      avgRating: true,
      totalEarnings: true,
      status: true,
      approvalStatus: true,
      currentLatitude: true,
      currentLongitude: true,
      licenseNumber: true,
      licenseImage: true,
      cnicNumber: true,
      cnicFrontImage: true,
      cnicBackImage: true,
      profileVerified: true,
      rejectionReason: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          isActive: true,
          isSuspended: true,
          publicId: true,
          createdAt: true,
        },
      },
    },
  });

  if (!driver) {
    throw new NotFoundError("Driver not found");
  }

  return new ApiResponse(200, driver, "driver profile retrieved successfully").send(res);
});

export const updateDriverProfile = asynHandler(async (req, res) => {
  // todo implement this
  const { id } = req.user;
  const {
    vehicleType,
    vehicleName,
    vehicleNumber,
    licenseNumber,
    licenseImage,
    cnicNumber,
    cnicFrontImage,
    cnicBackImage,
  } = req.body;

  await prisma.driver.update({
    where: { userId: id },
    data: {
      vehicleType,
      vehicleName,
      vehicleNumber,
      licenseNumber,
      licenseImage,
      cnicNumber,
      cnicFrontImage,
      cnicBackImage,
    },
  });

  return new ApiResponse(200, {}, "driver profile updated successfully").send(res);
});
