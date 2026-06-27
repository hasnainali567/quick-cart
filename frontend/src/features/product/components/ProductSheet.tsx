import Sheet from "@/components/global/Sheet";
import useGetStoreProduct from "../hooks/useGetStoreProduct";
import { useState } from "react";

type Props = {
  slug: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
};

const ProductSheet = ({ slug, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetStoreProduct({
    slug,
    enabled: open ? true : false,
  });

  console.log(data, isLoading);

  return (
    <Sheet
      data={data}
      title={"Product"}
      description={"product name is you name"}
      key={"product"}
      onOpenChange={setOpen}
      open={open}
      trigger={trigger}
    >
      {() => <div></div>}
    </Sheet>
  );
};

export default ProductSheet;
