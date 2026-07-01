import Sheet from "@/components/global/Sheet";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductSheet } from "../hooks/useProductSheet";
import ProductImagesCarousel from "./ProductImagesCarousel";
import ProductInfo from "./ProductInfo";
import ProductPricingInfo from "./ProductPricingInfo";
import ProductInventoryInfo from "./ProductInventoryInfo";
import ProductStatusInfo from "./ProductStatusInfo";
import ProductVariantsList from "./ProductVariantsList";

type Props = {
  slug: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
};

const ProductSheet = ({ slug, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const { product, isLoading } = useProductSheet(slug, open);

  return (
    <Sheet
      data={product}
      title={isLoading ? "" : product?.name || "Product Details"}
      description={
        product
          ? `SKU: ${product.sku || "N/A"}${product.category ? ` • Category: ${product.category.name}` : ""}`
          : "View product information"
      }
      key={"product"}
      onOpenChange={setOpen}
      open={open}
      trigger={trigger}
    >
      {(product) => {
        if (isLoading) {
          return (
            <div className="space-y-4 p-4">
              <Skeleton className="w-full h-64" />
              <Skeleton className="w-full h-32" />
              <Skeleton className="w-full h-32" />
            </div>
          );
        }

        if (!product) {
          return (
            <div className="p-4 text-center text-muted-foreground">
              Product not found
            </div>
          );
        }

        return (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6 scrollbar-none">
              <ProductImagesCarousel
                images={product.images}
                name={product.name}
              />

              <Separator />

              <ProductInfo
                product={product}
                description={product.description || undefined}
              />

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProductPricingInfo
                  price={product.price}
                  salePrice={product.salePrice}
                  costPrice={product.costPrice}
                />

                <ProductInventoryInfo
                  stock={product.stock}
                  lowStockAlert={product.lowStockAlert}
                  unit={product.unit}
                  weight={product.weight}
                  sku={product.sku}
                  barcode={product.barcode}
                />
              </div>

              <Separator />

              <ProductStatusInfo
                status={product.status}
                adminStatus={product.adminStatus}
                isActive={product.isActive}
                isFeatured={product.isFeatured}
                isOrganic={product.isOrganic}
              />

              {product.variants && product.variants.length > 0 && (
                <>
                  <Separator />
                  <ProductVariantsList variants={product.variants} />
                </>
              )}
            </div>
          </div>
        );
      }}
    </Sheet>
  );
};

export default ProductSheet;
