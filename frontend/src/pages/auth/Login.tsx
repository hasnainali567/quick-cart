import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "./_components/LoginForm";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBagFavoriteIcon } from "@hugeicons/core-free-icons";
import { useSession } from "@/lib/auth";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const session = useSession();

  if (session && session.data?.user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <HugeiconsIcon icon={ShoppingBagFavoriteIcon} className="size-6" />
          </div>
          <h3 className="text-lg">Quick Cart</h3>
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
