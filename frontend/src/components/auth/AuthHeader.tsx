import React from "react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBagFavoriteFreeIcons } from "@hugeicons/core-free-icons";

const AuthHeader = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  return (
    <div className="w-full flex items-center justify-between p-4 px-10 bg-accent">
      <Link to="/" className="flex items-center gap-2">
        <HugeiconsIcon icon={ShoppingBagFavoriteFreeIcons} />
        <h3 className="text-xl font-semibold">Quick Cart</h3>
      </Link>

      {isLogin ? (
        <Button size="sm" asChild>
          <Link to="/register">Register</Link>
        </Button>
      ) : (
        <Button size="sm" asChild>
          <Link to="/login">Login</Link>
        </Button>
      )}
    </div>
  );
};

export default AuthHeader;
