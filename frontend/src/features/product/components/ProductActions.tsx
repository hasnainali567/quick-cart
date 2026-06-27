import { Button } from "@/components/ui/button";
import { Dots, Pen, Trash2, Visible } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import ProductSheet from "./ProductSheet";
import ProductDeleteDialog from "./ProductDeleteDialog";

type Props = {
  slug: string;
  id: string;
};

const ProductActions = ({ slug, id }: Props) => {
  return (
    <div>
      <ProductSheet
        slug={slug}
        trigger={
          <Button variant={"ghost"}>
            <HugeiconsIcon icon={Visible} />
          </Button>
        }
      />
      <ProductDeleteDialog
        id={id}
        trigger={
          <Button
            variant={"ghost"}
            className="text-[#ffb4ab] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/60"
          >
            <HugeiconsIcon icon={Trash2} />
          </Button>
        }
      />
      <Button variant={"ghost"}>
        <HugeiconsIcon icon={Dots} className="rotate-90" />
      </Button>
    </div>
  );
};

export default ProductActions;
