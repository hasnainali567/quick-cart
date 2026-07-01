import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { NotFoundError } from "../../../utils/errors.js";
import { buildPagination, getNotFoundMessage, getPagination, getSuccessMessage } from "../../helpers.js";

export const getAllStores = asynHandler(async (req, res) => {
  const { search, partnerStatus, isVerified } = req.query;
  const { take, skip } = getPagination(req.query);

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: String(search), mode: "insensitive" } },
            { owner: { name: { contains: String(search), mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(partnerStatus
      ? { partnerStatus: String(partnerStatus).toUpperCase() }
      : {}),
    ...(isVerified !== undefined
      ? { isVerified: isVerified === "true" }
      : {}),
  };

  const [totalDocs, stores] = await Promise.all([
    prisma.store.count({ where }),
    prisma.store.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        status: true,
        partnerStatus: true,
        isVerified: true,
        commissionPercent: true,
        totalRevenue: true,
        totalOrders: true,
        avgRating: true,
        createdAt: true,
        owner: { select: { id: true, name: true, email: true, image: true } },
      },
    }),
  ]);

  const pagination = buildPagination(totalDocs, skip, take);

  return new ApiResponse(200, { docs: stores, ...pagination }, getSuccessMessage("stores")).send(res);
});

export const getStorebyId = asynHandler(async (req, res) => {
  const { id } = req.params;
  const store = await prisma.store.findUnique({
    where: { id },
    include: { owner: { select: { id: true, name: true, email: true, image: true, phone: true, role: true, createdAt: true } } },
  });

  if (!store) {
    throw new NotFoundError(getNotFoundMessage("store"));
  }

  return new ApiResponse(200, store, getSuccessMessage("store")).send(res);
});

export const verifyStore = asynHandler(async (req, res) => {
  const { id } = req.params;

  const store = await prisma.$transaction(async (tx) => {
    const store = await tx.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundError(getNotFoundMessage("store"));

    return await tx.store.update({
      where: { id: store.id },
      data: { isVerified: true },
    });
  });

  return new ApiResponse(200, store, "Store verified successfully").send(res);
});

export const approveStore = asynHandler(async (req, res) => {
  const { id } = req.params;

  const store = await prisma.$transaction(async (tx) => {
    const store = await tx.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundError(getNotFoundMessage("store"));

    return await tx.store.update({
      where: { id: store.id },
      data: { partnerStatus: "APPROVED" },
    });
  });

  return new ApiResponse(200, store, "Store approved successfully").send(res);
});

export const suspendStore = asynHandler(async (req, res) => {
  const { id } = req.params;

  const store = await prisma.$transaction(async (tx) => {
    const store = await tx.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundError(getNotFoundMessage("store"));

    return await tx.store.update({
      where: { id: store.id },
      data: { partnerStatus: "SUSPENDED" },
    });
  });

  return new ApiResponse(200, store, "Store suspended").send(res);
});

export const rejectStore = asynHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  const store = await prisma.$transaction(async (tx) => {
    const store = await tx.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundError(getNotFoundMessage("store"));

    return await tx.store.update({
      where: { id: store.id },
      data: { partnerStatus: "REJECTED", rejectionReason },
    });
  });

  return new ApiResponse(200, store, "Store rejected").send(res);
});

export const updateStoreCommission = asynHandler(async (req, res) => {
  const { id } = req.params;
  const { commissionPercent = 15 } = req.body;

  const store = await prisma.$transaction(async (tx) => {
    const store = await tx.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundError(getNotFoundMessage("store"));

    return await tx.store.update({
      where: { id: store.id },
      data: { commissionPercent: parseFloat(commissionPercent) },
    });
  });

  return new ApiResponse(200, store, "Commission updated successfully").send(res);
});
