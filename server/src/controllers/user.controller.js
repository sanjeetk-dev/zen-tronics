import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Product } from '../models/product.model.js'
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { Cart } from '../models/cart.model.js'
import mongoose from 'mongoose';


const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Aggregate total quantity from the user's cart
  const cartAggregation = await Cart.aggregate([
    { $match: { user: userId } }, // Match user's cart
    { $unwind: "$items" }, // Unwind cart items
    {
      $group: {
        _id: null,
        totalCartQuantity: { $sum: "$items.quantity" }, // Sum all quantities
      },
    },
  ]);

  // Get total quantity or default to 0 if no cart exists
  const totalCartQuantity = cartAggregation.length > 0 ? cartAggregation[0].totalCartQuantity : 0;

  // Fetch user
  const user = await User.findById(userId).select("-password").lean(); // Convert to plain object

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Add totalCartQuantity inside user object
  user.totalCartQuantity = totalCartQuantity;

  // Send user data
  res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully."));
});





const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  await user.save();
  res.status(200).json(new ApiResponse(200, user, "Profile updated successfully."));
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.avatar?.public_id) {
    await deleteFromCloudinary(user.avatar.public_id);
  }

  // Upload new profile picture
  const uploadResponse = await uploadOnCloudinary(req.file.path, "profile_pictures");

  user.profileImage = {
    url: uploadResponse.secure_url,
    public_id: uploadResponse.public_id,
  };

  await user.save();
  res.status(200).json(new ApiResponse(200, user, "Profile picture updated successfully."));
});

const toggleWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new ApiError(400, "Invalid product ID"));
  }
  

  const user = await User.findOne({ _id: userId, wishlist: productId });

  let updatedUser;
  if (user) {
    // If product is in wishlist, remove it
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );
    return res.status(200).json(new ApiResponse(200, updatedUser.wishlist, "Removed from wishlist"));
  } else {
    // If product is not in wishlist, add it
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    );
    return res.status(200).json(new ApiResponse(200, updatedUser.wishlist, "Added to wishlist"));
  }
});


const getWishlistProducts = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  // Parse pagination parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Find user and get wishlist product IDs
  const user = await User.findById(userId).select("wishlist").lean();
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const wishlistProductIds = user.wishlist || [];
  if (wishlistProductIds.length === 0) {
    return next(new ApiError(404, "No products found in wishlist"));
  }

  // Fetch wishlist products with pagination
  const products = await Product.find({ _id: { $in: wishlistProductIds } })
    .select("name price images ratings")
    .skip(skip)
    .limit(limit)
    .lean();

  // Total wishlist items
  const totalWishlistItems = wishlistProductIds.length;
  const totalPages = Math.ceil(totalWishlistItems / limit);

  const responseData = {
    products,
    totalWishlistItems,
    totalPages,
    currentPage: page,
  };

  res.status(200).json(new ApiResponse(200, responseData, "Wishlist products retrieved successfully"));
});

export {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  toggleWishlist,
  getWishlistProducts
}