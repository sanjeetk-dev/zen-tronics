import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Coupon } from "../models/coupon.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Function to dynamically update cart totals
const updateCartTotals = async (userId) => {
  // Fetch the cart for the given user
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  let totalAmount = 0;
  // Use the existing discountAmount if any; otherwise, default to 0.
  let discountAmount = cart.discountAmount || 0;
  let shippingCharge = 0;
  let taxAmount = 0;
  let shippingDiscount = 0;

  // Sum up the total amount from all cart items.
  cart.items.forEach((item) => {
    totalAmount += item.total;
  });

  // Apply dynamic shipping charge: if the total is greater than 999, shipping is free.
  shippingCharge = totalAmount > 999 ? 0 : 50;
  // Calculate shipping discount as the base shipping fee (50) if free shipping is applied.
  shippingDiscount = totalAmount > 999 ? 50 : 0;

  // Calculate GST (tax) as 18% of (totalAmount minus discountAmount)
  taxAmount = (totalAmount - discountAmount) * 0.18;

  // Update the cart document with computed values.
  cart.shippingCharge = shippingCharge;
  cart.taxAmount = taxAmount;
  cart.shippingDiscount = shippingDiscount;
  cart.totalAmount = totalAmount;
  cart.finalAmount = totalAmount - discountAmount + shippingCharge + taxAmount;

  // Save the updated cart document.
  await cart.save();
};

// **1️⃣ Get Cart**
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.aggregate([
    { $match: { user: userId } },
    { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        items: {
          $push: {
            product: "$items.product",
            quantity: "$items.quantity",
            price: "$items.price",
            total: "$items.total",
            discount: "$items.discount",
            productDetails: {
              name: "$productDetails.name",
              stock: "$productDetails.stock",
              images: "$productDetails.images",
            },
          },
        },
        totalAmount: { $first: "$totalAmount" },
        appliedCoupon: { $first: "$appliedCoupon" },
        discountAmount: { $first: "$discountAmount" },
        shippingCharge: { $first: "$shippingCharge" },
        taxAmount: { $first: "$taxAmount" },
        finalAmount: { $first: "$finalAmount" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    {
      $lookup: {
        from: "coupons",
        localField: "appliedCoupon",
        foreignField: "_id",
        as: "couponDetails",
      },
    },
    { $unwind: { path: "$couponDetails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        user: 1,
        items: 1,
        totalAmount: 1,
        appliedCoupon: {
          _id: "$couponDetails._id",
          code: "$couponDetails.code",
          discount: "$couponDetails.discount",
        },
        discountAmount: 1,
        shippingCharge: 1,
        taxAmount: 1,
        finalAmount: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!cart || cart.length === 0) throw new ApiError(404, "Cart not found");

  res.status(200).json(new ApiResponse(200, cart[0], "Cart fetched successfully"));
});

// **2️⃣ Add Item to Cart**
const addToCart = asyncHandler(async (req, res) => {
  const { product, quantity, price } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === product);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
    cart.items[itemIndex].total = cart.items[itemIndex].quantity * cart.items[itemIndex].price;
  } else {
    cart.items.push({ product, quantity, price, total: quantity * price });
  }

  await cart.save();
  await updateCartTotals(userId);

  res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

// **3️⃣ Remove Item from Cart**
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json(new ApiError(404, "Cart not found"));
  }

  // Filter out the product being removed
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  if (cart.items.length === 0) {
    // If no items left, delete the cart
    await Cart.deleteOne({ user: userId });
    return res.status(200).json(new ApiResponse(200, null, "Cart is now empty and deleted"));
  }

  await cart.save();
  await updateCartTotals(userId);

  res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

// **4️⃣ Apply Coupon**
const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;

  // Fetch cart with product details
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "category price",
  });
  if (!cart || cart.items.length === 0) {
    return res.status(404).json(new ApiError(404, "Cart is empty"));
  }

  // If a coupon is already applied, remove it and reset discount
  if (cart.appliedCoupon) {
    cart.appliedCoupon = null;
    cart.discountAmount = 0;
    await cart.save();
    await updateCartTotals(userId);
  }

  // Fetch coupon details
  const coupon = await Coupon.findOne({ code, isActive: true, expiry: { $gte: new Date() } });
  if (!coupon) {
    return res.status(400).json(new ApiError(400, "Invalid or expired coupon code"));
  }

  // Extract unique category IDs from cart items
  const cartCategoryIds = [...new Set(cart.items.map(item => item.product.category.toString()))];

  // Ensure all cart items belong to applicable categories if the coupon has restrictions
  if (coupon.applicableCategories.length > 0) {
    const isCouponValid = cartCategoryIds.every(categoryId =>
      coupon.applicableCategories.includes(categoryId)
    );
    if (!isCouponValid) {
      return res.status(400).json(new ApiError(400, "This coupon is not applicable to all items in your cart"));
    }
  }

  // Calculate new discount amount
const discountAmount = (cart.totalAmount * coupon.discount) / 100;
  cart.appliedCoupon = coupon._id;
  cart.discountAmount = discountAmount;

  await cart.save();
  await updateCartTotals(userId);

  res.status(200).json(new ApiResponse(200, cart, "Coupon applied successfully"));
});

// **5️⃣ Clear Cart**
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const response = await Cart.deleteOne({ user: userId });
  if (!response) throw new ApiError(404, "Cart not found");
  res.status(200).json(new ApiResponse(200, null, "Cart cleared successfully"));
});

export { 
  getCart, 
  addToCart, 
  removeFromCart, 
  applyCoupon, 
  clearCart 
};
