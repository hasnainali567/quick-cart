import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "./_components/SignupForm";
import { Link, Navigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBagFavoriteFreeIcons,
} from "@hugeicons/core-free-icons";
import { useSession } from "@/lib/auth";

export default function SignupPage() {
  const session = useSession();

  if (session && session.data?.user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <HugeiconsIcon
              icon={ShoppingBagFavoriteFreeIcons}
              className="size-6"
            />
          </div>
          <h3 className="text-lg">Quick Cart</h3>
        </Link>
        <SignupForm />
      </div>
    </div>
  );
}
