import { Router } from "express";
const router = Router();

import {
  addProducts,
  updateQuantityById,
  getAllProducts,
  updateProductImageById,
  removeProductImageById,
  getProductById,
  softDeleteProduct,
  restoreProduct,
  getProductsByCategory,
  updateProductDetails,
} from "../controllers/product.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { isAuthenticated, protectAdmin } from "../middlewares/auth.middleware.js";

// 🔹 Routes

// ✅ Public Routes
router.route("/")
  .get(getAllProducts); // Fetch all products (public access)

// 🔒 Admin-Protected Routes
router.route("/")
  .post(protectAdmin, upload.array("images", 6), addProducts); // Add a new product

router.route("/:productId")
  .get(getProductById) // ✅ Public: Get product by ID
  .put(protectAdmin, updateProductDetails) 
  .delete(protectAdmin, softDeleteProduct);
  
router.route("/:productId/restore")
  .patch(protectAdmin, restoreProduct); // 🔒 Restore a soft-deleted product

router.route("/:productId/quantity")
  .put(protectAdmin, updateQuantityById); // 🔒 Update product stock quantity

router.route("/:productId/images")
  .post(protectAdmin, upload.array("images", 6), updateProductImageById) // 🔒 Upload product images
  .delete(protectAdmin, removeProductImageById); // 🔒 Remove a specific product image

router.route("/category/:categoryId")
  .get(getProductsByCategory);
  
  
export default router;
