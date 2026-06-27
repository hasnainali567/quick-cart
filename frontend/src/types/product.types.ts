export type Product = {
  stock: number;
  status: Status;
  adminStatus: AdminStatus;
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avgRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  storeId: string;
  categoryId: string;
  images: string[];
  sku: string | null;
  barcode: string | null;
  unit: string | null;
  price: number;
  salePrice: number | null;
  costPrice: number | null;
  lowStockAlert: number;
  isFeatured: boolean;
  isOrganic: boolean;
  totalSold: number;
  weight: number | null;
  expiryDate: Date | null;
  tags: string[];
};

type ProductVariant = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AdminStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
type Status = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED";

export type Category = {
  name: string;
};

export type StoreProducts = {
  id: string;
  images: string[];
  isActive: boolean;
  name: string;
  slug: string;
  category: Category;
  status: Status;
  price: number;
  stock: number;
  adminStatus: AdminStatus;
  variants: ProductVariant[];
  avgRating: number;
  lowStockAlert: number;
};

export type CreateProductInput = {
  name: string;
  description?: string;
  categoryId: string;
  unit: string;
  weight?: number;
  sku: string;
  barcode?: string;
  stock: number;
  lowStockAlert: number;
  price: number;
  salePrice?: number;
  costPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  isOrganic: boolean;
  images: File[];
  tags?: string[];
};
