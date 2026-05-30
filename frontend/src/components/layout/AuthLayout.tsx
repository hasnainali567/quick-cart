import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const AuthLayout = () => {
  return (
    <div className="h-screen w-full flex flex-col bg-muted ">
      <header>header auth</header>
      <main className="flex-1 flex items-center justify-center ">
        <Toaster position="top-right"/>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
