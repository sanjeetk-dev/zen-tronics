import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand & Tagline */}
        <div>
          <h2 className="text-2xl font-bold">⚡ VoltX</h2>
          <p className="mt-2 text-gray-400">Powering your innovations with the best electronic components.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/shop" className="hover:text-white transition">Shop</Link></li>
            <li><Link to="/categories" className="hover:text-white transition">Categories</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition"><FaFacebook size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><FaInstagram size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><FaTwitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><FaLinkedin size={24} /></a>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Subscribe</h3>
          <p className="text-gray-400">Get exclusive deals & latest updates.</p>
          <div className="mt-3 flex">
            <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 rounded-l-md text-black focus:outline-none" />
            <button className="px-4 bg-yellow-400 text-black rounded-r-md hover:bg-yellow-300 transition">Join</button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
        <p>&copy; {new Date().getFullYear()} VoltX. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
