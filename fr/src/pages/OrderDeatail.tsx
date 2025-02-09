import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaTruck } from "react-icons/fa";

const orders = {
  "123456": {
    date: "Feb 5, 2025",
    status: "Delivered",
    total: "₹1200",
    paymentMethod: "Credit Card",
    estimatedDelivery: "Feb 7, 2025",
    products: [
      { name: "Arduino Uno", price: "₹699", quantity: 1 },
      { name: "IR Sensor", price: "₹299", quantity: 2 },
    ],
    address: "Sector 45, Noida, Uttar Pradesh",
  },
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const order = orders[orderId];

  if (!order) {
    return <p className="text-gray-500 text-center mt-10">Order not found!</p>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900">
      <section className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/orders" className="text-indigo-600 hover:underline font-semibold flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Orders
        </Link>

        <h1 className="text-3xl font-bold mt-4">Order Details</h1>
        <p className="text-gray-500 mt-2">Order ID: {orderId}</p>
        
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <h2 className="text-2xl font-bold text-indigo-600">Order Summary</h2>
          <ul className="mt-4 space-y-2">
            {order.products.map((product, index) => (
              <li key={index} className="flex justify-between bg-gray-100 p-3 rounded-lg">
                <strong>{product.name}</strong>
                <span>
                  {product.quantity} x {product.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment & Delivery */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-bold text-indigo-600">Payment & Delivery</h2>
          <p className="mt-2">
            <strong>Total:</strong> {order.total}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Shipping Address:</strong> {order.address}
          </p>
          <p className="text-green-600 mt-2 flex items-center">
            <FaTruck className="mr-2" /> Estimated Delivery: {order.estimatedDelivery}
          </p>
        </div>
      </section>
    </div>
  );
};

export default OrderDetails;
