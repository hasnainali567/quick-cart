import { getRequest } from "@/api/requests";
import type { PaginatedApiResponse } from "@/types";
import type { StoreProducts } from "@/types/product.types";

export const getStoreProducts = async ({
  page = 1,
  take = 10,
}: {
  page?: number;
  take?: number;
}) => {
  const res = await getRequest<PaginatedApiResponse<StoreProducts>>({
    url: `/store/products?skip=${(page - 1) * take}&take=${take}`,
  });
  return res;
};
