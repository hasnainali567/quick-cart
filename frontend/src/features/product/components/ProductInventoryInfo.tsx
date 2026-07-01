import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Props = {
  stock: number;
  lowStockAlert: number;
  unit?: string | null;
  weight?: number | null;
  sku?: string | null;
  barcode?: string | null;
};

const ProductInventoryInfo = ({
  stock,
  lowStockAlert,
  unit,
  weight,
  sku,
  barcode,
}: Props) => {
  const isLowStock = stock <= lowStockAlert;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Inventory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Stock</span>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isLowStock ? "text-orange-600" : ""}`}>
              {stock} {unit || "units"}
            </span>
            {isLowStock && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <HugeiconsIcon icon={AlertCircle} size={12} className="mr-1" />
                Low Stock
              </Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Low Stock Alert</span>
          <span className="text-sm">{lowStockAlert} {unit || "units"}</span>
        </div>

        {weight && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Weight</span>
            <span className="text-sm">{weight}g</span>
          </div>
        )}

        {sku && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">SKU</span>
            <span className="text-xs font-mono">{sku}</span>
          </div>
        )}

        {barcode && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Barcode</span>
            <span className="text-xs font-mono">{barcode}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductInventoryInfo;
