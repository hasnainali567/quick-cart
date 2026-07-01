import { getRequest, patchRequest } from "@/api/requests";
import type { PaginatedApiResponse } from "@/types";

export type AdminProductStore = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  salePrice: number | null;
  stock: number;
  adminStatus: string;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  avgRating: number;
  totalReviews: number;
  totalSold: number;
  createdAt: string;
  store: AdminProductStore;
  category: AdminProductCategory;
};

export type AdminProductDetail = AdminProduct & {
  description: string | null;
  sku: string | null;
  barcode: string | null;
  unit: string | null;
  costPrice: number | null;
  lowStockAlert: number;
  isOrganic: boolean;
  weight: number | null;
  expiryDate: string | null;
  tags: string[];
  updatedAt: string;
};

export type GetProductsParams = {
  page?: number;
  take?: number;
  status?: string;
  productStatus?: string;
  inStock?: string;
  lowStock?: string;
  category?: string;
  store?: string;
};

export const getAdminProducts = async (params: GetProductsParams) => {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.productStatus) query.set("productStatus", params.productStatus);
  if (params.inStock) query.set("inStock", params.inStock);
  if (params.lowStock) query.set("lowStock", params.lowStock);
  if (params.category) query.set("category", params.category);
  if (params.store) query.set("store", params.store);
  query.set("skip", String(((params.page || 1) - 1) * (params.take || 10)));
  query.set("take", String(params.take || 10));

  const res = await getRequest<PaginatedApiResponse<AdminProduct>>({
    url: `/admin/product?${query.toString()}`,
  });
  return res;
};

export const getAdminProductById = async (id: string) => {
  const res = await getRequest<AdminProductDetail>({
    url: `/admin/product/${id}`,
  });
  return res;
};

export const approveProduct = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/product/${id}/approve`,
  });
};

export const rejectProduct = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/product/${id}/reject`,
  });
};

export const suspendProduct = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/product/${id}/suspend`,
  });
};

export const setProductFeatured = async (id: string) => {
  return patchRequest<null, Record<string, never>>({
    url: `/admin/product/${id}/featured`,
  });
};
