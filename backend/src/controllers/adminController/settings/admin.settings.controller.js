import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { NotFoundError } from "../../../utils/errors.js";
import { getSuccessMessage, getNotFoundMessage } from "../../helpers.js";

export const getPlatformSettings = asynHandler(async (req, res) => {
  const settings = await prisma.platformSetting.findMany({
    orderBy: { key: "asc" },
  });

  return new ApiResponse(200, settings, getSuccessMessage("settings")).send(res);
});

export const getPlatformSetting = asynHandler(async (req, res) => {
  const { key } = req.params;

  const setting = await prisma.platformSetting.findUnique({
    where: { key },
  });

  if (!setting) {
    throw new NotFoundError(getNotFoundMessage("setting"));
  }

  return new ApiResponse(200, setting, getSuccessMessage("setting")).send(res);
});

export const updatePlatformSetting = asynHandler(async (req, res) => {
  const { key } = req.params;
  const { value, description } = req.body;

  const existing = await prisma.platformSetting.findUnique({
    where: { key },
  });

  if (!existing) {
    throw new NotFoundError(getNotFoundMessage("setting"));
  }

  const setting = await prisma.platformSetting.update({
    where: { key },
    data: {
      value,
      description: description ?? existing.description,
    },
  });

  return new ApiResponse(200, setting, "Setting updated successfully").send(res);
});

export const createPlatformSetting = asynHandler(async (req, res) => {
  const { key, value, description } = req.body;

  const existing = await prisma.platformSetting.findUnique({
    where: { key },
  });

  if (existing) {
    return new ApiResponse(400, null, "Setting with this key already exists").send(res);
  }

  const setting = await prisma.platformSetting.create({
    data: {
      key,
      value,
      description,
    },
  });

  return new ApiResponse(201, setting, "Setting created successfully").send(res);
});

export const deletePlatformSetting = asynHandler(async (req, res) => {
  const { key } = req.params;

  const setting = await prisma.platformSetting.delete({
    where: { key },
  });

  return new ApiResponse(200, setting, "Setting deleted successfully").send(res);
});

export const bulkUpdatePlatformSettings = asynHandler(async (req, res) => {
  const { settings } = req.body;

  if (!Array.isArray(settings)) {
    return new ApiResponse(400, null, "Settings must be an array").send(res);
  }

  const results = await Promise.all(
    settings.map((s) =>
      prisma.platformSetting.upsert({
        where: { key: s.key },
        update: { value: s.value, description: s.description },
        create: { key: s.key, value: s.value, description: s.description },
      })
    )
  );

  return new ApiResponse(200, results, "Settings updated successfully").send(res);
});