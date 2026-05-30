import { Link, Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import {
  Bell,
  CatalogueFreeIcons,
  CreditCard,
  DashboardBrowsingFreeIcons,
  Settings,
  ShippingCenterFreeIcons,
  VegetarianFoodFreeIcons,
} from "@hugeicons/core-free-icons";
import { Separator } from "../ui/separator";
import Sidebar from "../global/Sidebar";
import { Button } from "../ui/button";
import { signOut, useSession } from "@/lib/auth";
import HeaderAvatar from "../global/HeaderAvatar";
import { HugeiconsIcon } from "@hugeicons/react";

const STORE_ROUTES = [
  {
    to: "/store/dashboard",
    icon: DashboardBrowsingFreeIcons,
    label: "Dashboard",
  },
  {
    to: "/store/orders",
    icon: ShippingCenterFreeIcons,
    label: "Orders",
  },
  {
    to: "/store/products",
    icon: VegetarianFoodFreeIcons,
    label: "Products",
  },
  {
    to: "/store/categories",
    icon: CatalogueFreeIcons,
    label: "Categories",
  },
  {
    to: "/store/earnings",
    icon: CreditCard,
    label: "Earnings",
  },
];

const StoreLayout = () => {
  const session = useSession();
  const user = session.data?.user;

  if (!user) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <Sidebar
          user={{
            name: user?.name,
            email: user?.email,
            avatar: user?.image || undefined,
          }}
          routes={STORE_ROUTES}
          settingsRoute="/settings"
        />
        <main className="w-full">
          <div className="w-full p-2 border-b border-border flex gap-2 items-center justify-between">
            <div>
              <SidebarTrigger />
              <Separator orientation="vertical" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant={"ghost"} className="size-8" asChild>
                <Link to={"/notifications"}>
                  <HugeiconsIcon icon={Bell} />
                </Link>
              </Button>
              <Button variant={"ghost"} className="size-8" asChild>
                <Link to={"/settings"}>
                  <HugeiconsIcon icon={Settings} />
                </Link>
              </Button>
              <Separator orientation="vertical" />
              <HeaderAvatar
                user={{
                  name: user?.name,
                  email: user?.email,
                  avatar: user?.image || undefined,
                }}
              />
            </div>
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default StoreLayout;
