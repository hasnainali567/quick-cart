"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSession, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingBagFavoriteFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store,
  Logout,
  DashboardSquareIcon,
  Boxes,
  Truck,
  Money,
  Setting06Icon,
  Profile,
  CatalogueIcon,
  Users,
  Bell,
  CustomerSupportIcon,
} from "@hugeicons/core-free-icons";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Partners", href: "#partners" },
  { label: "Drivers", href: "#drivers" },
  { label: "Contact", href: "#contact" },
];

const LandingLayout = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data, isPending } = useSession();
  const user = data?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Navigation */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200/50 dark:border-zinc-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600">
              <HugeiconsIcon
                icon={ShoppingBagFavoriteFreeIcons}
                className="size-5 text-white"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              QuickCart
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isPending ? null : user ? (
              <>
                {/* Notification Button (separate, not a dropdown trigger here) */}
                <Button variant="ghost" size="icon" className="relative h-10 w-10">
                  <HugeiconsIcon icon={Bell} className="size-5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" />
                  {/* Notification badge - dummy */}
                  <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center">
                    <div className="h-2.5 w-2.5 bg-red-500 rounded-full" />
                  </div>
                </Button>

                {/* Support Button (separate, dummy) */}
                <Button variant="outline" size="sm">
                  <HugeiconsIcon icon={CustomerSupportIcon} className="mr-2 size-4" />
                  Support
                </Button>

                {/* Profile Button with Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* This button is the SINGLE child of DropdownMenuTrigger */}
                    <button className="flex items-center gap-2 rounded-full p-0.5 pr-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <Avatar className="size-8">
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback className="text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden sm:inline">
                        {user.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  {/* The rest of the dropdown content remains the same */}
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <p className="text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    {user.role === "STORE_ADMIN" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/store/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={Store} className="size-4" />
                            Store Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {/* Additional STORE_ADMIN actions */}
                        <DropdownMenuItem asChild>
                          <Link to="/store/products" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={Boxes} className="size-4" />
                            My Products
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/store/orders" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={Truck} className="size-4" />
                            Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/store/earnings" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={Money} className="size-4" />
                            Earnings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/store/settings" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={Setting06Icon} className="size-4" />
                            Store Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {user.role === "SUPER_ADMIN" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={DashboardSquareIcon} className="size-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                        {/* Additional SUPER_ADMIN actions */}
                        <DropdownMenuItem asChild>
                          <Link to="/admin/users" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={Users} className="size-4" />
                            Users
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/stores" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={Store} className="size-4" />
                            Stores
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/products" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={Boxes} className="size-4" />
                            Products
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/categories" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={CatalogueIcon} className="size-4" />
                            Categories
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/drivers" className="flex items-center gap-2 cursor-pointer">
                            <HugeiconsIcon icon={Truck} className="size-4" />
                            Drivers
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {user.role === "CUSTOMER" && (
                      <DropdownMenuItem asChild>
                        <Link to="/register-store" className="flex items-center gap-2 cursor-pointer">
                          <HugeiconsIcon icon={Store} className="size-4" />
                          Register a Store
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {/* Add customer specific links if applicable */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => signOut()}
                    >
                      <HugeiconsIcon icon={Logout} className="size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-sm" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  asChild
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <Outlet />

      {/* Footer */}
      <footer id="contact" className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600">
                  <HugeiconsIcon
                    icon={ShoppingBagFavoriteFreeIcons}
                    className="size-5 text-white"
                  />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  QuickCart
                </span>
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                Your everyday essentials delivered in minutes. Fresh, fast, and
                reliable.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Platform</h4>
              <ul className="space-y-3">
                {["Features", "Pricing", "Coverage", "Download"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Press"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                {["Help Center", "Safety", "Terms", "Privacy"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} QuickCart. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
