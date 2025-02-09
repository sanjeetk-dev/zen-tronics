import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaCommentDots, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const faqs = [
  { 
    question: "How can I track my order?", 
    answer: "You can track your order from the 'My Orders' section in your account. A tracking link will be provided." 
  },
  { 
    question: "What is the return policy?", 
    answer: "We offer a 7-day return policy for unused and undamaged products. Contact support for assistance." 
  },
  { 
    question: "How can I get technical support?", 
    answer: "You can contact our technical team via live chat, email, or phone for troubleshooting guidance." 
  },
  { 
    question: "Do you offer international shipping?", 
    answer: "Yes, we offer worldwide shipping. Shipping costs and delivery times vary based on location." 
  },
];

const SupportPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <motion.div
          className="text-center px-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold">Support & Help Center</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Need assistance? We're here to help! <strong>Contact us anytime</strong>.
          </p>
        </motion.div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-indigo-600 text-center">Contact Us</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Phone Support */}
            <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
              <FaPhone className="text-indigo-600 text-5xl mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Call Us</h3>
              <p className="text-gray-600 mt-2"><strong>+91 98765 43210</strong></p>
            </motion.div>

            {/* Email Support */}
            <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
              <FaEnvelope className="text-indigo-600 text-5xl mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Email Support</h3>
              <p className="text-gray-600 mt-2"><strong>support@voltx.com</strong></p>
            </motion.div>

            {/* Live Chat */}
            <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
              <FaCommentDots className="text-indigo-600 text-5xl mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Live Chat</h3>
              <p className="text-gray-600 mt-2">Chat with us for <strong>instant support</strong>.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 text-center">
        <motion.div
          className="bg-indigo-600 text-white py-10 px-6 max-w-4xl mx-auto rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-6 text-left">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white text-gray-900 p-4 my-3 rounded-lg shadow-md cursor-pointer"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  {openFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openFAQ === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <motion.div
          className="bg-gray-100 py-10 px-6 max-w-4xl mx-auto rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-indigo-600">Need More Help?</h2>
          <p className="mt-3 text-lg">
            Visit our <strong>Help Center</strong> or contact us directly.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
          >
            Contact Us
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default SupportPage;
