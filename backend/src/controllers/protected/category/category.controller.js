import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { buildPagination, getPagination } from "../../helpers.js";

export const getAllCategories = asynHandler(async (req, res) => {
  const { skip, take } = getPagination(req.query);

  let filter = {};
  let store = null;

  if (req.user && req.user.role === "STORE_ADMIN") {
    store = await prisma.store.findUnique({
      where: { ownerId: req.user.id },
    });

    if (store) {
      filter = {
        NOT: {
          storeCategories: {
            some: {
              storeId: store.id,
            },
          },
        },
      };
    }
  }

  const [totalDocs, categories] = await prisma.$transaction([
    prisma.category.count({ where: filter }),
    prisma.category.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        image: true,
        description: true,
        sortOrder: true,
        isActive: true,
        _count: {
          select: {
            products: {
              where: { ...((store && { storeId: store.id }) || {}) },
            },
          },
        },
      },
    }),
  ]);

  const paginated = buildPagination(totalDocs, skip, take);

  return new ApiResponse(
    200,
    {
      docs: categories,
      ...paginated,
      totalDocs,
    },
    "Categories retrieved successfully",
  ).send(res);
});
