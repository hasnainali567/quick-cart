import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "../api/products";
import type { GetProductsParams } from "../api/products";

const useGetAdminProducts = (params: GetProductsParams) => {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => getAdminProducts(params),
    placeholderData: (prev) => prev,
  });
};

export default useGetAdminProducts;
