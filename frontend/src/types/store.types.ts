import type { User } from ".";

type StoreStatus = "OPEN" | "CLOSE";

export type Store = {
  addressLine1: string;
  area: string;
  avgRating: number;
  banner: string | null;
  city: string;
  closingTime: string | null;
  commissionPercent: number;
  createdAt: string;
  deliveryFee: number;
  description: string | null;
  email: string;
  freeDeliveryAbove: number | null;
  id: string;
  isVerified: boolean;
  latitude: number;
  longitude: number;
  logo: string | null;
  minimumOrderAmount: number;
  name: string;
  openingTime: string | null;
  owner: Pick<User, "id" | "name" | "email" | "phone" | "image">;
  ownerId: string;
  partnerStatus: string;
  phone: string | null;
  rejectionReason: string | null;
  serviceRadiusKm: number;
  slug: string;
  status: StoreStatus;
  totalOrders: number;
  totalRevenue: number;
  totalReviews: number;
  updatedAt: string;
  workingDays: string[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  isActve: boolean;
  image: string;
  slug: string;
  description: string;
  _count: {
    products: number;
  };
};

export type StoreCategory = {
  id: string;
  category: Category;
};

export type AddedStoreCategory = {
  id: string;
  category: {
    name: string;
    icon: string;
    description?: string;
  };
};
