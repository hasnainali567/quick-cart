import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Avatar from "@/components/global/Avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail, Phone } from "@hugeicons/core-free-icons";
import type { StoreOrder } from "@/types/order.types";

type Props = {
  customer: StoreOrder["customer"];
};

const OrderCustomerInfo = ({ customer }: Props) => {
  return (
    <div className="space-y-2">
      <Label className="uppercase text-muted-foreground text-xs">
        Customer Information
      </Label>
      <Card>
        <CardContent className="flex gap-3 items-center">
          <Avatar
            src={customer.image ?? ""}
            fallback={customer.name.charAt(0).toUpperCase()}
          />
          <div className="flex-1">
            <h5 className="text-base font-semibold">{customer.name}</h5>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <HugeiconsIcon icon={Mail} size={14} />
              <span>{customer.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderCustomerInfo;
