import Sheet from "@/components/global/Sheet";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { AdminProduct } from "../api/products";

type Props = {
  product: AdminProduct;
  trigger: React.ReactNode;
};

const adminStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500";
    case "PENDING":
      return "bg-yellow-500";
    case "SUSPENDED":
      return "bg-red-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const ProductSheet = ({ product, trigger }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      data={product}
      title={product.name}
      description={`Added ${new Date(product.createdAt).toLocaleDateString()}`}
      onOpenChange={setOpen}
      open={open}
      trigger={trigger}
    >
      {(data) => (
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6 scrollbar-none">
            {/* Image + Name */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-2xl font-bold shrink-0 overflow-hidden">
                {data.images?.[0] ? (
                  <img
                    src={data.images[0]}
                    alt={data.name}
                    className="size-full object-cover"
                  />
                ) : (
                  data.name?.charAt(0)?.toUpperCase() || "?"
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{data.name}</h2>
                <p className="text-sm text-muted-foreground">{data.slug}</p>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Admin Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${adminStatusColor(data.adminStatus)}`}
                    />
                    <Badge>{data.adminStatus}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Product Status</p>
                  <Badge
                    variant={
                      data.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {data.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Featured</p>
                  <p className="text-sm font-medium mt-1">
                    {data.isFeatured ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-sm font-medium mt-1">
                    {data.isActive ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing & Stock */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Pricing & Stock
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">
                    ${data.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">Price</p>
                </div>
                {data.salePrice && (
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${data.salePrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Sale Price</p>
                  </div>
                )}
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{data.stock}</p>
                  <p className="text-xs text-muted-foreground">Stock</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Store & Category */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Store & Category
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold shrink-0">
                  {data.store?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-sm font-medium">{data.store?.name}</p>
                  <p className="text-xs text-muted-foreground">Store</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-sm font-medium">{data.category?.name}</p>
              </div>
            </div>

            <Separator />

            {/* Performance */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Performance
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{data.totalSold}</p>
                  <p className="text-xs text-muted-foreground">Sold</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{data.totalReviews}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">
                    {data.avgRating ? data.avgRating.toFixed(1) : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* IDs */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Identifiers
              </h3>
              <div>
                <p className="text-xs text-muted-foreground">Product ID</p>
                <p className="text-sm font-mono mt-0.5 break-all">{data.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
};

export default ProductSheet;
