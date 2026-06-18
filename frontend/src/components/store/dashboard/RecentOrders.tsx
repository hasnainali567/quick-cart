import Table from "@/components/global/Table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStoreOrders } from "@/hooks/use-query";
import type { TableColumn } from "@/types";
import { Dots, Edit, Eye, Trash } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import OrderSheet from "@/components/store/global/OrderSheet";
import Dropdown from "@/components/global/dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import type { StoreOrder } from "@/types/order.types";

const RecentOrders = () => {
  const { data, isLoading } = useGetStoreOrders({ skip: 0, take: 10 });
  const [selectedOrderId, setSelectedOrderId] = useState<
    StoreOrder["id"] | null
  >(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const columns: TableColumn<StoreOrder>[] = [
    {
      key: "orderId",
      title: "Order ID.",
      render: (row) => `#O-${row.id.slice(1, 10)}...`,
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
          <div className="flex flex-col ">
            <span className="text-sm">{row.customer.name}</span>
            <span className="text-xs">{row.customer.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "datePlaced",
      title: "Date Placed",
      render: (row) =>
        `${new Date(row.createdAt).toLocaleDateString()} ${new Date(row.createdAt).toLocaleTimeString()}`,
    },
    {
      key: "status",
      title: "Status",
      render: (row) => <Badge>{row.status}</Badge>,
    },
    {
      key: "total",
      title: "Sub total",
      render: (row) => `PKR ${row.total.toFixed(2)}`,
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center justify-start gap-2 ">
          <Button
            onClick={() => {
              setSelectedOrderId(row.id);
              setSheetOpen(true);
            }}
            size={"sm"}
          >
            View
          </Button>
          <Dropdown
            trigger={
              <Button onClick={() => {}} variant={"ghost"}>
                <HugeiconsIcon icon={Dots} size={20} />
              </Button>
            }
            align="start"
            items={[
              {
                label: "View",
                icon: Eye,
                onClick: () => {
                  setSheetOpen(true);
                  setSelectedOrderId(row.id);
                },
              },
              {
                label: "Edit",
                icon: Edit,
                onClick: () => {},
              },
              {
                label: "Delete",
                icon: Trash,
                onClick: () => {},
              },
            ]}
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Skeleton className="w-full h-80" />;
  }

  if (!data) {
    return <div>No orders found</div>;
  }

  if (data?.orders?.length === 0) {
    return <div>No orders found</div>;
  }

  return (
    <>
      <Card className="min-h-full h-fit overflow-y-auto relative pt-0 scrollbar-none">
        <CardHeader className="sticky top-0 bg-accent py-4 z-10 flex items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link to={"/store/orders"} className="underline">
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <Table<StoreOrder> columns={columns} data={data?.orders ?? []} />{" "}
        </CardContent>
      </Card>

      {selectedOrderId && (
        <OrderSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          orderId={selectedOrderId}
        />
      )}
    </>
  );
};

export default RecentOrders;
