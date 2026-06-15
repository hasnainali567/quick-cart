import type { User } from ".";

type customer = Pick<User, "id" | "name" | "email" | "image">;

type Address = {
  addressLine1: string;
  addressLine2: string | null;
  area: string;
  city: string;
  country: string;
  id: string;
  phone: string;
  fullName: string;
  label: string | null;
  isDefault: boolean;
  latitude: number | null;
  longitude: number | null;
  province: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type OrderItem = {
  id: string;
  image: string;
  product: {
    id: string;
    images: string[];
  };
  quantity: number;
};

export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PREPARED"
  | "PREPARING"
  | "DRIVER_ASSIGNED"
  | "HEADING_TO_STORE";

export type StoreOrder = {
  createdAt: string;
  customer: customer;
  address: Address;
  items: OrderItem[];
  id: string;
  status: OrderStatus;
  promoCode: string | null;
  promoDiscount: number;

  subtotal: number;
  total: number;
  updatedAt: string;
};
