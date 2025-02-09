import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaUserCircle, FaCamera, FaBox, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


const ProfilePage = () => {

  const user = useSelector((state) => state.user.user)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle Name Update
  const handleSaveChanges = () => {
    setUser((prev) => ({ ...prev, name: newName }));
    setIsModalOpen(false);
  };

  // Handle Profile Picture Update
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(imageUrl);
      setUser((prev) => ({ ...prev, profilePic: imageUrl }));
    }
  };
  if (!user) {
    return (
      <h1> Login first </h1>
    )
  } else {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
          {/* Profile Picture */}
          <div className="relative w-32 h-32 mx-auto">
            {user.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <FaUserCircle className="w-full h-full text-gray-400" />
            )}
            {/* Change Profile Pic Button */}
            <label className="absolute bottom-1 right-1 bg-gray-200 p-2 rounded-full cursor-pointer">
              <FaCamera className="text-gray-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
          </div>

          {/* User Info */}
          <h2 className="text-2xl font-semibold mt-4">{user.fullName}</h2>
          <p className="text-gray-500">{user.email}</p>

          {/* Edit Profile Button */}
          <button
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg flex items-center mx-auto"
            onClick={() => setIsModalOpen(true)}
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>

          {/* Orders & Addresses Links */}
          <div className="mt-6 space-y-3">
            <Link to="/orders">
              <div className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg cursor-pointer">
                <FaBox /> My Orders
              </div>
            </Link>

            <Link to="/address">
              <div className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg cursor-pointer">
                <FaMapMarkerAlt /> My Addresses
              </div>
            </Link>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

              {/* Name Input */}
              <label className="block mb-2 font-medium">Name:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />

              {/* Email (Non-Editable) */}
              <label className="block mt-4 font-medium">Email:</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border p-2 rounded-lg bg-gray-200 cursor-not-allowed"
              />

              {/* Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }
};

export default ProfilePage;
