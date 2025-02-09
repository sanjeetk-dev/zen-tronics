import { Router } from "express";
const router = Router();

import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  deleteCoupon,
  updateCoupon,
  getApplicableCoupons
} from "../controllers/coupon.controller.js"; 

import { isAuthenticated, protectAdmin } from "../middlewares/auth.middleware.js";

// 🔹 Admin Routes (Only accessible to Admins)
router.route('/')
  .post(protectAdmin, createCoupon)   // Only admins can create coupons
  .get(protectAdmin, getAllCoupons);  // Only admins can view all coupons
  
router.route('/:couponId')
  .patch(protectAdmin, updateCoupon)  // Only admins can update a coupon
  .get(protectAdmin, getCouponById)   // Only admins can fetch a specific coupon
  .delete(protectAdmin, deleteCoupon) // Only admins can delete a coupon

// 🔹 User Routes (Authenticated Users)
router.route('/available')
  .get(isAuthenticated, getApplicableCoupons);
  
export default router;
