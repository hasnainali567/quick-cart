import prisma from "../../../lib/prisma.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/apiResponse.js";

export const getStoreEarnings = asynHandler(async (req, res) => {
  const { id } = req.user;
  const { range = "30d" } = req.query;

  // Calculate date range
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(now.getDate() - 90);
      break;
    case "1y":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  // Get store
  const store = await prisma.store.findFirst({
    where: { ownerId: id },
    select: { id: true, commissionPercent: true },
  });

  if (!store) {
    return new ApiResponse(200, {
      stats: {
        totalRevenue: 0,
        weeklyRevenue: 0,
        commissionPaid: 0,
        netEarnings: 0,
        weeklyChange: 0,
        commissionPercent: 0,
      },
      dailyEarnings: [],
      categoryEarnings: [],
      recentTransactions: [],
    }, "No store found").send(res);
  }

  // Get completed orders in date range
  const orders = await prisma.order.findMany({
    where: {
      storeId: store.id,
      status: { in: ["PREPARED", "DRIVER_ASSIGNED", "HEADING_TO_STORE", "DELIVERED"] },
      createdAt: { gte: startDate },
    },
    select: {
      id: true,
      total: true,
      subtotal: true,
      createdAt: true,
      customer: {
        select: {
          name: true,
        },
      },
      items: {
        select: {
          product: {
            select: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
          totalPrice: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const commissionPaid = totalRevenue * (store.commissionPercent / 100);
  const netEarnings = totalRevenue - commissionPaid;

  // Calculate weekly revenue
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);
  const weeklyOrders = orders.filter((o) => o.createdAt >= weekAgo);
  const weeklyRevenue = weeklyOrders.reduce((sum, order) => sum + order.total, 0);

  // Calculate previous week for comparison
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(now.getDate() - 14);
  const previousWeekOrders = orders.filter(
    (o) => o.createdAt >= twoWeeksAgo && o.createdAt < weekAgo
  );
  const previousWeekRevenue = previousWeekOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const weeklyChange =
    previousWeekRevenue > 0
      ? ((weeklyRevenue - previousWeekRevenue) / previousWeekRevenue) * 100
      : 0;

  // Calculate daily earnings
  const dailyMap = new Map();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    dailyMap.set(dateKey, { date: dateKey, revenue: 0, orders: 0 });
  }

  orders.forEach((order) => {
    const dateKey = order.createdAt.toISOString().split("T")[0];
    if (dailyMap.has(dateKey)) {
      const day = dailyMap.get(dateKey);
      day.revenue += order.total;
      day.orders += 1;
    }
  });

  const dailyEarnings = Array.from(dailyMap.values());

  // Calculate category earnings
  const categoryMap = new Map();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const categoryName = item.product?.category?.name || "Other";
      const current = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, current + item.totalPrice);
    });
  });

  const categoryEarnings = Array.from(categoryMap.entries())
    .map(([category, revenue]) => ({
      category,
      revenue,
      percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Recent transactions
  const recentTransactions = orders.slice(0, 10).map((order) => ({
    id: order.id,
    orderId: order.id,
    customer: order.customer.name,
    amount: order.total,
    commission: order.total * (store.commissionPercent / 100),
    netEarning: order.total * (1 - store.commissionPercent / 100),
    date: order.createdAt.toISOString(),
    status: "completed",
  }));

  return new ApiResponse(
    200,
    {
      stats: {
        totalRevenue,
        weeklyRevenue,
        commissionPaid,
        netEarnings,
        weeklyChange,
        commissionPercent: store.commissionPercent,
      },
      dailyEarnings,
      categoryEarnings,
      recentTransactions,
    },
    "Earnings fetched successfully"
  ).send(res);
});
