import prisma from "../../../lib/prisma.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import slugify from "slugify";
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";
import {
  deleteFromCloudinary,
  uploadToCloudinaryMultiple,
} from "../../../utils/cloudinary.js";
import { generateSkuCode, getPagination } from "../../helpers.js";
import notify from "../../../utils/notify.js";

export const getCategories = asynHandler(async (req, res) => {
  const { id } = req.user;

  const store = await prisma.store.findUnique({
    where: { ownerId: id },
  });

  if (!store) {
    return new NotFoundError("Store not found");
  }

  const categories = await prisma.storeCategory.findMany({
    where: { storeId: store.id },
    select: {
      id: true,
      category: {
        select: {
          name: true,
          id: true,
          icon: true,
          isActive: true,
        },
      },
    },
  });

  return new ApiResponse(
    200,
    categories,
    "store categories retrieved successfully",
  ).send(res);
});

export const addCategorytoStore = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { categoryId } = req.params;

  const store = await prisma.store.findUnique({
    where: {
      ownerId: id,
    },
    select: {
      id: true,
    },
  });

  if (!store) {
    throw new NotFoundError("Store not found");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  const storeCategory = await prisma.storeCategory.create({
    data: {
      storeId: store.id,
      categoryId: category.id,
    },
  });

  return new ApiResponse(
    201,
    storeCategory,
    "category successfully added to the store",
  ).send(res);
});
