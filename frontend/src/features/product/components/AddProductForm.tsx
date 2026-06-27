import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CreateProductInput } from "@/types/product.types";

import { ProductGeneralInfo } from "./ProductGeneralInfo";
import { ProductImages } from "./ProductImages";
import { ProductInventory } from "./ProductInventory";
import { ProductPricing } from "./ProductPricing";
import { ProductStatus } from "./ProductStatus";

interface AddProductFormProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit"
> {
  onSubmit?: (data: CreateProductInput) => void;
}

export function AddProductForm({
  className,
  onSubmit,
  ...props
}: AddProductFormProps) {
  const methods = useForm<CreateProductInput>({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      unit: "piece",
      weight: undefined,
      sku: "",
      barcode: "",
      stock: 0,
      lowStockAlert: 5,
      price: 0,
      salePrice: undefined,
      costPrice: undefined,
      isActive: true,
      isFeatured: false,
      isOrganic: false,
      images: [],
      tags: [],
    },
  });

  const [isSkuDirty, setIsSkuDirty] = useState(false);

  const handleFormSubmit = (data: CreateProductInput) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Saving Product:", data);
      toast.success("Product configuration validated and saved!");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        id="add-product-form"
        onSubmit={methods.handleSubmit(handleFormSubmit)}
        className={cn(
          "grid grid-cols-1 lg:grid-cols-5 gap-6 items-start overflow-auto",
          className,
        )}
        {...props}
      >
        {/* Left Column: General Info, Images, Inventory */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto">
          <ProductGeneralInfo isSkuDirty={isSkuDirty} />
          <ProductImages />
          <ProductInventory setIsSkuDirty={setIsSkuDirty} />
        </div>

        {/* Right Column: Pricing & Options */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProductPricing />
          <ProductStatus />
        </div>
      </form>
    </FormProvider>
  );
}
