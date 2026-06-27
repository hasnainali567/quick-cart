import { deleteRequest, getRequest, postRequest } from "@/api/requests";
import type { ApiResponse, PaginatedApiResponse } from "@/types";
import type { CreateProductInput, StoreProducts } from "@/types/product.types";
import { objectToFormData } from "../helpers/objectToFormData";

export const getStoreProducts = async ({
  page = 1,
  take = 10,
  filters = [],
}: {
  page?: number;
  take?: number;
  filters?: {
    filter: string;
    value: string;
  }[];
}) => {
  const allFilters = filters.map(
    (filter) => `${filter.filter}=${filter.value}`,
  );
  const res = await getRequest<PaginatedApiResponse<StoreProducts>>({
    url: `/store/products?skip=${(page - 1) * take}&take=${take}&${allFilters.join("&")}`,
  });
  return res;
};

export const getStoreProduct = async ({ slug }: { slug: string }) => {
  const res = await getRequest<ApiResponse<unknown>>({
    url: `store/products/${slug}`,
  });
  return res;
};

export const createProduct = async ({ body }: { body: CreateProductInput }) => {
  const data = objectToFormData(body);
  const res = await postRequest<unknown, FormData>({
    url: "store/products",
    body: data,
  });
  return res;
};

export const deleteProduct = async ({ id }: { id: string }) => {
  const res = await deleteRequest<null>({
    url: `store/products/${id}`,
  });
  return res;
};
