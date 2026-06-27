import { deleteRequest, getRequest, postRequest } from "@/api/requests";
import type { PaginatedApiResponse } from "@/types";
import type {
  AddedStoreCategory,
  Category,
  StoreCategory,
} from "@/types/store.types";

export const getStoreCategories = async () => {
  const res = await getRequest<StoreCategory[]>({
    url: "/store/category",
  });
  return res;
};

export const getCategories = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const res = await getRequest<PaginatedApiResponse<Category>>({
    url: `/category/all?skip=${(page - 1) * limit}&limit=${limit}`,
  });
  return res;
};

export const addCategorytoStore = async ({ id }: { id: string }) => {
  const res = await postRequest<AddedStoreCategory, object>({
    url: `/store/category/${id}`,
    body: {},
  });
  return res;
};

export const removeCategoryFromStore = async ({ id }: { id: string }) => {
  const res = await deleteRequest({
    url: `/store/category/${id}`,
  });
  return res;
};
