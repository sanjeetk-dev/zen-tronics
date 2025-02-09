import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle as User, FaShoppingCart } from "react-icons/fa";
import { Menu, Search, X, Home, BookOpen, Phone, Info } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(2); // Replace with dynamic cart state
  const location = useLocation();
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.user)
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const toggleScrollLock = () => {
      if (isSidebarOpen || isSearchOpen) {
        document.body.classList.add('scroll-lock');
      } else {
        document.body.classList.remove('scroll-lock');
      }
    };
    toggleScrollLock();
    return () => {
      document.body.classList.remove('scroll-lock');
    };
  }, [isSidebarOpen, isSearchOpen]);


  const navLinks = [
    { title: "Home", href: "/", icon: Home },
    { title: "About", href: "/about", icon: Info },
    { title: "Support", href: "/support", icon: BookOpen },
    { title: "Contact", href: "/contact", icon: Phone },
    { title: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className={`w-full top-0 z-50 transition-all ${isScrolled ? "shadow-md fixed " : ""} bg-navbar text-text`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center" onClick={() => navigate("/")}>
              <svg width="150" height="40" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                <polyline points="10,10 30,10 15,30 35,30 20,50"
                  stroke="url(#gradient)" strokeWidth="4" fill="none" />
                <text x="50" y="40" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="url(#gradient)">
                  VoltX
                </text>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97aff" />
                    <stop offset="100%" stopColor="#6a0dad" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(({ title, href }) => (
                <Link
                  key={title}
                  to={href}
                  className={`text-lg px-3 py-2 rounded-md transition ${location.pathname === href ? "text-primary" : "text-gray-600 hover:text-indigo-600"}`}
                >
                  {title}
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Button */}
              <button onClick={() => setIsSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-100 transition">
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              {user ? (
                <div className="relative">
                  <button className="text-accent focus:outline-none" onClick={() => navigate('/cart')}>
                    <FaShoppingCart size={24} />
                  </button>
                  {user.totalCartQuantity > 0 && (
                    <div className="h-4 w-4 rounded-full bg-cta absolute top-[-6px] right-[-6px] flex items-center justify-center text-xs text-text">
                      {user.totalCartQuantity > 9 ? "9+" : user.totalCartQuantity}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    className="text-text bg-primary px-4 py-2 rounded-md hover:bg-opacity-80 transition"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                </div>
              )}
              {/* Cart Icon */}
              {/* Profile Dropdown */}
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="p-2 rounded-full hover:bg-gray-100 transition text-accent ">
                  <User className="h-5 w-5" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg py-2 rounded-md border z-50">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Settings</Link>
                    <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Logout</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Right Section */}
            <div className="md:hidden flex items-center space-x-3 h-auto">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 rounded-md hover:bg-gray-100 transition">
                <Search className="h-6 w-6 text-gray-600" />
              </button>

              <div className="relative">
                <button className="text-primary focus:outline-none" onClick={() => navigate('/cart')}>
                  <FaShoppingCart size={24} />
                </button>
                {user.totalCartQuantity > 0 && (
                  <div className="h-4 w-4 rounded-full bg-cta absolute top-[-6px] right-[-6px] flex items-center justify-center text-xs text-text">
                    {user.totalCartQuantity > 9 ? "9+" : user.totalCartQuantity}
                  </div>
                )}
              </div>
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100 transition">
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl p-6 bg-white rounded-xl shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Search</h2>
              <button onClick={() => setIsSearchOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 md:hidden transition-transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} bg-sidebar`}>
        <div className="absolute top-4 right-4">
          <button onClick={() => setIsSidebarOpen(false)} className="text-2xl">&times;</button>
        </div>
        <nav className="mt-8 space-y-4 p-6">
          {navLinks.map(({ title, href, icon: Icon }) => (
            <Link
              key={title}
              to={href}
              className={`flex p-4 items-center space-x-3 text-lg px-4 py-2 rounded-md ${location.pathname === href ? "bg-cta text-white" : "hover:bg-gray-200"}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span>{title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
