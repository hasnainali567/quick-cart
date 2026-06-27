import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import MySidebarFooter from "@/components/global/sidebarFooter";
import { Link, NavLink } from "react-router-dom";
import type { MenuItem, User } from "@/types";
import { ShoppingBagFavoriteFreeIcons } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type Props = {
  menuItems: MenuItem[];
  menuLabel: string;
  user: User;
  footerMenuItems?: MenuItem[];
};

const Sidebar = ({ menuItems, menuLabel, user, footerMenuItems }: Props) => {
  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"} asChild>
              <Link to={"/"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon
                    icon={ShoppingBagFavoriteFreeIcons}
                    className="size-8 shrink-0"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Quick Cart</span>
                  <span className="text-muted-foreground">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{menuLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((menuItem) => (
                <SidebarMenuItem key={menuItem.to}>
                  <NavLink to={menuItem.to}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        className={cn(
                          isActive
                            ? "bg-primary! text-primary-foreground!"
                            : "",
                        )}
                      >
                        <HugeiconsIcon icon={menuItem.icon} />
                        {menuItem.label}
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <MySidebarFooter user={user} footerItems={footerMenuItems} />
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
