import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/global/StatCard";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetAdminDashboard from "@/features/admin/hooks/useGetAdminDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ORDER_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PREPARING: "#8b5cf6",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
  REJECTED: "#ef4444",
  DRIVER_ASSIGNED: "#06b6d4",
  PICKED_UP: "#14b8a6",
  OUT_FOR_DELIVERY: "#0ea5e9",
};

const Dashboard = () => {
  const { data, isPending } = useGetAdminDashboard();

  if (isPending) return null;
  if (!data) return null;

  const { stats, orderStatusBreakdown, revenueByDay, recentUsers, recentStores, recentOrders, topStores } = data;

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Platform overview &amp; key metrics
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatCard label="Total Revenue" value={`PKR ${stats.totalRevenue.toLocaleString()}`} title="Platform earnings" description="Net from all stores" />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString()} title={`${stats.ordersToday} today`} description="All time orders" />
        <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} title={`${stats.usersToday} joined today`} description="Registered accounts" />
        <StatCard label="Total Stores" value={stats.totalStores.toLocaleString()} title={stats.pendingStores > 0 ? `${stats.pendingStores} pending` : "All approved"} description="Store partners" />
        <StatCard label="Total Products" value={stats.totalProducts.toLocaleString()} title={stats.pendingProducts > 0 ? `${stats.pendingProducts} pending review` : "All approved"} description="Across all stores" />
        <StatCard label="Total Drivers" value={stats.totalDrivers.toLocaleString()} title={`${stats.activeDrivers} active`} description="Delivery partners" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Orders This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByDay}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusBreakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {orderStatusBreakdown.map((entry) => (
                      <Cell key={entry.status} fill={ORDER_COLORS[entry.status] || "#6b7280"} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    formatter={(value) => (
                      <span className="text-xs capitalize">{value.replace(/_/g, " ").toLowerCase()}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.store.name} &middot; PKR {order.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={order.status === "DELIVERED" ? "default" : order.status === "CANCELLED" || order.status === "REJECTED" ? "destructive" : "default"}
                    className="text-[10px] capitalize"
                  >
                    {order.status.replace(/_/g, " ").toLowerCase()}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No orders yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top Stores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Stores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topStores.map((store, i) => (
              <div key={store.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{store.name}</p>
                  <p className="text-xs text-muted-foreground">
                    PKR {store.totalRevenue.toLocaleString()} &middot; {store.totalOrders} orders
                  </p>
                </div>
                <Badge variant={store.avgRating >= 4 ? "default" : "destructive"} className="text-[11px]">
                  {store.avgRating.toFixed(1)}
                </Badge>
              </div>
            ))}
            {topStores.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No stores yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="text-xs">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge className="text-[11px]">
                  {user.role === "SUPER_ADMIN" ? "Admin" : user.role === "STORE_ADMIN" ? "Store" : "Customer"}
                </Badge>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No users yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Stores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Stores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentStores.map((store) => (
              <div key={store.id} className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {store.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{store.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {store.owner.name} &middot; PKR {store.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <Badge
                  variant={
                    store.partnerStatus === "REJECTED" || store.partnerStatus === "SUSPENDED"
                      ? "destructive"
                      : "default"
                  }
                  className="text-[11px]"
                >
                  {store.partnerStatus}
                </Badge>
              </div>
            ))}
            {recentStores.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No stores yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
