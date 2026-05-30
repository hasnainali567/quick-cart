import AuthLayout from "@/components/layout/AuthLayout";
import Layout from "@/components/layout/Layout";
import StoreLayout from "@/components/layout/StoreLayout";
import { useSession } from "@/lib/auth";
import Home from "@/pages/Home";

const Login = lazy(() => import("@/pages/auth/Login"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const Dashboard = lazy(() => import("@/pages/store/Dashboard"));
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Router = () => {
  const { data, isPending } = useSession();
  const user = data?.user;
  console.log(user);

  return (
    <Suspense
      fallback={<div className="fixed top-0 w-full h-1 bg-white"></div>}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        {!isPending && !user && (
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Route>
        )}
        {!isPending &&
          user &&
          (user as { role?: string }).role === "CUSTOMER" && (
            <Route element={<Layout />}>
              <Route
                path="/driver/register"
                element={<div>Driver Register</div>}
              />
              <Route path="*" element={<Navigate to={"/"} />} />
            </Route>
          )}
        {!isPending &&
          user &&
          (user as { role?: string }).role === "STORE_ADMIN" && (
            <>
              <Route path="/store" element={<StoreLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<div>Product</div>} />
                <Route path="products/:slug" element={<div>Product id</div>} />
                <Route path="categories" element={<div>Category</div>} />
                <Route
                  path="categories/:slug"
                  element={<div>category id</div>}
                />
                <Route path="orders" element={<div>Orders</div>} />
                <Route path="earnings" element={<div>Earnings</div>} />
                <Route path="settings" element={<div>Sttings</div>} />
                <Route path="*" element={<Navigate to={"/store/dashboard"} />} />
              </Route>
              <Route path="*" element={<Navigate to={"/"} />} />
            </>
          )}
        {!isPending &&
          user &&
          (user as { role?: string }).role === "SUPER_ADMIN" && (
            <Route path="/admin" element={<Layout />}>
              <Route path="dashboard" element={<div>Admin Dashboard</div>} />
            </Route>
          )}
      </Routes>
    </Suspense>
  );
};

export default Router;
