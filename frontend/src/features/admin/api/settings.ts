import { getRequest, patchRequest, postRequest } from "@/api/requests";
import type { PaginatedApiResponse } from "@/types";

export type PlatformSetting = {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
};

export type GetSettingsParams = {
  page?: number;
  take?: number;
};

export const getAdminSettings = async (params: GetSettingsParams = {}) => {
  const query = new URLSearchParams();
  query.set("skip", String(((params.page || 1) - 1) * (params.take || 50)));
  query.set("take", String(params.take || 50));

  const res = await getRequest<PlatformSetting[]>({
    url: `/admin/settings?${query.toString()}`,
  });
  return res;
};

export const getAdminSetting = async (key: string) => {
  const res = await getRequest<PlatformSetting>({
    url: `/admin/settings/${key}`,
  });
  return res;
};

export const updateAdminSetting = async (key: string, value: string, description?: string) => {
  const res = await patchRequest<PlatformSetting, { value: string; description?: string }>({
    url: `/admin/settings/${key}`,
    body: { value, description },
  });
  return res;
};

export const createAdminSetting = async (key: string, value: string, description?: string) => {
  const res = await postRequest<PlatformSetting, { key: string; value: string; description?: string }>({
    url: `/admin/settings`,
    body: { key, value, description },
  });
  return res;
};

export const deleteAdminSetting = async (key: string) => {
  const res = await patchRequest<void, void>({
    url: `/admin/settings/${key}`,
  });
  return res;
};

export const bulkUpdateAdminSettings = async (settings: Array<{ key: string; value: string; description?: string }>) => {
  const res = await postRequest<PlatformSetting[], { settings: Array<{ key: string; value: string; description?: string }> }>({
    url: `/admin/settings/bulk`,
    body: { settings },
  });
  return res;
};