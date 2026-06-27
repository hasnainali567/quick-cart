import Dialog from "@/components/global/Dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import useDeleteProduct from "../hooks/useDeleteProduct";
import { HugeiconsIcon } from "@hugeicons/react";
import { LoaderCircle } from "@hugeicons/core-free-icons";
import { DialogClose } from "@/components/ui/dialog";

type Props = {
  trigger: React.ReactNode;
  id: string;
};

const ProductDeleteDialog = ({ trigger, id }: Props) => {
  const { mutate: deleteProduct, isPending: isPendingDelete } =
    useDeleteProduct();
  return (
    <Dialog
      title="Are you sure you want to delete this product?"
      description="This action is permanent and cannot be undone. The product, all associated variants, inventory records, and any references in customer carts or wishlists will be permanently removed."
      trigger={trigger}
    >
      <div className="flex items-center justify-end gap-2">
        <DialogClose>
          <Button variant={"ghost"}>Cancel</Button>
        </DialogClose>
        <Button
          variant={"destructive"}
          onClick={() => deleteProduct(id)}
          disabled={isPendingDelete}
        >
          {isPendingDelete ? (
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={LoaderCircle} className="animate-spin" />
              Deleting
            </div>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </Dialog>
  );
};

export default ProductDeleteDialog;
