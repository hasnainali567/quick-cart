import { getRequest, patchRequest } from "@/api/requests";
import type { PaginatedApiResponse } from "@/types";

export type AdminDriverUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
};

export type AdminDriver = {
  id: string;
  userId: string;
  status: string;
  approvalStatus: string;
  vehicleType: string | null;
  vehicleName: string | null;
  vehicleNumber: string | null;
  totalDeliveries: number;
  avgRating: number;
  totalEarnings: number;
  createdAt: string;
  user: AdminDriverUser;
};

export type GetDriversParams = {
  page?: number;
  take?: number;
  search?: string;
  status?: string;
  approvalStatus?: string;
};

export const getAdminDrivers = async (params: GetDriversParams) => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.approvalStatus) query.set("approvalStatus", params.approvalStatus);
  query.set("skip", String(((params.page || 1) - 1) * (params.take || 10)));
  query.set("take", String(params.take || 10));

  const res = await getRequest<PaginatedApiResponse<AdminDriver>>({
    url: `/admin/driver?${query.toString()}`,
  });
  return res;
};

export const getAdminDriverById = async (id: string) => {
  const res = await getRequest<AdminDriver>({
    url: `/admin/driver/${id}`,
  });
  return res;
};

export const approveDriver = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/driver/${id}/approve`,
  });
};

export const rejectDriver = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/driver/${id}/reject`,
  });
};

export const suspendDriver = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/driver/${id}/suspend`,
  });
};
