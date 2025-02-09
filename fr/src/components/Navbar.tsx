import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState<number>(0)

  const user = {
    username: "John Doe",
    email: "john@example.com",
    isLoggedIn: true,
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className={`${isScrolled ? "fixed shadow-md top-0 opacity-100 translate-y-0" : ""} w-full z-50 transition-all duration-300`}>
      <div className="flex justify-between items-center py-4 px-6 bg-navbar text-text border-b border-gray-200">
        {/* Logo / Brand Name */}
        <div className="text-2xl font-bold text-primary">
          <Link to="/">
            <svg width="150" height="40" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
              <polyline points="10,10 30,10 15,30 35,30 20,50"
                stroke="url(#gradient)" strokeWidth="4" fill="none" />
              <text x="50" y="40" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="url(#gradient)">
                VoltX
              </text>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#d97aff" />
                  <stop offset="100%" stop-color="#6a0dad" />
                </linearGradient>
              </defs>
            </svg>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-lg hover:text-primary transition">Home</Link>
          <Link to="/shop" className="text-lg hover:text-primary transition">Shop</Link>
          <Link to="/about" className="text-lg hover:text-primary transition">About</Link>
          <Link to="/contact" className="text-lg hover:text-primary transition">Contact</Link>

          {/* Cart Icon */}
          <div className="relative">
            <button className="text-primary focus:outline-none">
              <FaShoppingCart size={24} />
            </button>
            {cartItemCount > 0 && (
              <div className="h-4 w-4 rounded-full bg-cta absolute top-[-6px] right-[-6px]  flex items-center justify-center">
                <span className="text-text text-xs">{cartItemCount > 9 ? '9+' : cartItemCount}</span>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button onClick={toggleModal} className="focus:outline-none">
              <FaUserCircle size={30} className="cursor-pointer text-accent hover:scale-110 transition" />
            </button>

            {/* Profile Dropdown Modal */}
            {isModalOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg py-2 rounded-md border">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
              </div>
            )}
          </div>
        </nav>

        {/* Hamburger Menu (Mobile) */}
        <div className="flex gap-5 md:hidden text-primary">
          <div className="relative">
            <button className="focus:outline-none">
              <FaShoppingCart size={24} />
            </button>
            {cartItemCount > 0 && (
              <div className="h-4 w-4 rounded-full bg-cta absolute top-[-6px] right-[-6px]  flex items-center justify-center">
                <span className="text-text text-xs">{cartItemCount > 9 ? '9+' : cartItemCount}</span>
              </div>
            )}
          </div>
          <button onClick={toggleSidebar} className="focus:outline-none">
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-sidebar p-6 z-50 h-full transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden text-text`}>
        <button onClick={toggleSidebar} className="text-2xl absolute top-4 right-4">&times;</button>
        <nav className="mt-8 space-y-4">
          <Link to="/" className={`block text-lg px-4 py-2 rounded-md ${location.pathname === "/" ? "bg-cta text-white" : "hover:bg-gray-200"}`} onClick={toggleSidebar}>Home</Link>
          <Link to="/shop" className={`block text-lg px-4 py-2 rounded-md ${location.pathname === "/shop" ? "bg-cta text-white" : "hover:bg-gray-200"}`} onClick={toggleSidebar}>Shop</Link>
          <Link to="/about" className={`block text-lg px-4 py-2 rounded-md ${location.pathname === "/about" ? "bg-cta text-white" : "hover:bg-gray-200"}`} onClick={toggleSidebar}>About</Link>
          <Link to="/contact" className={`block text-lg px-4 py-2 rounded-md ${location.pathname === "/contact" ? "bg-cta text-white" : "hover:bg-gray-200"}`} onClick={toggleSidebar}>Contact</Link>
          <Link to="/cart" className={`block text-lg px-4 py-2 rounded-md ${location.pathname === "/cart" ? "bg-cta text-white" : "hover:bg-gray-200"}`} onClick={toggleSidebar}>Cart</Link>
          <Link to="/profile" className={`block text-lg px-4 py-2 rounded-md ${location.pathname === "/profile" ? "bg-cta text-white" : "hover:bg-gray-200"}`} onClick={toggleSidebar}>Profile</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
