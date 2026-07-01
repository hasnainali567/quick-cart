import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingBag } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { StoreOrder } from "@/types/order.types";

type Props = {
  items: StoreOrder["items"];
};

const OrderItemsList = ({ items }: Props) => {
  return (
    <div className="space-y-2">
      <Label className="uppercase text-muted-foreground text-xs flex items-center gap-1">
        <HugeiconsIcon icon={ShoppingBag} size={14} />
        Order Items ({items?.length ?? 0})
      </Label>
      <Card>
        <CardContent className="space-y-3">
          {items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <Avatar className="w-14 h-14 rounded-md">
                <AvatarImage
                  src={item.image ?? item.product?.images?.[0] ?? ""}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-md">
                  <HugeiconsIcon icon={ShoppingBag} size={20} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">Product</p>
                <p className="text-xs text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderItemsList;
