import React from "react";
import { Link, useParams } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Arduino Uno",
    price: 1500,
    discount: 10,
    image: "https://source.unsplash.com/120x100/?arduino",
  },
  {
    id: 2,
    name: "Raspberry Pi 4",
    price: 5000,
    discount: 15,
    image: "https://source.unsplash.com/120x100/?raspberrypi",
  },
  {
    id: 3,
    name: "IR Sensor Module",
    price: 300,
    discount: 5,
    image: "https://source.unsplash.com/120x100/?sensor",
  },
];

const CategoryProductsPage = () => {
  const { categoryId } = useParams();

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 capitalize">
        {categoryId.replace("-", " ")} Products
      </h2>

      <div className="max-w-5xl mx-auto space-y-6">
        {products.map((product) => {
          const discountAmount = (product.price * product.discount) / 100;
          const finalPrice = product.price - discountAmount;

          return (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="flex items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-28 h-28 object-cover rounded-lg"
              />

              {/* Product Details */}
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>

                <div className="mt-1 text-gray-600">
                  <span className="text-red-500 font-bold">{product.discount}% OFF</span>
                  <span className="ml-2 line-through text-gray-500">₹{product.price}</span>
                  <span className="ml-2 text-lg font-semibold text-green-600">₹{finalPrice}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
