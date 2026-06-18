import { Button } from "@/components/ui/button";
import { Pen, Trash2, Visible } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import ProductSheet from "./ProductSheet";

type Props = {
  slug: string;
};

const ProductActions = ({ slug }: Props) => {
  return (
    <div>
      <Button variant={"ghost"}>
        <HugeiconsIcon icon={Pen} />
      </Button>
      <Button
        variant={"ghost"}
        className="text-[#ffb4ab] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/60"
      >
        <HugeiconsIcon icon={Trash2} />
      </Button>
      <ProductSheet
        slug={slug}
        trigger={
          <Button variant={"ghost"}>
            <HugeiconsIcon icon={Visible} />
          </Button>
        }
      />
    </div>
  );
};

export default ProductActions;
