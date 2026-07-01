import AdminLayout from "@/layouts/AdminLayout";
import LandingLayout from "@/layouts/LandingLayout";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import StoreLayout from "@/layouts/StoreLayout";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import { SuspenseWithLoader } from "@/components/global/SuspenseWithLoader";
import { lazy } from "react";

const Dashboard = lazy(() => import("@/pages/store/dashboard"));
const Products = lazy(() => import("@/pages/store/products"));
const Orders = lazy(() => import("@/pages/store/orders"));
const Earnings = lazy(() => import("@/pages/store/earnings"));
const Settings = lazy(() => import("@/pages/store/settings"));
const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const Home = lazy(() => import("@/pages/home/home"));
const Categories = lazy(() => import("@/pages/store/categories"));
const AddProduct = lazy(() => import("@/pages/store/addProduct"));
const RegisterStore = lazy(() => import("@/pages/store/registerStore"));
const Notifications = lazy(() => import("@/pages/store/notifications"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));
const AdminStores = lazy(() => import("@/pages/admin/stores"));
const AdminProducts = lazy(() => import("@/pages/admin/products"));
const AdminCategories = lazy(() => import("@/pages/admin/categories"));
const AdminDrivers = lazy(() => import("@/pages/admin/drivers"));

const Router = () => {
  return (
    <SuspenseWithLoader>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="STORE_ADMIN" />}>
            <Route path="/store" element={<StoreLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="categories" element={<Categories />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRole="CUSTOMER" />}>
            <Route path="/register-store" element={<RegisterStore />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="SUPER_ADMIN" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="stores" element={<AdminStores />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="drivers" element={<AdminDrivers />} />
              <Route path="settings" element={<AdminDrivers />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </SuspenseWithLoader>
  );
};

export default Router;
