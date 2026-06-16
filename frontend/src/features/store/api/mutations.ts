import { patchRequest } from "@/api/requests";

export const updateStoreStatus = async (storeId: string) => {
  const res = await patchRequest({ url: `/store/${storeId}/status` });
  return res;
};
