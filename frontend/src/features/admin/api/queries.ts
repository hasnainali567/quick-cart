import { getRequest } from "@/api/requests";

export type DashboardStats = {
  stats: {
    totalUsers: number;
    totalStores: number;
    totalProducts: number;
    totalDrivers: number;
    totalOrders: number;
    pendingProducts: number;
    pendingStores: number;
    activeDrivers: number;
    pendingWithdrawals: number;
    usersToday: number;
    ordersToday: number;
    totalRevenue: number;
  };
  orderStatusBreakdown: {
    status: string;
    count: number;
  }[];
  revenueByDay: {
    date: string;
    orders: number;
  }[];
  recentUsers: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    createdAt: string;
  }[];
  recentStores: {
    id: string;
    name: string;
    slug: string;
    partnerStatus: string;
    isVerified: boolean;
    createdAt: string;
    totalRevenue: number;
    totalOrders: number;
    owner: { name: string; email: string };
  }[];
  recentOrders: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    customer: { name: string };
    store: { name: string };
  }[];
  topStores: {
    id: string;
    name: string;
    slug: string;
    totalRevenue: number;
    totalOrders: number;
    avgRating: number;
  }[];
};

export const getAdminDashboard = async () => {
  const res = await getRequest<DashboardStats>({
    url: "/admin/dashboard",
  });
  return res;
};
