import { asynHandler } from "../../../utils/asyncHandler.js";
import { buildPagination, getPagination } from "../../helpers";
import prisma from "../../../lib/prisma.js";
import { getBoundingBox } from "../../../utils/geo.js";
import ApiResponse from "../../../utils/apiResponse.js";

export const getPublicProducts = asynHandler(async (req, res) => {
  const { skip, take } = getPagination(req.query);
  const { lat, lng, radius = 10 } = req.query; // Default 10km radius

  // If location is provided, filter by nearby stores
  let whereClause = {};
  if (lat && lng) {
    const { minLat, maxLat, minLng, maxLng } = getBoundingBox(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
    );

    // Get store IDs within bounding box that are open and approved
    const nearbyStores = await prisma.store.findMany({
      where: {
        latitude: {
          gte: minLat,
          lte: maxLat,
        },
        longitude: {
          gte: minLng,
          lte: maxLng,
        },
        status: "OPEN",
        partnerStatus: true,
      },
      select: {
        id: true,
      },
    });

    const nearbyStoreIds = nearbyStores.map((store) => store.id);

    // If no nearby stores, return empty results
    if (nearbyStoreIds.length === 0) {
      const paginated = buildPagination(0, skip, take);
      return new ApiResponse(
        200,
        {
          docs: [],
          ...paginated,
          totalDocs: 0,
        },
        "Products retrieved successfully",
      ).send(res);
    }

    // Filter products to only those from nearby stores
    whereClause = {
      storeId: {
        in: nearbyStoreIds,
      },
    };
  }

  const [totalDocs, products] = await prisma.$transaction([
    prisma.product.count({ where: whereClause }),
    prisma.product.findMany({
      where: whereClause,
      skip,
      take,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        discountedPrice: true,
        images: true,
        imagesAlt: true,
        isActive: true,
        _count: {
          select: {
            reviews: {
              where: { isActive: true },
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
      docs: products,
      ...paginated,
      totalDocs,
    },
    "Products retrieved successfully",
  ).send(res);
});
