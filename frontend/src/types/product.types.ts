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
