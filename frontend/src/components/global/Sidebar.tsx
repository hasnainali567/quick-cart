import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "../ui/sidebar";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Link, NavLink } from "react-router-dom";
import {
  Settings,
  ShoppingBagFavoriteFreeIcons,
} from "@hugeicons/core-free-icons";
import { NavUser } from "./user-sidebar";

type Route = {
  to: string;
  label: string;
  icon: IconSvgElement;
};

type Prop = {
  routes: Route[];
  settingsRoute: string;
  user : {
    name: string;
    email: string;
    avatar: string | undefined;
  };
};

const Sidebar = ({ routes, settingsRoute, user }: Prop) => {
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";
  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader className="p-2">
        <Link to={"/"} className="flex items-center w-full justify-center">
          {isCollapsed ? (
            <span className="size-8 bg-muted! rounded-md p-1">
              <HugeiconsIcon
                icon={ShoppingBagFavoriteFreeIcons}
                className="size-6"
              />
            </span>
          ) : (
            <div className="flex items-center w-full">
              <span className="size-12 bg-muted! rounded-md p-2">
                <HugeiconsIcon
                  icon={ShoppingBagFavoriteFreeIcons}
                  className="size-8"
                />
              </span>
              <div className="flex flex-col px-2">
                <h3 className="text-lg font-medium">QuickCart</h3>
                <span className="text-sm text-muted-foreground">
                  Manage Your Store
                </span>
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route, index) => (
                <SidebarMenuItem key={index}>
                  <NavLink to={route.to}>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive}>
                        <HugeiconsIcon icon={route.icon} />
                        {route.label}
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
        <SidebarMenu>
          <NavLink to={settingsRoute}>
            {({ isActive }) => (
              <SidebarMenuItem>
                <SidebarMenuButton isActive={isActive}>
                  <HugeiconsIcon icon={Settings} />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </NavLink>
          {user && (
            <NavUser user={user} />
          )}
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
