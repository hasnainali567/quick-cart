import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { NotFoundError, ValidationError } from "../../../utils/errors.js";
import { buildPagination, getNotFoundMessage, getPagination, getSuccessMessage } from "../../helpers.js";

export const getAllUser = asynHandler(async (req, res) => {
  const { search, role, isSuspended } = req.query;
  const { take, skip } = getPagination(req.query);

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: String(search), mode: "insensitive" } },
            { email: { contains: String(search), mode: "insensitive" } },
          ],
        }
      : {}),
    ...(role ? { role: String(role).toUpperCase() } : {}),
    ...(isSuspended !== undefined
      ? { isSuspended: isSuspended === "true" }
      : {}),
  };

  const [totalDocs, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const pagination = buildPagination(totalDocs, skip, take);

  return new ApiResponse(200, { docs: users, ...pagination }, getSuccessMessage("users")).send(res);
});

export const getUserbyId = asynHandler(async (req, res) => {
  const { id } = req.params;

  const userbyId = await prisma.user.findUnique({
    where: { id },
  });

  if (!userbyId) {
    throw new NotFoundError(getNotFoundMessage("user"));
  }

  return new ApiResponse(200, userbyId, getSuccessMessage("user")).send(res);
});

export const suspendUser = asynHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(getNotFoundMessage("user"));
    }

    if (user.isSuspended) {
      throw new ValidationError("User is already suspended");
    }

    return await prisma.user.update({
      where: { id },
      data: { isSuspended: true },
    });
  });

  return new ApiResponse(200, user, "User suspended successfully").send(res);
});

export const unsuspendUser = asynHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError(getNotFoundMessage("user"));
    }

    if (!user.isSuspended) {
      throw new ValidationError("User is not suspended");
    }

    return await prisma.user.update({
      where: { id },
      data: { isSuspended: false },
    });
  });

  return new ApiResponse(200, user, "User unsuspended successfully").send(res);
});
