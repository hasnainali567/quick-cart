import Sheet from "@/components/global/Sheet";
import OrderSheetSkeleton from "../Skeletons/OrderSheetSkeleton";
import type { StoreOrder } from "@/types/order.types";
import { useOrderSheet } from "@/features/order/hooks/useOrderSheet";
import OrderCustomerInfo from "@/features/order/components/OrderCustomerInfo";
import OrderAddressInfo from "@/features/order/components/OrderAddressInfo";
import OrderItemsList from "@/features/order/components/OrderItemsList";
import OrderTotals from "@/features/order/components/OrderTotals";
import OrderActions from "@/features/order/components/OrderActions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: StoreOrder["id"];
};

const OrderSheet = ({ open, onOpenChange, orderId }: SheetProps) => {
  const {
    order,
    isLoading,
    isAccepting,
    isRejecting,
    isMarkingPrepared,
    handleAccept,
    handleReject,
    handleMarkPrepared,
  } = useOrderSheet(orderId, () => onOpenChange(false));

  const getStatusColor = (status: StoreOrder["status"]) => {
    const colors: Record<StoreOrder["status"], string> = {
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

  return (
    <Sheet
      data={order}
      open={open}
      onOpenChange={onOpenChange}
      title={
        isLoading ? "" : (
          <div className="flex items-center gap-2">
            <span>Order #{order?.id.slice(0, 8)}</span>
            {order && (
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            )}
          </div>
        )
      }
      description={
        order
          ? `Placed on ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString()}`
          : "Order details"
      }
    >
      {(order) => {
        if (isLoading) return <OrderSheetSkeleton />;
        if (!order) return null;

        return (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-32 scrollbar-none">
              <OrderCustomerInfo customer={order.customer} />

              <Separator />

              <OrderAddressInfo address={order.address} />

              <Separator />

              <OrderItemsList items={order.items} />

              <Separator />

              <OrderTotals
                subtotal={order.subtotal}
                total={order.total}
                promoCode={order.promoCode}
                promoDiscount={order.promoDiscount}
              />
            </div>

            <OrderActions
              orderId={order.id}
              status={order.status}
              onAccept={handleAccept}
              onReject={handleReject}
              onMarkPrepared={handleMarkPrepared}
              isAccepting={isAccepting}
              isRejecting={isRejecting}
              isMarkingPrepared={isMarkingPrepared}
            />
          </div>
        );
      }}
    </Sheet>
  );
};

export default OrderSheet;
