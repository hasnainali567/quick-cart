import { getRequest, patchRequest } from "@/api/requests";
import type { PaginatedApiResponse } from "@/types";

export type StoreOwner = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type AdminStore = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  status: string;
  partnerStatus: string;
  isVerified: boolean;
  commissionPercent: number;
  totalRevenue: number;
  totalOrders: number;
  avgRating: number;
  createdAt: string;
  owner: StoreOwner;
};

export type AdminStoreDetail = AdminStore & {
  owner: StoreOwner & { phone: string | null; role: string; createdAt: string };
};

export type GetStoresParams = {
  page?: number;
  take?: number;
  search?: string;
  partnerStatus?: string;
  isVerified?: string;
};

export const getAdminStores = async (params: GetStoresParams) => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.partnerStatus) query.set("partnerStatus", params.partnerStatus);
  if (params.isVerified) query.set("isVerified", params.isVerified);
  query.set("skip", String(((params.page || 1) - 1) * (params.take || 10)));
  query.set("take", String(params.take || 10));

  const res = await getRequest<PaginatedApiResponse<AdminStore>>({
    url: `/admin/store?${query.toString()}`,
  });
  return res;
};

export const getAdminStoreById = async (id: string) => {
  const res = await getRequest<AdminStoreDetail>({
    url: `/admin/store/${id}`,
  });
  return res;
};

export const verifyStore = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/store/${id}/verify`,
  });
};

export const approveStore = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/store/${id}/approve`,
  });
};

export const rejectStore = async (id: string, rejectionReason: string) => {
  return patchRequest<null, { rejectionReason: string }>({
    url: `/admin/store/${id}/reject`,
    body: { rejectionReason },
  });
};

export const suspendStore = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/store/${id}/suspend`,
  });
};

export const updateStoreCommission = async (id: string, commissionPercent: number) => {
  return patchRequest<null, { commissionPercent: number }>({
    url: `/admin/store/${id}/commission`,
    body: { commissionPercent },
  });
};
