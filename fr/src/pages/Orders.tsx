import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";

const orders = [
  { id: "123456", date: "Feb 5, 2025", total: "₹1200", status: "Delivered" },
  { id: "654321", date: "Jan 20, 2025", total: "₹850", status: "Shipped" },
];

const OrderHistory = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900">
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
          <FaBoxOpen /> Your Orders
        </h1>

        {orders.length ? (
          <ul className="mt-6 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between">
                <div>
                  <strong>Order ID:</strong> {order.id} <br />
                  <strong>Date:</strong> {order.date} <br />
                  <strong>Status:</strong> {order.status}
                </div>
                <div className="text-right">
                  <strong>Total:</strong> {order.total} <br />
                  <Link
                    to={`/order/${order.id}`}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    View Details →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-6">You have no past orders.</p>
        )}
      </section>
    </div>
  );
};

export default OrderHistory;
