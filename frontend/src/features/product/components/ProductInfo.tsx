import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StoreProducts } from "@/types/product.types";

type Props = {
  product: Pick<StoreProducts, "name" | "category" | "avgRating" | "slug">;
  description?: string;
};

const ProductInfo = ({ product, description }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span>{product.name}</span>
          {product.category && (
            <Badge variant="outline">{product.category.name}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && (
          <div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{product.avgRating.toFixed(1)}</span>
          </div>
          <div className="text-muted-foreground">
            Slug: <span className="font-mono text-xs">{product.slug}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInfo;
