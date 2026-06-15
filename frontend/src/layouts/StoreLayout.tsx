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

const StoreLayout = () => {
  const navigate = useNavigate();
  const { data, isPending } = useSession();
  const { data: store } = useGetStore();

  const user = data && data.user;

  if (!data && !isPending) {
    navigate("/", { replace: true });
    return null;
  }

  if (user && user.role !== "STORE_ADMIN") {
    navigate("/", { replace: true });
    return null;
  }

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  if (!store && !isPending) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    // should not scroll
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
