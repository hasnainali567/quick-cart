import { asynHandler } from "../../../utils/asyncHandler.js";
import { buildPagination, getPagination } from "../../helpers";
import prisma from "../../../lib/prisma.js";
import ApiResponse from "../../../utils/apiResponse.js";

export const getPublicCategories = asynHandler(async (req, res) => {
  const { skip, take } = getPagination(req.query);

  const [totalDocs, categories] = await prisma.$transaction([
    prisma.category.count({
      where: {
        isActive: true,
      },
    }),
    prisma.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        description: true,
        image: true,
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
                store: {
                  status: "OPEN",
                  partnerStatus: true,
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take,
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
    "Categories retrieved successfully"
  ).send(res);
});