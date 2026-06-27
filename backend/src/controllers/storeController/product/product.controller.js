import prisma from "../../../lib/prisma.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import slugify from "slugify";
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";
import {
  deleteFromCloudinary,
  uploadToCloudinaryMultiple,
} from "../../../utils/cloudinary.js";
import {
  buildPagination,
  generateSkuCode,
  getPagination,
} from "../../helpers.js";

export const getAllProducts = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { query } = req;
  const { take, skip } = getPagination(query);
  const { category, sort, inStock, lowStock, status, adminStatus } = query;

  const where = {
    store: {
      ownerId: id,
    },
    ...(category
      ? {
          category: {
            slug: String(category),
          },
        }
      : {}),
    ...(inStock
      ? {
          stock: {
            gt: 0,
          },
        }
      : lowStock
        ? {
            stock: {
              lte: 10,
            },
          }
        : {}),
    ...(status
      ? {
          status: String(status).toUpperCase(),
        }
      : {}),
    ...(adminStatus
      ? {
          adminStatus: String(adminStatus).toUpperCase(),
        }
      : {}),
  };

  const [productCount, products] = await prisma.$transaction([
    prisma.product.count({
      where: where,
    }),
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
        status: true,
        adminStatus: true,
        images: true,
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        isActive: true,
        variants: {
          select: {
            id: true,
            name: true,
          },
        },
        avgRating: true,
        lowStockAlert: true,
      },
      orderBy: sort
        ? { price: sort === "asc" ? "asc" : "desc" }
        : { createdAt: "desc" },
      take,
      skip,
    }),
  ]);

  const pagination = buildPagination(productCount, skip, take);

  return new ApiResponse(
    200,
    {
      docs: products,
      totalDocs: productCount,
      ...pagination,
    },
    "Products fetched successfully",
  ).send(res);
});

export const createProduct = asynHandler(async (req, res) => {
  const { id } = req.user;
  const {
    name,
    description,
    categoryId,
    variants,
    price,
    stock,
    costPrice,
    salePrice,
    unit,
    tags,
    status = "ACTIVE",
  } = req.body;
  const slug = slugify(name, { lower: true, strict: true, trim: true });
  const images = req.files?.images || [];

  if (images.length < 3) {
    throw new BadRequestError("At least 3 product images are required");
  }

  let parsedVariants = [];

  if (typeof variants === "string" && variants.trim()) {
    try {
      parsedVariants = JSON.parse(variants);
    } catch {
      throw new BadRequestError("Variants must be valid JSON");
    }
  } else if (Array.isArray(variants)) {
    parsedVariants = variants;
  }

  const parsedTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string" && tags.trim()
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  const existingProduct = await prisma.product.findFirst({
    where: {
      slug,
      store: {
        ownerId: id,
      },
    },
  });

  if (existingProduct) {
    throw new BadRequestError("Product with the same name already exists");
  }

  const storeCategory = await prisma.storeCategory.findFirst({
    where: {
      categoryId: categoryId,
      store: {
        ownerId: id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!storeCategory) {
    throw new NotFoundError("Category not found for the store");
  }

  const uploadedImages = await uploadToCloudinaryMultiple(images, {
    folder: "products",
    minFiles: 3,
    maxFiles: 5,
  });

  const imageUrls = uploadedImages.map(
    (image) => image.secureUrl || image.secure_url,
  );

  try {
    const product = await prisma.$transaction(async (tx) => {
      const store = await tx.store.findFirst({
        where: {
          ownerId: id,
        },
      });

      if (!store) {
        throw new NotFoundError("Store not found");
      }

      return await tx.product.create({
        data: {
          name,
          description,
          categoryId,
          slug,
          status: status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
          price: Number(price),
          stock: stock !== undefined ? Number(stock) : undefined,
          costPrice: costPrice !== undefined ? Number(costPrice) : undefined,
          salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
          tags: parsedTags,
          images: imageUrls,
          storeId: store.id,
          unit,
          variants: parsedVariants.length
            ? {
                create: parsedVariants.map((variant) => ({
                  name: variant.name,
                  price: Number(variant.price),
                  salePrice:
                    variant.salePrice !== undefined &&
                    variant.salePrice !== null
                      ? Number(variant.salePrice)
                      : undefined,
                  stock:
                    variant.stock !== undefined ? Number(variant.stock) : 0,
                  sku: variant.sku || undefined,
                  isActive: variant.isActive ?? true,
                })),
              }
            : undefined,
        },
        select: {
          name: true,
          id: true,
          status: true,
          stock: true,
          images: true,
          isActive: true,
          slug: true,
          adminStatus: true,
          category: {
            select: {
              name: true,
              id: true,
            },
          },
          avgRating: true,
          lowStockAlert: true,
        },
      });
    });

    return new ApiResponse(201, product, "Product created successfully").send(
      res,
    );
  } catch (error) {
    await Promise.allSettled(
      uploadedImages.map((image) =>
        deleteFromCloudinary(image.publicId || image.public_id, {
          resourceType: "image",
        }),
      ),
    );

    throw error;
  }
});

export const updateProduct = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { productId } = req.params;
  const {
    name,
    description,
    categoryId,
    unit,
    price,
    salePrice,
    costPrice,
    tags,
    weight,
  } = req.body;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      store: {
        ownerId: id,
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },

    data: {
      name,
      description,
      categoryId,
      unit,
      price: price !== undefined ? Number(price) : undefined,
      salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
      costPrice: costPrice !== undefined ? Number(costPrice) : undefined,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
        : undefined,
      weight: weight !== undefined ? Number(weight) : undefined,
    },
  });

  return new ApiResponse(
    200,
    updatedProduct,
    "Product updated successfully",
  ).send(res);
});

