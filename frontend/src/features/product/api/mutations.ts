import { patchRequest } from "@/api/requests";

export const updateProductStatus = async (id: string) => {
  const res = await patchRequest({ url: `/store/products/${id}/status` });
  return res;
};
