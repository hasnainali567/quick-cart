import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "@/components/global/sidebar";
import { AdminMenuItems, AdminMenuFooterItems } from "@/constant/sidebar.constants";
import { signOut, useSession } from "@/lib/auth";
import { Outlet } from "react-router-dom";
import { Logout } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const AdminLayout = () => {
  const { data } = useSession();
  const user = data?.user;

  if (!user) return null;

  return (
    <SidebarProvider>
      <Sidebar
        user={user}
        menuItems={AdminMenuItems}
        menuLabel="Admin"
        footerMenuItems={AdminMenuFooterItems}
      />
      <div className="w-full h-screen flex flex-col min-h-0">
        <div className="sticky top-0 z-50 backdrop-blur-2xl bg-secondary/20 flex items-center justify-between gap-2 p-2 border-border border-b w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="size-8" />
            <Separator orientation="vertical" />
            <h1 className="text-base font-medium">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-0.5 pr-2 hover:bg-muted transition-colors">
                  <Avatar className="size-8">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">
                    {user.name || "Admin"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => signOut()}
                >
                  <HugeiconsIcon icon={Logout} size={16} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
