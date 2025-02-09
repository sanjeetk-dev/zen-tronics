import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { id: "microcontrollers", name: "Microcontrollers", image: "https://source.unsplash.com/300x200/?circuit" },
  { id: "sensors", name: "Sensors & Modules", image: "https://source.unsplash.com/300x200/?sensor" },
  { id: "power", name: "Power & Batteries", image: "https://source.unsplash.com/300x200/?battery" },
  { id: "robotics", name: "Robotics & Motors", image: "https://source.unsplash.com/300x200/?robotics" },
  { id: "displays", name: "Displays & LEDs", image: "https://source.unsplash.com/300x200/?led" },
];

const CategoriesPage = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        Explore Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {categories.map((category) => (
          <Link
            to={`/category/${category.id}`}
            key={category.id}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xl font-semibold">
                Browse {category.name}
              </span>
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
