import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEarningsPage } from "@/features/earnings/hooks/useEarningsPage";
import type { Transaction } from "@/types/earnings.types";

const Earnings = () => {
  const { earnings, isLoading, timeRange, setTimeRange } = useEarningsPage();

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        <Skeleton className="w-full h-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="w-full h-96" />
          <Skeleton className="w-full h-96" />
        </div>
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="flex-1 p-4">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No earnings data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `PKR ${earnings.stats.totalRevenue.toLocaleString()}`,
      change: `${earnings.stats.weeklyChange > 0 ? "+" : ""}${earnings.stats.weeklyChange.toFixed(1)}%`,
      trend: earnings.stats.weeklyChange >= 0 ? "up" : "down",
      icon: DollarCircleIcon,
    },
    {
      label: "This Week",
      value: `PKR ${earnings.stats.weeklyRevenue.toLocaleString()}`,
      change: `${earnings.stats.weeklyChange > 0 ? "+" : ""}${earnings.stats.weeklyChange.toFixed(1)}%`,
      trend: earnings.stats.weeklyChange >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      label: "Commission Paid",
      value: `PKR ${earnings.stats.commissionPaid.toLocaleString()}`,
      change: `${earnings.stats.commissionPercent}%`,
      trend: "down",
      icon: TrendingDown,
    },
    {
      label: "Net Earnings",
      value: `PKR ${earnings.stats.netEarnings.toLocaleString()}`,
      change: `${earnings.stats.weeklyChange > 0 ? "+" : ""}${earnings.stats.weeklyChange.toFixed(1)}%`,
      trend: earnings.stats.weeklyChange >= 0 ? "up" : "down",
      icon: DollarCircleIcon,
    },
  ];

  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Earnings</h1>
          <p className="text-muted-foreground">
            Track your revenue and financial performance
          </p>
        </div>
        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as typeof timeRange)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <HugeiconsIcon
                  icon={stat.icon}
                  className="text-muted-foreground"
                  size={20}
                />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1">
                  <HugeiconsIcon
                    icon={stat.trend === "up" ? TrendingUp : TrendingDown}
                    className={
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }
                    size={16}
                  />
                  <span
                    className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Daily revenue for the past week
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={earnings.dailyEarnings}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <p className="text-sm text-muted-foreground">
              Top performing categories
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={earnings.categoryEarnings} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest completed orders and earnings
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earnings.recentTransactions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <p className="font-medium">{transaction.orderId}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.customer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-lg">
                    PKR {transaction.netEarning.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Order: PKR {transaction.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Commission: PKR {transaction.commission}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;
