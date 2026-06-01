import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout.jsx";
import { ProtectedRoute } from "./components/layout/ProtectedRoute.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.jsx"));
const ProductPage = lazy(() => import("./pages/ProductPage.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.jsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.jsx"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage.jsx"));
const AccountPage = lazy(() => import("./pages/AccountPage.jsx"));
const WishlistPage = lazy(() => import("./pages/WishlistPage.jsx"));
const SellerDashboard = lazy(() => import("./pages/seller/SellerDashboard.jsx"));
const SellerProducts = lazy(() => import("./pages/seller/SellerProducts.jsx"));
const SellerProductForm = lazy(() => import("./pages/seller/SellerProductForm.jsx"));
const SellerOrders = lazy(() => import("./pages/seller/SellerOrders.jsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.jsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.jsx"));

const user = (element) => <ProtectedRoute>{element}</ProtectedRoute>;
const seller = (element) => <ProtectedRoute roles={["seller", "admin"]}>{element}</ProtectedRoute>;
const admin = (element) => <ProtectedRoute roles={["admin"]}>{element}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={user(<CartPage />)} />
        <Route path="/checkout" element={user(<CheckoutPage />)} />
        <Route path="/orders" element={user(<OrdersPage />)} />
        <Route path="/orders/:id" element={user(<OrderDetailPage />)} />
        <Route path="/account" element={user(<AccountPage />)} />
        <Route path="/wishlist" element={user(<WishlistPage />)} />
        <Route path="/seller/dashboard" element={seller(<SellerDashboard />)} />
        <Route path="/seller/products" element={seller(<SellerProducts />)} />
        <Route path="/seller/products/new" element={seller(<SellerProductForm />)} />
        <Route path="/seller/orders" element={seller(<SellerOrders />)} />
        <Route path="/admin/users" element={admin(<AdminUsers />)} />
        <Route path="/admin/orders" element={admin(<AdminOrders />)} />
        <Route path="/admin/categories" element={admin(<AdminCategories />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
