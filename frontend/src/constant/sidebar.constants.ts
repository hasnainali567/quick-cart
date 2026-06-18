import type { MenuItem } from "@/types";
import {
  Boxes,
  CatalogueIcon,
  DashboardSquareIcon,
  Money,
  Setting06Icon,
  Truck,
} from "@hugeicons/core-free-icons";

const StoreMenuItems: MenuItem[] = [
  {
    to: "/store/dashboard",
    label: "Dashboard",
    icon: DashboardSquareIcon,
  },
  {
    to: "/store/products",
    label: "Products",
    icon: Boxes,
  },
  {
    to: "/store/categories",
    label: "Categories",
    icon: CatalogueIcon,
  },
  {
    to: "/store/earnings",
    label: "Earnings",
    icon: Money,
  },
  {
    to: "/store/orders",
    label: "Orders",
    icon: Truck,
  },
];

const StoreMenuFooterItems = [
  {
    to: "/store/settings",
    label: "Settings",
    icon: Setting06Icon,
  },
];

export { StoreMenuItems, StoreMenuFooterItems };
