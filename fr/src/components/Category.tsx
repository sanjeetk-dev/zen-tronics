import { Link } from "react-router-dom";
import React from 'react'
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CategoryProps {
  categoryName: string;
  id: string;
}

const Category: React.FC<CategoryProps> = ({ categoryName, id }) => {
  const products: Product[] = [
    { id: 1, name: "Arduino Uno R3 Development Board", price: 799, image: "https://source.unsplash.com/300x200/?electronics" },
    { id: 2, name: "Raspberry Pi 4 Model B", price: 4200, image: "https://source.unsplash.com/300x200/?circuit" },
    { id: 3, name: "ESP8266 WiFi Module", price: 250, image: "https://source.unsplash.com/300x200/?wifi" },
    { id: 4, name: "Lithium-Ion Battery 3.7V", price: 399, image: "https://source.unsplash.com/300x200/?battery" },
    { id: 5, name: "OLED Display Module", price: 699, image: "https://source.unsplash.com/300x200/?display" },
    { id: 6, name: "Relay Module 5V", price: 150, image: "https://source.unsplash.com/300x200/?relay" },
    { id: 7, name: "Servo Motor SG90", price: 299, image: "https://source.unsplash.com/300x200/?motor" },
    { id: 8, name: "Breadboard 830 Points", price: 99, image: "https://source.unsplash.com/300x200/?breadboard" },
    { id: 9, name: "Jumper Wires (Male to Male)", price: 79, image: "https://source.unsplash.com/300x200/?wires" },
    { id: 10, name: "L298N Motor Driver Module", price: 549, image: "https://source.unsplash.com/300x200/?driver" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-400 text-transparent bg-clip-text">{categoryName}</h2>

      {/* Horizontal Scrollable Product Row */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-6">
        {products.slice(0, 10).map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg p-3 min-w-[180px] sm:min-w-[220px] md:min-w-[250px] transition-transform hover:scale-105 cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-sm font-semibold mt-2 truncate text-text" title={product.name}>
              {product.name}
            </h3>
            <p className="text-lg font-bold text-gray-800">₹{product.price}</p>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <div className="text-right mt-4">
        <Link to={`/category/${id}`} className="text-blue-500 font-semibold hover:underline">
          See All →
        </Link>
      </div>
    </div>
  );
};

export default Category;
