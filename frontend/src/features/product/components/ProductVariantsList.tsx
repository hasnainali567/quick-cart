import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StoreProducts } from "@/types/product.types";

type Props = {
  variants: StoreProducts["variants"];
};

const ProductVariantsList = ({ variants }: Props) => {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Variants ({variants.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium text-sm">{variant.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  Stock: {variant.stock}
                </span>
                {variant.sku && (
                  <span className="text-xs text-muted-foreground font-mono">
                    SKU: {variant.sku}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">PKR {variant.price.toFixed(2)}</p>
              {variant.salePrice && variant.salePrice < variant.price && (
                <p className="text-xs text-green-600">
                  Sale: PKR {variant.salePrice.toFixed(2)}
                </p>
              )}
              <Badge
                variant={variant.isActive ? "default" : "secondary"}
                className="mt-1"
              >
                {variant.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProductVariantsList;
