import React from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBagFavoriteFreeIcons } from "@hugeicons/core-free-icons";

const AuthFooter: React.FC = () => {
  return (
    <footer className="w-full flex items-center justify-center gap-4 p-4 px-10 bg-transparent text-sm text-muted-foreground">
      <Link to="/" className="flex items-center gap-2">
        <HugeiconsIcon icon={ShoppingBagFavoriteFreeIcons} className="opacity-80" />
        <span className="font-medium">Quick Cart</span>
      </Link>

      <span className="opacity-60">|</span>

      <div className="flex items-center gap-4 opacity-80">
        <Link to="/terms" className="hover:underline">
          Terms
        </Link>
        <Link to="/privacy" className="hover:underline">
          Privacy
        </Link>
      </div>

      <span className="ml-6 opacity-60">© {new Date().getFullYear()} Quick Cart</span>
    </footer>
  );
};

export default AuthFooter;
