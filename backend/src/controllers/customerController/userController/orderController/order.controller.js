import prisma from "../../../../lib/prisma.js";
import ApiResponse from "../../../../utils/apiResponse.js";
import { asyncHandler } from "../../../../utils/asyncHandler.js";
import { uploadToCloudinary } from "../../../../utils/cloudinary.js";
import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../../../utils/errors.js";
import notify from "../../../../utils/notify.js";
import { getIO } from "../../../../utils/socket.js";
import { getNotFoundMessage } from "../../../helpers.js";

export const getUserOrders = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const orders = await prisma.order.findMany({
    where: { customerId: id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      subtotal: true,
      deliveryFee: true,
      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
          unitPrice: true,
          totalPrice: true,
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      address: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  return new ApiResponse(200, orders, "Orders retrieved successfully").send(
    res,
  );
});

export const placeOrder = asyncHandler(async (req, res) => {
  const { id: customerId, name } = req.user;
  const {
    cartItemsIds,
    addressId,
    storeId,
    paymentMethod = "CASH_ON_DELIVERY",
  } = req.body;

  // ─── VALIDATION ───
  if (
    !cartItemsIds ||
    !Array.isArray(cartItemsIds) ||
    cartItemsIds.length < 1
  ) {
    throw new ValidationError("Cart items are required");
  }

  if (!storeId) {
    throw new ValidationError("Store ID is required");
  }

  if (!paymentMethod) {
    throw new ValidationError("Payment method is required");
  }

  // ─── FETCH STORE (with delivery fee) ───
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: {
      id: true,
      name: true,
      deliveryFee: true,
      freeDeliveryAbove: true,
      status: true,
      ownerId: true,
    },
  });

  if (!store) {
    throw new NotFoundError(getNotFoundMessage("Store"));
  }

  if (store.status !== "OPEN") {
    throw new ValidationError("Store is currently closed");
  }

  // ─── RESOLVE ADDRESS ───
  let finalAddressId = addressId;

  if (!addressId) {
    const defaultAddress = await prisma.address.findFirst({
      where: {
        userId: customerId,
        isDefault: true,
      },
      select: { id: true },
    });

    if (!defaultAddress) {
      throw new NotFoundError(
        "No default address found. Please provide an address",
      );
    }

    finalAddressId = defaultAddress.id;
  } else {
    // Validate address belongs to user
    const address = await prisma.address.findUnique({
      where: { id: finalAddressId },
      select: { userId: true },
    });

    if (!address || address.userId !== customerId) {
      throw new ValidationError("Address not found or does not belong to you");
    }
  }

  // ─── FETCH CART ITEMS WITH PRODUCTS (Optimized: single query) ───
  const cartItems = await prisma.cartItem.findMany({
    where: {
      id: { in: cartItemsIds },
      cart: { userId: customerId },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          storeId: true,
          price: true,
          salePrice: true,
          images: true,
        },
      },
      variant: {
        select: {
          id: true,
          name: true,
          price: true,
          salePrice: true,
        },
      },
    },
  });

  if (cartItems.length === 0) {
    throw new NotFoundError("No valid cart items found");
  }

  // Verify all items belong to the same store
  if (!cartItems.every((item) => item.product.storeId === storeId)) {
    throw new ValidationError("All cart items must belong to the same store");
  }

  // ─── CALCULATE ORDER TOTALS ───
  let subtotal = 0;
  let totalDiscount = 0;

  const orderItems = cartItems.map((cartItem) => {
    // Determine price: use variant price if exists, otherwise product price
    const unitPrice = cartItem.variant?.price || cartItem.product.price;
    const salePriceValue =
      cartItem.variant?.salePrice || cartItem.product.salePrice;

    // Calculate discount per item if on sale
    const priceForCalculation = salePriceValue || unitPrice;
    const itemDiscount = salePriceValue
      ? (unitPrice - salePriceValue) * cartItem.quantity
      : 0;

    const itemTotal = priceForCalculation * cartItem.quantity;
    subtotal += itemTotal;
    totalDiscount += itemDiscount;

    return {
      cartItem,
      unitPrice: priceForCalculation,
      itemTotal,
    };
  });

  // Calculate delivery fee
  let deliveryFee = store.deliveryFee;
  if (store.freeDeliveryAbove && subtotal >= store.freeDeliveryAbove) {
    deliveryFee = 0;
  }

  const total = subtotal + deliveryFee;

  // ─── CREATE ORDER IN TRANSACTION ───
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        customerId,
        storeId,
        addressId: finalAddressId,
        subtotal,
        deliveryFee,
        discount: totalDiscount,
        total,
        paymentMethod,
        paymentStatus: "PENDING",
        status: "PENDING",
        items: {
          create: orderItems.map((item) => ({
            productId: item.cartItem.product.id,
            variantId: item.cartItem.variantId,
            name: item.cartItem.product.name,
            image: item.cartItem.product.images?.[0],
            quantity: item.cartItem.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.itemTotal,
          })),
        },
      },
      include: {
        items: {
          select: {
            id: true,
            name: true,
            image: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            product: {
              select: {
                id: true,
                images: true,
              },
            },
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        address: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            addressLine1: true,
            area: true,
            city: true,
          },
        },
      },
    });

    // Delete cart items
    await tx.cartItem.deleteMany({
      where: { id: { in: cartItemsIds } },
    });

    return newOrder;
  });

   notify({
    to: `store:${storeId}`,
    userId: store.ownerId,
    data: {
      type: "ORDER_PLACED",
      title: "🔔 New Order",
      body: `New order from ${name} - ${order.items.length} item(s) totaling $${order.total.toFixed(2)}`,
    },
  });

  return new ApiResponse(201, order, "Order placed successfully").send(res);
});
