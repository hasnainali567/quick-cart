import { Button } from "@/components/ui/button";
import { AddProductForm } from "@/features/product/components/AddProductForm";
import { Back, LoaderCircle } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { CreateProductInput } from "@/types/product.types";
import useCreateProduct from "@/features/product/hooks/useCreateProduct";

const AddProduct = () => {
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useCreateProduct();

  const handleSaveProduct = async (data: CreateProductInput) => {
    toast.promise(mutateAsync(data), {
      loading: "Saving product details...",
      success: () => {
        return `Product "${data.name}" added successfully!`;
      },
      error: "Error adding product.",
    });
  };

  return (
    <div className="w-full flex-1 relative h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-card/20 backdrop-blur-md flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(-1)} variant={"ghost"}>
            <HugeiconsIcon icon={Back} />
          </Button>
          <h1 className="text-lg font-medium">Add Product</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"outline"} onClick={() => navigate(-1)}>
            Discard
          </Button>
          <Button type="submit" form="add-product-form" disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={LoaderCircle} />
                Saving...
              </div>
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </div>
      <div className="p-6 pb-20 h-full w-full mx-auto overflow-y-auto scrollbar-none flex-1">
        <AddProductForm onSubmit={handleSaveProduct} />
      </div>
    </div>
  );
};

export default AddProduct;
