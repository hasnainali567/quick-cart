import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import { useSession } from "@/lib/auth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (!session.isPending && session.data?.user) {
      navigate("/", { replace: true });
    }
  }, [session.isPending, session.data?.user, navigate]);

  return (
    <div className="min-h-screen h-fit overflow-auto flex flex-col ">
      <AuthHeader />
      <Outlet />
      <AuthFooter />
    </div>
  );
};

export default AuthLayout;
