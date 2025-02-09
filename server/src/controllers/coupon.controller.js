import {asyncHandler} from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Coupon } from "../models/coupon.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from '../utils/ApiError.js'

const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, maxLimit, minOrderAmount, startDate, expiry, applicableCategories } = req.body;

  if (!code || !discount || !maxLimit || !expiry || !startDate) {
    throw new ApiError(400, "All required fields (code, discount, maxLimit, startDate, expiry) must be provided.");
  }
  if (new Date(startDate) >= new Date(expiry)) {
    throw new ApiError(400, "Start date must be before expiry date.");
  }

  // Ensure expiry is a future date
  if (new Date(expiry) <= new Date()) {
    throw new ApiError(400, "Expiry date must be in the future.");
  }

  // Ensure unique coupon code (case-insensitive)
  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    throw new ApiError(400, "Coupon code already exists.");
  }

  // Create coupon
  const newCoupon = await Coupon.create({
    code: code.toUpperCase().trim(),
    discount,
    maxLimit,
    minOrderAmount,
    startDate,
    expiry,
    applicableCategories: applicableCategories || [],
  });

  res.status(201).json(new ApiResponse(201, newCoupon, "Coupon created successfully!"));
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  if (!coupons.length) {
    throw new ApiError(404, "No coupons found.");
  }

  res.status(200).json(new ApiResponse(200, coupons, "Coupons retrieved successfully."));
});

const getCouponById = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new ApiError(404, "Coupon not found.");
  }

  res.status(200).json(new ApiResponse(200, coupon, "Coupon details retrieved successfully."));
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  const { code, discount, maxLimit, minOrderAmount, startDate, expiry, applicableCategories } = req.body;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new ApiError(404, "Coupon not found.");
  }

  // Validate new start & expiry dates
  if (startDate && expiry && new Date(startDate) >= new Date(expiry)) {
    throw new ApiError(400, "Start date must be before expiry date.");
  }

  // Prevent expired coupons from being activated
  if (expiry && new Date(expiry) <= new Date()) {
    throw new ApiError(400, "Expiry date must be in the future.");
  }

  // Update fields
  coupon.code = code?.toUpperCase().trim() || coupon.code;
  coupon.discount = discount ?? coupon.discount;
  coupon.maxLimit = maxLimit ?? coupon.maxLimit;
  coupon.minOrderAmount = minOrderAmount ?? coupon.minOrderAmount;
  coupon.startDate = startDate ?? coupon.startDate;
  coupon.expiry = expiry ?? coupon.expiry;
  coupon.applicableCategories = applicableCategories ?? coupon.applicableCategories;

  await coupon.save();

  res.status(200).json(new ApiResponse(200, coupon, "Coupon updated successfully."));
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findByIdAndDelete(couponId);
  if (!coupon) {
    throw new ApiError(404, "Coupon not found.");
  }

  res.status(200).json(new ApiResponse(200, {}, `Coupon #${coupon._id} (${coupon.code}) deleted successfully.`));
});

const getApplicableCoupons = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch user's cart
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "category",
  });

  if (!cart || cart.items.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Cart is empty"));
  }

  // Extract unique category IDs from cart items
  const categoryIds = [...new Set(cart.items.map(item => item.product.category.toString()))];

  // Find applicable coupons based on category
  const coupons = await Coupon.find({
    isActive: true,
    expiry: { $gte: new Date() },
    $or: [
      { applicableCategories: { $in: categoryIds } },
      { applicableCategories: { $size: 0 } }
    ]
  }).select("code discount expiry applicableCategories");

  res.status(200).json(new ApiResponse(200, coupons, "Applicable coupons fetched"));
});


export {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getApplicableCoupons
};