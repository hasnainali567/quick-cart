import Sheet from "@/components/global/Sheet";
import useGetStoreProduct from "../hooks/useGetStoreProduct";
import { useEffect } from "react";

type Props = {
  slug: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
};

const ProductSheet = ({ slug, open, onOpenChange, trigger }: Props) => {
  const { data, isLoading } = useGetStoreProduct({
    slug,
    enabled: open ? true : false,
  });

  useEffect(() => {
    if (!open) return;
    console.log(data);
  }, [data]);

  return (
    <Sheet
      data={data}
      title={"Product"}
      description={"product name is you name"}
      key={"product"}
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
    >
      {() => <div></div>}
    </Sheet>
  );
};

export default ProductSheet;
