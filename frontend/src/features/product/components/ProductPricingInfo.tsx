import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
};

const ProductPricingInfo = ({ price, salePrice, costPrice }: Props) => {
  const hasDiscount = salePrice && salePrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Regular Price</span>
          <span className={`font-semibold ${hasDiscount ? "line-through text-muted-foreground" : ""}`}>
            PKR {price.toFixed(2)}
          </span>
        </div>

        {salePrice && salePrice > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sale Price</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">
                  PKR {salePrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded">
                    -{discountPercent}%
                  </span>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {costPrice && costPrice > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cost Price</span>
            <span className="font-medium text-sm">PKR {costPrice.toFixed(2)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductPricingInfo;