export const deleteProduct = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { productId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      store: {
        ownerId: id,
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  await prisma.product.delete({
    where: {
      id: product.id,
    },
  });

  await Promise.allSettled(
    product.images.map((image) =>
      deleteFromCloudinary(image, {
        resourceType: "image",
      }),
    ),
  );

  return new ApiResponse(200, null, "Product deleted successfully").send(res);
});

export const getProduct = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { slug } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      slug: {
        equals: slug,
        mode: "insensitive",
      },
      store: {
        ownerId: id,
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      description: true,
      barcode: true,
      stock: true,
      lowStockAlert: true,
      price: true,
      costPrice: true,
      salePrice: true,
      unit: true,
      variants: {
        select: {
          id: true,
          name: true,
          price: true,
          sku: true,
          stock: true,
        },
      },
      images: true,
      status: true,
      adminStatus: true,
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return new ApiResponse(200, product, "Product fetched successfully").send(
    res,
  );
});

export const toggleProductStatus = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { productId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      store: {
        ownerId: id,
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      isActive: !product.isActive,
    },
  });

  return new ApiResponse(
    200,
    updatedProduct,
    `Product ${updatedProduct.isActive ? "activated" : "deactivated"} successfully`,
  ).send(res);
});

export const addProductVariant = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { productId } = req.params;
  const { name, price, salePrice, stock } = req.body;

  const generatedSku = generateSkuCode(name);

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      store: {
        ownerId: id,
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const variant = await prisma.productVariant.create({
    data: {
      name,
      price: Number(price),
      salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
      stock: stock !== undefined ? Number(stock) : 0,
      sku: generatedSku,
      productId,
    },
  });

  return new ApiResponse(201, variant, "Variant added successfully").send(res);
});

export const updateProductVariant = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { productId, variantId } = req.params;
  const { name, price, salePrice, stock, sku } = req.body;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      store: {
        ownerId: id,
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) {
    throw new NotFoundError("Variant not found");
  }

  const updatedVariant = await prisma.productVariant.update({
    where: {
      id: variantId,
    },
    data: {
      name,
      price: price !== undefined ? Number(price) : undefined,
      salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      sku,
    },
  });

  return new ApiResponse(
    200,
    updatedVariant,
    "Variant updated successfully",
  ).send(res);
});

export const deleteProductVariant = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { productId, variantId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      store: {
        ownerId: id,
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) {
    throw new NotFoundError("Variant not found");
  }

  await prisma.productVariant.delete({
    where: {
      id: variantId,
    },
  });

  return new ApiResponse(200, null, "Variant deleted successfully").send(res);
});

export const toggleProductVariantStatus = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { productId, variantId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      store: {
        ownerId: id,
      },
    },
    select: {
      id: true,
      variants: {
        where: {
          id: variantId,
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const variant = product.variants[0];
  if (!variant) {
    throw new NotFoundError("Variant not found");
  }

  const updatedVariant = await prisma.productVariant.update({
    where: {
      id: variantId,
    },
    data: {
      isActive: !variant.isActive,
    },
  });

  return new ApiResponse(
    200,
    updatedVariant,
    `Variant ${updatedVariant.isActive ? "activated" : "deactivated"} successfully`,
  ).send(res);
});

export const getProductVariant = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { productId, variantId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      store: {
        ownerId: id,
      },
    },
    select: {
      id: true,
      lowStockAlert: true,
      variants: {
        where: {
          id: variantId,
        },
        select: {
          id: true,
          name: true,
          price: true,
          salePrice: true,
          stock: true,
          sku: true,
          isActive: true,
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) {
    throw new NotFoundError("Variant not found");
  }

  return new ApiResponse(200, variant, "Variant fetched successfully").send(
    res,
  );
});
