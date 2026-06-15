import api from "./api";
import type { ApiResponse } from "../types";

export const getRequest = async <TResponse>(options: {
  url: string;
}): Promise<TResponse> => {
  const res = await api.get<ApiResponse<TResponse>>(options.url);
  return res.data.data;
};

export const postRequest = async <TResponse, TBody extends object>(options: {
  url: string;
  body: TBody;
}): Promise<TResponse> => {
  const res = await api.post<ApiResponse<TResponse>>(options.url, options.body);

  return res.data.data;
};

export const patchRequest = async <TResponse, TBody extends object>(options: {
  url: string;
  body: TBody;
}): Promise<TResponse> => {
  const res = await api.patch<ApiResponse<TResponse>>(
    options.url,
    options.body,
  );

  return res.data.data;
};

export const deleteRequest = async <TResponse, TBody = void>(options: {
  url: string;
  body?: TBody;
}): Promise<TResponse> => {
  const res = await api.delete<ApiResponse<TResponse>>(options.url, {
    data: options.body,
  });

  return res.data.data;
};
