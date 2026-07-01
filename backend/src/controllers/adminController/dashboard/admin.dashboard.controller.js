import prisma from "../../../lib/prisma.js";
import { asynHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/apiResponse.js";

export const getDashboardStats = asynHandler(async (req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(todayStart.getTime() - 7 * 86400000);

  const [
    totalUsers,
    totalStores,
    totalProducts,
    totalDrivers,
    totalOrders,
    pendingProducts,
    pendingStores,
    activeDrivers,
    usersToday,
    ordersToday,
    pendingWithdrawals,
    revenueResult,
    ordersByStatus,
    recentUsers,
    recentStores,
    recentOrders,
    topStores,
    revenueByDay,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.product.count(),
    prisma.driver.count(),
    prisma.order.count(),
    prisma.product.count({ where: { adminStatus: "PENDING" } }),
    prisma.store.count({ where: { partnerStatus: "PENDING" } }),
    prisma.driver.count({ where: { approvalStatus: "APPROVED" } }),
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.withdrawal.count({ where: { status: "PENDING" } }),
    prisma.storeEarning.aggregate({ _sum: { netAmount: true } }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
    }),
    prisma.store.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, slug: true, partnerStatus: true,
        isVerified: true, createdAt: true, totalRevenue: true, totalOrders: true,
        owner: { select: { name: true, email: true } },
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, status: true, total: true, createdAt: true,
        customer: { select: { name: true } },
        store: { select: { name: true } },
      },
    }),
    prisma.store.findMany({
      take: 5,
      orderBy: { totalRevenue: "desc" },
      select: { id: true, name: true, slug: true, totalRevenue: true, totalOrders: true, avgRating: true },
    }),
    Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const dayStart = new Date(todayStart.getTime() - (6 - i) * 86400000);
        const dayEnd = new Date(dayStart.getTime() + 86400000);
        return prisma.order.count({
          where: { createdAt: { gte: dayStart, lt: dayEnd } },
        });
      }),
    ),
  ]);

  const data = {
    stats: {
      totalUsers,
      totalStores,
      totalProducts,
      totalDrivers,
      totalOrders,
      pendingProducts,
      pendingStores,
      activeDrivers,
      pendingWithdrawals,
      usersToday,
      ordersToday,
      totalRevenue: revenueResult._sum.netAmount || 0,
    },
    orderStatusBreakdown: ordersByStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    revenueByDay: revenueByDay.map((count, i) => {
      const d = new Date(todayStart.getTime() - (6 - i) * 86400000);
      return { date: d.toISOString().slice(0, 10), orders: count };
    }),
    recentUsers,
    recentStores,
    recentOrders,
    topStores,
  };

  return new ApiResponse(200, data, "Dashboard stats fetched successfully").send(res);
});
