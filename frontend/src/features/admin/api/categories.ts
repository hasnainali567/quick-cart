import { getRequest, patchRequest, deleteRequest } from "@/api/requests";
import type { PaginatedApiResponse } from "@/types";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetCategoriesParams = {
  page?: number;
  take?: number;
  search?: string;
  isActive?: string;
};

export const getAdminCategories = async (params: GetCategoriesParams) => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.isActive) query.set("isActive", params.isActive);
  query.set("skip", String(((params.page || 1) - 1) * (params.take || 10)));
  query.set("take", String(params.take || 10));

  const res = await getRequest<PaginatedApiResponse<AdminCategory>>({
    url: `/admin/category?${query.toString()}`,
  });
  return res;
};

export const toggleCategoryStatus = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/category/${id}/status`,
  });
};

export const deleteCategory = async (id: string) => {
  return deleteRequest<null>({
    url: `/admin/category/${id}`,
  });
};
