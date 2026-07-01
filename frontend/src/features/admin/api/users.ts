import { getRequest, patchRequest } from "@/api/requests";
import type { PaginatedApiResponse } from "@/types";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
  phone: string | null;
};

export type GetUsersParams = {
  page?: number;
  take?: number;
  search?: string;
  role?: string;
  isSuspended?: string;
};

export const getAdminUsers = async (params: GetUsersParams) => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.role) query.set("role", params.role);
  if (params.isSuspended) query.set("isSuspended", params.isSuspended);
  query.set("skip", String(((params.page || 1) - 1) * (params.take || 10)));
  query.set("take", String(params.take || 10));

  const res = await getRequest<PaginatedApiResponse<AdminUser>>({
    url: `/admin/user?${query.toString()}`,
  });
  return res;
};

export const suspendUser = async (id: string) => {
  const res = await patchRequest<null, Record<string, never>>({
    url: `/admin/user/${id}/suspend`,
  });
  return res;
};

export const unsuspendUser = async (id: string) => {
  const res = await patchRequest<null, Record<string, never>>({
    url: `/admin/user/${id}/unsuspend`,
  });
  return res;
};
