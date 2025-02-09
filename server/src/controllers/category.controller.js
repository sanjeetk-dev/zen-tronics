import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Category } from '../models/category.model.js';

import {
  uploadOnCloudinary,
} from '../utils/cloudinary.js';


const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "All details are required");
  }

  const image = req.file;
  if (!image) {
    throw new ApiError(400, "Cover image is required");
  }

  // Upload image to Cloudinary
  const uploadImage = await uploadOnCloudinary(image.path);
  if (!uploadImage) {
    throw new ApiError(500, "Failed to upload image");
  }

  // Create category in database
  const createdCategory = await Category.create({
    name,
    description,
    image: {
      url: uploadImage.secure_url,
      public_id: uploadImage.public_id
    }
  });

  res.status(201).json(new ApiResponse(201, createdCategory, "Category created successfully"));
});

const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    {
      $lookup: {
        from: "products", 
        localField: "_id",
        foreignField: "category",
        as: "products"
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        totalProducts: { $size: "$products" },
        uniqueProductTypes: { $size: { $setUnion: ["$products.name"] } } // Count unique names
      }
    }
  ]);


  res.status(200).json(new ApiResponse(200, categories || [], "Fetched all categories with product details"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  // Soft delete the category
  await Category.findByIdAndUpdate(req.params.id, { isDeleted: true });

  // Soft delete related products
  await Product.updateMany({ category: category._id }, { isDeleted: true });

  res.status(200).json(new ApiResponse(200, {}, "Category and related products marked as deleted successfully"));
});

const restoreCategoryById = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  // Restore category
  await Category.findByIdAndUpdate(req.params.id, { isDeleted: false });

  // Restore related products
  await Product.updateMany({ category: category._id }, { isDeleted: false });

  res.status(200).json(new ApiResponse(200, {}, "Category and related products restored successfully"));
});


export { createCategory, getAllCategory, deleteCategory, restoreCategoryById };