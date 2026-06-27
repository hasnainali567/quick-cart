import Sidebar from "@/components/global/sidebar";
import StoreHeader from "@/components/store/header/storeHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  StoreMenuFooterItems,
  StoreMenuItems,
} from "@/constant/sidebar.constants";
import { useGetStore } from "@/hooks/use-query";
import { useSession } from "@/lib/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const StoreLayout = () => {
  const navigate = useNavigate();
  const { data, isPending } = useSession();
  const { data: store, isPending: isStorePending } = useGetStore();

  const user = data && data.user;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "STORE_ADMIN") {
      navigate("/", { replace: true });
      return;
    }

    if (isStorePending) return;

    if (!store) {
      navigate("/", { replace: true });
      return;
    }
  }, [isPending, user, isStorePending, store, navigate]);

  if (isPending) return null;
  if (!user || user.role !== "STORE_ADMIN") return null;
  
  if (isStorePending) return null;
  if (!store) return null;

  return (
    <SidebarProvider>
      <Sidebar
        user={user}
        menuItems={StoreMenuItems}
        menuLabel="Navigations"
        footerMenuItems={StoreMenuFooterItems}
      />
      <div className="w-full h-screen flex flex-col min-h-0">
        <StoreHeader user={user} store={store} />
        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export default StoreLayout;
