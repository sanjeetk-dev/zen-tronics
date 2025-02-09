import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Category from "../components/Category";
import { useSelector } from "react-redux";


const images = [
  "/ir-sensor.jpg",
  "/arduino-uno-2.jpg",
  "/arduino-uno.jpg",
];


const categories = [
  { id: "microcontrollers", name: "Microcontrollers" },
  { id: "sensors", name: "Sensors & Modules" },
  { id: "power", name: "Power & Batteries" },
  { id: "robotics", name: "Robotics & Motors" },
  { id: "displays", name: "Displays & LEDs" },
];

const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Countdown Timer Logic (For Offer)
  useEffect(() => {
    const countdownDate = new Date().getTime() + 2 * 24 * 60 * 60 * 1000; // 2 days from now

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-background text-white pb-4">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center ">
        <div className="container mx-auto px-6 lg:flex lg:items-center lg:justify-between lg:space-x-2">

          {/* Techy Text & Offer */}
          <motion.div
            className="max-w-2xl text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-500 to-indigo-400 text-transparent bg-clip-text">
              The Future of Technology is Here
            </h1>
            <p className="mt-4 text-lg text-text">
              Innovating, evolving, and pushing the boundaries of what's possible.
            </p>

            {/* Special Offer Section */}
            <div className="mt-6 p-4 bg-cta rounded-lg shadow-lg text-center">
              <p className="text-lg font-bold">🔥 Limited Time Offer: 20% OFF on Arduino Kits!</p>
              <p className="text-sm mt-1">Offer ends in:</p>
              <div className="flex justify-center gap-2 mt-2 text-xl font-semibold">
                <span className="p-2 bg-black rounded">{timeLeft.hours}h</span> :
                <span className="p-2 bg-black rounded">{timeLeft.minutes}m</span> :
                <span className="p-2 bg-black rounded">{timeLeft.seconds}s</span>
              </div>
              <button className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold transition">
                Grab the Deal <FaArrowRight className="inline" />
              </button>
            </div>
          </motion.div>

          {/* Image Slider */}
          <div className="relative w-full max-w-md mt-10 lg:mt-0 lg:w-1/2">
            <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
              {images.map((img, index) => (
                <motion.img
                  key={index}
                  src={img}
                  alt="Tech"
                  className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
                  style={{
                    opacity: index === currentImage ? 1 : 0,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === currentImage ? 1 : 0 }}
                  transition={{ duration: 1 }}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Categories */}
      {categories.map(({ id, name }) => (
        <Category id={id} categoryName={name} key={id} />
      ))}



      {/* Special Offers Section */}
      <section className="container mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold text-center text-gray-200">💰 Special Offers</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Dummy Special Offer Products */}
          {[
            { id: 1, name: "Arduino Uno R3", price: "₹1,299", oldPrice: "₹1,599", image: "https://source.unsplash.com/200x200/?arduino" },
            { id: 2, name: "Raspberry Pi 4", price: "₹4,499", oldPrice: "₹5,199", image: "https://source.unsplash.com/200x200/?raspberry-pi" },
            { id: 3, name: "ESP32 WiFi Module", price: "₹799", oldPrice: "₹999", image: "https://source.unsplash.com/200x200/?esp32" },
          ].map((product) => (
            <div key={product.id} className="p-4 bg-gray-800 rounded-lg hover:shadow-xl transition transform hover:scale-105">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
              <h3 className="mt-2 text-lg font-semibold truncate">{product.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-yellow-400 font-bold">{product.price}</span>
                <span className="text-gray-400 line-through">{product.oldPrice}</span>
              </div>
              <button className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md font-semibold">
                Buy Now
              </button>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default HomePage;
