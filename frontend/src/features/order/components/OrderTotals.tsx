import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { StoreOrder } from "@/types/order.types";

type Props = {
  subtotal: StoreOrder["subtotal"];
  total: StoreOrder["total"];
  promoCode?: StoreOrder["promoCode"];
  promoDiscount?: StoreOrder["promoDiscount"];
};

const OrderTotals = ({ subtotal, total, promoCode, promoDiscount }: Props) => {
  const deliveryFee = total - subtotal + (promoDiscount || 0);

  return (
    <div className="space-y-2">
      <Label className="uppercase text-muted-foreground text-xs">
        Order Summary
      </Label>
      <Card>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">PKR {subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="font-medium">PKR {deliveryFee.toFixed(2)}</span>
          </div>
          {promoCode && promoDiscount && promoDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Promo ({promoCode})</span>
              <span>-PKR {promoDiscount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-lg">PKR {total?.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTotals;
