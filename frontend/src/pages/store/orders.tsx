import { useState } from "react";
import Table from "@/components/global/Table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetStoreOrders } from "@/hooks/use-query";
import type { TableColumn } from "@/types";
import { Badge } from "@/components/ui/badge";
import OrderSheet from "@/components/store/global/OrderSheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { StoreOrder, OrderStatus } from "@/types/order.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Orders = () => {
  const [skip, setSkip] = useState(0);
  const [take] = useState(20);
  const [selectedOrderId, setSelectedOrderId] = useState<
    StoreOrder["id"] | null
  >(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  const { data, isLoading } = useGetStoreOrders({ skip, take });

  const orderStatuses: (OrderStatus | "ALL")[] = [
    "ALL",
    "PENDING",
    "APPROVED",
    "PREPARING",
    "PREPARED",
    "DRIVER_ASSIGNED",
    "HEADING_TO_STORE",
    "REJECTED",
  ];

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-500",
      APPROVED: "bg-blue-500/10 text-blue-500",
      PREPARING: "bg-purple-500/10 text-purple-500",
      PREPARED: "bg-green-500/10 text-green-500",
      DRIVER_ASSIGNED: "bg-indigo-500/10 text-indigo-500",
      HEADING_TO_STORE: "bg-cyan-500/10 text-cyan-500",
      REJECTED: "bg-red-500/10 text-red-500",
    };
    return colors[status] || "";
  };

  const filteredOrders = data?.orders?.filter((order) => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: TableColumn<StoreOrder>[] = [
    {
      key: "orderId",
      title: "Order ID",
      render: (row) => (
        <span className="font-mono text-xs">#O-{row.id.slice(0, 8)}</span>
      ),
    },
    {
      key: "customer",
      title: "Customer",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={row.customer.image ?? ""} />
            <AvatarFallback>
              {row.customer.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{row.customer.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.customer.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "items",
      title: "Items",
      render: (row) => (
        <span className="text-sm">{row.items?.length} item(s)</span>
      ),
    },
    {
      key: "datePlaced",
      title: "Date Placed",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(row.createdAt).toLocaleTimeString()}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "total",
      title: "Total",
      render: (row) => (
        <span className="font-semibold">PKR {row.total.toFixed(2)}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <Button
          onClick={() => {
            setSelectedOrderId(row.id);
            setSheetOpen(true);
          }}
          size="sm"
        >
          View Details
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Orders Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage and track all your store orders
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Search}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search by customer name, email, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as OrderStatus | "ALL")
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {orderStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "ALL" ? "All Orders" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            {filteredOrders && filteredOrders.length > 0 ? (
              <Table<StoreOrder> columns={columns} data={filteredOrders} />
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <p className="text-lg font-medium">No orders found</p>
                <p className="text-sm">
                  {searchQuery || statusFilter !== "ALL"
                    ? "Try adjusting your filters"
                    : "Orders will appear here once customers place them"}
                </p>
              </div>
            )}
          </div>

          {data && data.total > take && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {skip + 1} to {Math.min(skip + take, data.total)} of{" "}
                {data.total} orders
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSkip(Math.max(0, skip - take))}
                  disabled={skip === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSkip(skip + take)}
                  disabled={skip + take >= data.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrderId && (
        <OrderSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          orderId={selectedOrderId}
        />
      )}
    </div>
  );
};

export default Orders;
