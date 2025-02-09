import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom"; // Assuming React Router is used

const CartPage = () => {
  // Dummy cart data
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Arduino Uno R3",
      image: "https://source.unsplash.com/200x200/?arduino",
      price: 1200,
      discount: 20, // 20% discount
      quantity: 1,
    },
    {
      id: 2,
      name: "Raspberry Pi 4",
      image: "https://source.unsplash.com/200x200/?raspberrypi",
      price: 4000,
      discount: 15, // 15% discount
      quantity: 1,
    },
  ]);

  const shippingCharge = 50;
  const shippingDiscount = 10;

  // Function to calculate discount
  const calculateDiscount = (price, discount) => (price * discount) / 100;

  // Update Quantity
  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Calculate totals
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce(
    (acc, item) => acc + calculateDiscount(item.price, item.discount) * item.quantity,
    0
  );
  const payableAmount = totalAmount - totalDiscount + shippingCharge - shippingDiscount;
  const totalSaved = totalDiscount + shippingDiscount;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>

      {/* Check if Cart is Empty */}
      {cart.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center h-80"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src="https://source.unsplash.com/300x300/?empty,cart"
            alt="Empty Cart"
            className="w-48 h-48"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <h2 className="text-xl font-semibold text-gray-600 mt-4">Your cart is empty!</h2>
          <p className="text-gray-500">Looks like you haven't added anything yet.</p>
          <Link
            to="/shop"
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition"
          >
            Shop Now
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="max-w-4xl mx-auto space-y-6">
            {cart.map((item) => {
              const discountAmount = calculateDiscount(item.price, item.discount);
              const finalPrice = item.price - discountAmount;

              return (
                <motion.div
                  key={item.id}
                  className="flex items-center bg-white p-4 rounded-lg shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Product Image */}
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />

                  {/* Product Details */}
                  <div className="ml-4 flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h2>
                    <p className="text-sm text-red-500 font-medium">{item.discount}% OFF</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-gray-500 line-through text-sm">₹{item.price}</p>
                      <p className="text-green-600 font-bold text-lg">₹{finalPrice}</p>
                    </div>
                    <p className="text-sm text-gray-600">You save ₹{discountAmount}</p>
                  </div>

                  {/* Quantity Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full ml-4"
                  >
                    <FaTrash size={18} />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
            <div className="flex justify-between text-gray-700">
              <p>Total Amount:</p>
              <p>₹{totalAmount}</p>
            </div>
            <div className="flex justify-between text-red-500">
              <p>Discount:</p>
              <p>-₹{totalDiscount}</p>
            </div>
            <div className="flex justify-between text-gray-700">
              <p>Shipping Charge:</p>
              <p>₹{shippingCharge}</p>
            </div>
            <div className="flex justify-between text-green-600">
              <p>Shipping Discount:</p>
              <p>-₹{shippingDiscount}</p>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-semibold text-lg">
              <p>Payable Amount:</p>
              <p>₹{payableAmount}</p>
            </div>
            <div className="text-green-600 text-sm text-right">Total Saved: ₹{totalSaved}</div>

            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
