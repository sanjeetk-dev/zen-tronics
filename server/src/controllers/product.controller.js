import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  uploadOnCloudinary,
  deleteMultipleFromCloudinary,
  deleteFromCloudinary,
} from '../utils/cloudinary.js';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { DefectiveProduct } from '../models/defect.product.model.js';

const uploadImagesToCloudinary = async (imageFiles) => {
  return await Promise.all(
    imageFiles.map(async (file) => {
      const uploadResult = await uploadOnCloudinary(file.path);
      return { url: uploadResult.secure_url, public_id: uploadResult.public_id };
    })
  );
};


const addProducts = asyncHandler(async (req, res) => {
  const products = req.body.products;

  if (!Array.isArray(products) || products.length === 0) {
    throw new ApiError(400, "Provide an array of products");
  }

  const imageFiles = req.files || [];
  if (imageFiles.length === 0) {
    throw new ApiError(400, "Upload at least 1 product image");
  }

  // Upload images once and use for all products
  const uploadedImages = await uploadImagesToCloudinary(imageFiles);

  // Process all products concurrently
  const results = await Promise.allSettled(
    products.map(async (productData) => {
      try {
        const { name, description, price, discount, totalQuantity, category, isFeatured, cost } = productData;

        if (!name || !description || !price || !totalQuantity || !category || !cost) {
          throw new Error(`Missing fields for product: ${name}`);
        }

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) throw new Error(`Category not found for product: ${name}`);

        // Create product
        const newProduct = await Product.create({
          name,
          description,
          price,
          cost,
          discountPercentage: discount || 0,
          stock: totalQuantity,
          totalQuantity,
          category,
          isFeatured: isFeatured || false,
          images: uploadedImages, // Use the uploaded images for all products
        });

        return { status: "fulfilled", product: newProduct };
      } catch (error) {
        return { status: "rejected", reason: error.message };
      }
    })
  );

  // Separate successful and failed uploads
  const successfulUploads = results.filter((r) => r.status === "fulfilled").map((r) => r.product);
  const failedUploads = results.filter((r) => r.status === "rejected").map((r) => r.reason);

  res.status(201).json(
    new ApiResponse(201, { successfulUploads, failedUploads }, "Batch product upload completed")
  );
});

const updateQuantityById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { action, quantity, reason } = req.body;

  if (!action || !quantity || quantity <= 0) {
    throw new ApiError(400, "Valid action and quantity are required");
  }

  let updateQuery = {};
  let defectiveEntry = null;

  if (action === "add") {
    updateQuery = { $inc: { stock: quantity, totalQuantity: quantity } };
  } else if (action === "remove") {
    updateQuery = { $inc: { stock: -quantity } };
  } else if (action === "defective") {
    updateQuery = { $inc: { stock: -quantity } };
    defectiveEntry = {
      product: productId,
      quantity,
      reason,
    };
  } else {
    throw new ApiError(400, "Invalid action");
  }

  const product = await Product.findOneAndUpdate({ _id: productId, stock: { $gte: quantity } }, updateQuery, {
    new: true,
  });

  if (!product) throw new ApiError(404, "Product not found or insufficient stock");

  if (defectiveEntry) {
    await DefectiveProduct.create(defectiveEntry);
  }

  res.status(200).json(new ApiResponse(200, product, `Product quantity updated successfully (${reason || action})`));
});

const getAllProducts = asyncHandler(async (req, res) => {
  let { filter, page = 1, limit = 10, showDeleted = "false", search = "" } = req.query;

  // Convert values to correct types
  page = parseInt(page);
  limit = parseInt(limit);
  const includeDeleted = showDeleted === "true";

  let matchCondition = { isDeleted: includeDeleted };

  // **Search by product name (case-insensitive, starts with the search term)**
  if (search) {
    matchCondition.name = { $regex: `${search}`, $options: "i" };
  }

  // **Apply stock filters**
  if (filter === "inStock") {
    matchCondition.stock = { $gt: 0 };
  } else if (filter === "outOfStock") {
    matchCondition.stock = 0;
  } else if (filter === "lowStock") {
    matchCondition.stock = { $lt: 10 };
  }

  // **Fetch products from database**
  const products = await Product.aggregate([
    { $match: matchCondition },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryData",
      },
    },
    {
      $addFields: {
        categoryName: { $arrayElemAt: ["$categoryData.name", 0] },
      },
    },
    { $project: { categoryData: 0 } },
    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        stock: 1,
        totalQuantity: 1,
        images: 1,
        categoryName: 1,
        isFeatured: 1,
        isDeleted: 1,
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  // **Get total product count (with the same filter)**
  const totalProducts = await Product.countDocuments(matchCondition);

  const responseData = {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
    totalProducts,
  };

  res.status(200).json(new ApiResponse(200, responseData, "Fetched from database"));
});

const updateProductImageById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { action } = req.body;
  const images = req.files;

  // Validate productId and action
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
  if (!action || (action !== "add" && action !== "replace")) {
    throw new ApiError(400, "Invalid action. Must be 'add' or 'replace'");
  }

  // Find product by ID
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (action === "replace") {
    // Delete old images from Cloudinary
    const publicIds = product.images.map((img) => img.public_id);
    const deleteResult = await deleteMultipleFromCloudinary(publicIds);

    if (!deleteResult) {
      throw new ApiError(500, "Failed to delete old images from Cloudinary");
    }

    // Upload new images
    product.images = uploadImagesToCloudinary(images);
    await product.save();
  } else {
    product.images.push(...(await uploadImagesToCloudinary(images)));
    
  }
  await product.save();
  res.status(200).json(new ApiResponse(200, product, "Images updated successfully"));
});

const removeProductImageById = asyncHandler(async(req,res) => {
  const {productId} = req.params;
  
  const product = await Product.findById(productId)
  
  if(!product) throw new ApiError(404, 'Product not found')
  
  
  const publicIds = product.images.map((img) => img.public_id);
  const deleteResult = await deleteMultipleFromCloudinary(publicIds);

  if (!deleteResult) {
    throw new ApiError(500, "Failed to delete old images from Cloudinary");
  }
  
  res.status(200).json(new ApiResponse(200, {} , "Prodtct image Removed successfully"))
})

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate("category");

  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

const softDeleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findByIdAndUpdate(
    productId,
    { isDeleted: true },
    { new: true } // Return the updated document
  );

  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(new ApiResponse(200, product, "Product deleted successfully"));
});

const restoreProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findByIdAndUpdate(
    productId,
    { isDeleted: false },
    { new: true }
  );


  res.status(200).json(new ApiResponse(200, product, "Product restored successfully"));
});


const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const products = await Product.find({ category: categoryId, isDeleted: false });

  res.status(200).json(new ApiResponse(200, products, "Products by category fetched successfully"));
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updateData = req.body;

  const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });
  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});




export { 
  addProducts,
  updateQuantityById,
  getAllProducts,
  updateProductImageById,
  removeProductImageById,
  getProductById,
  softDeleteProduct,
  restoreProduct,
  getProductsByCategory,
  updateProductDetails
};