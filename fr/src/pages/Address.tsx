import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AddressesPage = () => {
  
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      phone: "9876543210",
      street: "123 Tech Street",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "9898989898",
      street: "456 Innovation Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Open Modal for Adding New Address
  const openAddModal = () => {
    setNewAddress({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  // Open Modal for Editing an Existing Address
  const openEditModal = (address) => {
    setNewAddress(address);
    setEditingAddress(address.id);
    setIsModalOpen(true);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  // Save or Update Address
  const handleSaveAddress = () => {
    if (editingAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === editingAddress ? { ...newAddress, id: addr.id } : addr))
      );
    } else {
      // Add new address
      setAddresses((prev) => [...prev, { ...newAddress, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  // Delete Address
  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Addresses</h1>

      {/* Add New Address Button */}
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6"
        onClick={openAddModal}
      >
        <FaPlus /> Add New Address
      </button>

      {/* Address List */}
      <div className="w-full max-w-3xl">
        {addresses.length === 0 ? (
          <p className="text-gray-500 text-center">No addresses added yet.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
              <div>
                <strong className="text-lg">{address.name}</strong>
                <p className="text-gray-500">{address.phone}</p>
                <p className="text-gray-600">
                  {address.street}, {address.city}, {address.state} - {address.pincode}
                </p>
              </div>
              {/* Edit & Delete Buttons */}
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800" onClick={() => openEditModal(address)}>
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteAddress(address.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Address Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{editingAddress ? "Edit Address" : "Add New Address"}</h2>

            {/* Address Form */}
            <div className="mb-3">
              <label className="block text-gray-700 font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={newAddress.name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter Name"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium">Phone:</label>
              <input
                type="text"
                name="phone"
                value={newAddress.phone}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter Phone Number"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium">Street:</label>
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter Street Address"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium">City:</label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter City"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium">State:</label>
              <input
                type="text"
                name="state"
                value={newAddress.state}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter State"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium">Pincode:</label>
              <input
                type="text"
                name="pincode"
                value={newAddress.pincode}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter Pincode"
              />
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-between">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSaveAddress}>
                {editingAddress ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AddressesPage;
