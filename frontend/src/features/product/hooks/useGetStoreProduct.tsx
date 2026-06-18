import { useQuery } from "@tanstack/react-query";
import { getStoreProduct } from "../api/queries";

type Props = {
  slug: string;
  enabled: boolean;
};

const useGetStoreProduct = ({ slug, enabled }: Props) => {
  return useQuery({
    queryKey: ["store", "products", slug],
    queryFn: () => getStoreProduct({ slug }),
    enabled,
  });
};

export default useGetStoreProduct;
