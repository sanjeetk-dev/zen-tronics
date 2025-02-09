import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTag, FaShoppingCart, FaBolt, FaRupeeSign, FaInfoCircle } from "react-icons/fa";

const products = [
  {
    id: "1",
    name: "Arduino Uno",
    price: 1500,
    discount: 10,
    images: [
      "https://source.unsplash.com/400x300/?arduino",
      "https://source.unsplash.com/400x300/?electronics",
    ],
    description: "The best microcontroller for beginners and pros alike.",
  },
  {
    id: "2",
    name: "Raspberry Pi 4",
    price: 5000,
    discount: 15,
    images: [
      "https://source.unsplash.com/400x300/?raspberrypi",
      "https://source.unsplash.com/400x300/?tech",
    ],
    description: "A small but powerful computer for your projects.",
  },
  {
    id: "3",
    name: "IR Sensor Module",
    price: 300,
    discount: 5,
    images: [
      "https://source.unsplash.com/400x300/?sensor",
      "https://source.unsplash.com/400x300/?robotics",
    ],
    description: "A high-quality infrared sensor for smart applications.",
  },
];

const ProductPage = () => {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);
  const [currentImage, setCurrentImage] = useState(0);

  if (!product) return <h2 className="text-center mt-10 text-red-500">Product not found!</h2>;

  const discountAmount = (product.price * product.discount) / 100;
  const finalPrice = product.price - discountAmount;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row">
        
        {/* Image Slider */}
        <div className="relative w-full md:w-1/2">
          <motion.img
            key={currentImage}
            src={product.images[currentImage]}
            alt={product.name}
            className="w-full h-72 object-cover rounded-lg shadow-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <div className="flex mt-3 justify-center space-x-3">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  currentImage === index ? "border-indigo-600" : "border-gray-300"
                }`}
              >
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 md:ml-6 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            {product.name} <FaTag className="ml-2 text-indigo-600" />
          </h1>
          <p className="mt-2 text-gray-600 flex items-center">
            <FaInfoCircle className="mr-2 text-gray-500" /> {product.description}
          </p>

          <div className="mt-4 flex items-center space-x-2">
            <FaTag className="text-red-500 text-lg" />
            <span className="text-red-500 font-bold">{product.discount}% OFF</span>
            <span className="ml-2 line-through text-gray-500 flex items-center">
              <FaRupeeSign /> {product.price}
            </span>
            <span className="ml-2 text-2xl font-semibold text-green-600 flex items-center">
              <FaRupeeSign /> {finalPrice}
            </span>
          </div>

          <div className="mt-6 flex space-x-4">
            <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg flex items-center hover:bg-indigo-700">
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
            <button className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg flex items-center hover:bg-green-700">
              <FaBolt className="mr-2" /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
