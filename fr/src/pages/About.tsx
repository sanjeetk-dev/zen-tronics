import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaLightbulb, FaRocket, FaUsers, FaTruck } from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <motion.div
          className="text-center px-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold">About VoltX</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Your one-stop destination for high-quality <strong>electronic modules and toolkits</strong>.  
            We bring the latest technology <strong>right to your doorstep</strong>.
          </p>
        </motion.div>
      </section>

      {/* Why Choose Us? */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-indigo-600">Why Choose Us?</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Feature 1 */}
            <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
              <FaRocket className="text-indigo-600 text-5xl mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Fast Shipping</h3>
              <p className="text-gray-600 mt-2">
                Get your electronics delivered <strong>quickly</strong> with our reliable shipping.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
              <FaLightbulb className="text-indigo-600 text-5xl mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Latest Technology</h3>
              <p className="text-gray-600 mt-2">
                We provide <strong>cutting-edge components</strong> for your next big project.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
              <FaCheckCircle className="text-indigo-600 text-5xl mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Quality Assurance</h3>
              <p className="text-gray-600 mt-2">
                Every product is <strong>tested for reliability and performance</strong>.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
              <FaUsers className="text-indigo-600 text-5xl mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Customer Support</h3>
              <p className="text-gray-600 mt-2">
                Our <strong>24/7 support</strong> ensures you get help whenever you need it.
              </p>
            </motion.div>

            {/* New Feature: Faster Delivery Support */}
            <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
              <FaTruck className="text-indigo-600 text-5xl mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Faster Delivery</h3>
              <p className="text-gray-600 mt-2">
                We offer <strong>same-day & next-day delivery</strong> in select locations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <motion.div
          className="bg-indigo-600 text-white py-10 px-6 max-w-4xl mx-auto rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold">Join the Future of Electronics</h2>
          <p className="mt-3 text-lg">
            Explore our latest modules and kits.  
            Take your projects to the <strong>next level!</strong>
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition"
          >
            Shop Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
