import type { MenuItem } from "@/types";
import {
  Boxes,
  CatalogueIcon,
  DashboardSquareIcon,
  Money,
  Profile,
  Setting06Icon,
  Store,
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

const AdminMenuItems: MenuItem[] = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: DashboardSquareIcon,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Profile,
  },
  {
    to: "/admin/stores",
    label: "Stores",
    icon: Store,
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: Boxes,
  },
  {
    to: "/admin/categories",
    label: "Categories",
    icon: CatalogueIcon,
  },
  {
    to: "/admin/drivers",
    label: "Drivers",
    icon: Truck,
  },
];

const AdminMenuFooterItems = [
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Setting06Icon,
  },
];

export { StoreMenuItems, StoreMenuFooterItems, AdminMenuItems, AdminMenuFooterItems };
