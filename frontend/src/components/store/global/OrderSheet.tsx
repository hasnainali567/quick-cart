import Sheet from "@/components/global/Sheet";
import { useGetStoreOrdersById } from "@/hooks/use-query";
import type { StoreOrder } from "@/types/store.types";
import OrderSheetSkeleton from "../Skeletons/OrderSheetSkeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Avatar from "@/components/global/Avatar";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail, Truck } from "@hugeicons/core-free-icons";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: StoreOrder["id"];
};

const OrderSheet = ({ open, onOpenChange, orderId }: SheetProps) => {
  const { data: order, isLoading } = useGetStoreOrdersById(orderId);
  console.log(order, orderId);

  return (
    <Sheet
      data={order}
      open={open}
      onOpenChange={onOpenChange}
      title={isLoading ? "" : `#Order-${order?.id.slice(1, 10)}...`}
      description="Order details"
    >
      {(order) => {
        if (isLoading) return <OrderSheetSkeleton />;
        if (order) {
          return (
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-28 scrollbar-none">
                <div className="space-y-2">
                  <Label className="uppercase text-muted-foreground">
                    customer information
                  </Label>
                  <Card>
                    <CardContent className={cn("flex  gap-2")}>
                      <Avatar
                        src={order.customer.image ?? ""}
                        fallback={order.customer.name.charAt(0).toUpperCase()}
                      />
                      <div className="">
                        <h5 className="text-lg font-medium">
                          {order.customer.name}
                        </h5>
                        <span className="flex gap-1 items-center text-muted-foreground">
                          <HugeiconsIcon icon={Mail} size={16} />
                          {order.customer.email}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className={cn("flex flex-col ")}>
                      <Label className="uppercase text-muted-foreground pb-2">
                        <HugeiconsIcon icon={Truck} size={16} />
                        shipping address
                      </Label>
                      <p>Address : {order.address.addressLine1}</p>
                      <p>City : {order.address.city}</p>
                      <p>Country : {order.address.country}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="sticky bottom-0 w-full flex flex-col gap-2 p-4">
                <Button className="w-full">Appect Order</Button>
                <Button
                  disabled={order.status !== "PENDING"}
                  className="w-full"
                  variant={"outline"}
                  onClick={order.status === "PENDING" ? () => {} : () => {}}
                >
                  Reject Order
                </Button>
              </div>
            </div>
          );
        }
      }}
    </Sheet>
  );
};

export default OrderSheet;
