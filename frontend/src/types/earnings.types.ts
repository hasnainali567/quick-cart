export type DailyEarning = {
  date: string;
  revenue: number;
  orders: number;
};

export type CategoryEarning = {
  category: string;
  revenue: number;
  percentage: number;
};

export type Transaction = {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  commission: number;
  netEarning: number;
  date: string;
  status: string;
};

export type EarningsStats = {
  totalRevenue: number;
  weeklyRevenue: number;
  commissionPaid: number;
  netEarnings: number;
  weeklyChange: number;
  commissionPercent: number;
};

export type EarningsResponse = {
  stats: EarningsStats;
  dailyEarnings: DailyEarning[];
  categoryEarnings: CategoryEarning[];
  recentTransactions: Transaction[];
};

export type EarningsTimeRange = "7d" | "30d" | "90d" | "1y";
