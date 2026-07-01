import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location, Phone } from "@hugeicons/core-free-icons";
import type { StoreOrder } from "@/types/order.types";

type Props = {
  address: StoreOrder["address"];
};

const OrderAddressInfo = ({ address }: Props) => {
  return (
    <div className="space-y-2">
      <Label className="uppercase text-muted-foreground text-xs flex items-center gap-1">
        <HugeiconsIcon icon={Location} size={14} />
        Delivery Address
      </Label>
      <Card>
        <CardContent className="space-y-2">
          <div>
            <p className="font-semibold text-sm">{address.fullName}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <HugeiconsIcon icon={Phone} size={14} />
              <span>{address.phone}</span>
            </div>
          </div>
          <div className="text-sm space-y-0.5">
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>
              {address.area}, {address.city}
            </p>
            <p>
              {address.province}, {address.country}
            </p>
            {address.label && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-accent rounded-md">
                {address.label}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderAddressInfo;
