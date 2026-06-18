import { getRequest } from "@/api/requests";
import type { StoreCategory } from "@/types/store.types";

export const getStoreCategories = async () => {
  const res = await getRequest<StoreCategory[]>({
    url: "/store/category",
  });
  return res;
};
