import AdminLayout from "@/layouts/AdminLayout";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import StoreLayout from "@/layouts/StoreLayout";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import { SuspenseWithLoader } from "@/components/global/SuspenseWithLoader";
import { lazy } from "react";

const Dashboard = lazy(() => import("@/pages/store/dashboard"));
const Products = lazy(() => import("@/pages/store/products"));
const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const Home = lazy(() => import("@/pages/home/home"));
const Categories = lazy(() => import("@/pages/store/categories"));
const AddProduct = lazy(() => import("@/pages/store/addProduct"));

const Router = () => {
  return (
    <SuspenseWithLoader>
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
              <Route path="add-product" element={<AddProduct />} />
              <Route path="orders" element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
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
    </SuspenseWithLoader>
  );
};

export default Router;
