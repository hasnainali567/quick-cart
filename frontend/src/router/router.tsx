import AdminLayout from "@/layouts/AdminLayout";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import StoreLayout from "@/layouts/StoreLayout";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Home from "@/pages/home/home";
import { Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/store/dashboard";
import Products from "@/pages/store/products";

const Router = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute allowedRole="STORE_ADMIN" />}>
          <Route path="/store" element={<StoreLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Dashboard />} />
            <Route path="earnings" element={<Dashboard />} />
            <Route path="settings" element={<Dashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRole="SUPER_ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<div>Admin Dashboard</div>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
