import { postRequest, patchRequest, uploadRequest } from "@/api/requests";

export const registerStore = async (data: {
  name: string;
  addressLine1: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
}) => {
  return postRequest({ url: "/store/register", body: data });
};

export const updateStoreStatus = async (storeId: string) => {
  const res = await patchRequest({ url: `/store/${storeId}/status` });
  return res;
};

export const updateStoreProfile = async (data: {
  storeId: string;
  name?: string;
  description?: string;
  phone?: string;
  area?: string;
  city?: string;
  addressLine1?: string;
}) => {
  const { storeId, ...body } = data;
  return patchRequest({ url: `/store/${storeId}/update`, body });
};

export const updateStoreDelivery = async (data: {
  storeId: string;
  deliveryFee?: number;
  freeDeliveryAbove?: number;
  minimumOrderAmount?: number;
  serviceRadiusKm?: number;
}) => {
  const { storeId, ...body } = data;
  return patchRequest({ url: `/store/${storeId}/update`, body });
};

export const updateStoreHours = async (data: {
  storeId: string;
  timings: {
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
}) => {
  const { storeId, ...body } = data;
  return patchRequest({ url: `/store/${storeId}/timings`, body });
};

export const updateStoreLogo = async (data: { storeId: string; file: File }) => {
  return uploadRequest({
    url: `/store/${data.storeId}/logo`,
    file: data.file,
    fieldName: "logo",
  });
};

export const updateStoreBanner = async (data: { storeId: string; file: File }) => {
  return uploadRequest({
    url: `/store/${data.storeId}/banner`,
    file: data.file,
    fieldName: "banner",
  });
};
