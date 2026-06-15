import { useSession } from "@/lib/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Role } from "@/types";
import TopProgressBar from "@/components/global/AuthLoader";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  allowedRole?: Role | Role[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRole, children }: ProtectedRouteProps) => {
  const { data, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
        <TopProgressBar isPending={true} />
      </div>
    );
  }

  const user = data?.user;

  if (!user) {
    // Redirect to login, but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole) {
    const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    if (!roles.includes(user.role as Role)) {
      // User is authenticated but does not have the correct role.
      // Redirect to home/root page or a specific unauthorized page.
      return <Navigate to="/" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
