import { getRequest } from "@/api/requests";
import type { StoreProductsResponse } from "@/types/product.types";

export const getStoreProducts = async () => {
  const res = await getRequest<StoreProductsResponse>({
    url: "/store/products",
  });
  return res;
};
