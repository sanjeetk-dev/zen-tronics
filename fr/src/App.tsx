import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "./redux/slices/user.slice.ts";

import Navbar from "./components/Navbar2";
import Footer from "./components/Footer";

// Lazy-loaded pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/Cart"));
const About = lazy(() => import("./pages/About"));
const Support = lazy(() => import("./pages/Support"));
const Address = lazy(() => import("./pages/Address"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetail = lazy(() => import("./pages/OrderDeatail"));
const CategoriesPage = lazy(() => import("./pages/Category"));
const CategoryProductsPage = lazy(() => import("./pages/CategoryProducts"));
const ProductPage = lazy(() => import("./pages/Product"));

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const admin = useSelector((state) => state.admin.admin);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/v1/user/profile", { withCredentials: true });
        console.log(data)
        dispatch(setUser(data.data)); // Assuming API response contains `user`
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    
    if(!user) fetchUser();
  }, [dispatch, user]);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="h-full">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/address" element={<Address />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
            <Route path="/order/:orderId" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
          </Routes>
          <Footer />
        </div>
      </Suspense>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
