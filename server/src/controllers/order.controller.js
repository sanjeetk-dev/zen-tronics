import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { Address } from "../models/address.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from 'mongoose'
import moment from 'moment'


const createOrder = asyncHandler(async (req, res, next) => {
  const { cartId, addressId, paymentMethod } = req.body;

  if (!cartId || !addressId || !paymentMethod) {
    return next(new ApiError(400, "Missing required fields: cartId, addressId, paymentMethod"));
  }

  if (!["COD"].includes(paymentMethod)) {
    return next(new ApiError(400, "Invalid payment method, only COD is available."));
  }

  // Fetch the cart with all necessary details
  const cart = await Cart.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(cartId), user: req.user._id } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        items: {
          $push: {
            productId: "$items.product",
            quantity: "$items.quantity",
            name: "$productDetails.name",
            images: "$productDetails.images",
            price: "$items.price",
            discount: "$items.discount",
            finalPrice: "$items.total",
            stock: "$productDetails.stock",
          },
        },
        totalAmount: { $first: "$totalAmount" },
        discountAmount: { $first: "$discountAmount" },
        shippingCharge: { $first: "$shippingCharge" },
        taxAmount: { $first: "$taxAmount" },
        payableAmount: { $first: "$finalAmount" },
      },
    },
  ]);

  if (!cart.length) {
    return next(new ApiError(400, "Cart is empty or not found"));
  }

  const userCart = cart[0];

  // Fetch user address
  const userAddress = await Address.findById(addressId);
  if (!userAddress) {
    return next(new ApiError(404, "Address not found"));
  }

  // Validate stock for each item
  const outOfStockItems = userCart.items.filter((item) => item.stock < item.quantity);

  if (outOfStockItems.length) {
    const errorMessage = `Insufficient stock for: ${outOfStockItems.map((item) => item.name).join(", ")}`;
    return next(new ApiError(400, errorMessage));
  }

  // Deduct stock from all products **in parallel**
  await Promise.all(
    userCart.items.map((item) =>
      Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
    )
  );

  // Create the order
  const newOrder = await Order.create({
    userId: req.user._id,
    products: userCart.items,
    totalAmount: userCart.totalAmount,
    discountAmount: userCart.discountAmount,
    shippingCharge: userCart.shippingCharge,
    shippingDiscount: userCart.shippingDiscount,
    payableAmount: userCart.payableAmount,
    address: {
      fullName: userAddress.fullName,
      phoneNumber: userAddress.phoneNumber,
      alternatePhoneNumber: userAddress.alternatePhoneNumber,
      streetAddress: userAddress.streetAddress,
      city: userAddress.city,
      postalCode: userAddress.postalCode,
      country: userAddress.country,
      addressType: userAddress.addressType,
    },
    paymentMethod,
    paymentStatus: "Pending",
    orderStatus: "Pending",
    isPaid: false,
  });

  // Clear the cart after placing the order
  await Cart.findByIdAndDelete(cartId);

  res.status(201).json(new ApiResponse(201, newOrder, "Order created successfully"));
});

const getUserOrders = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Parse pagination parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Fetch orders with relevant fields
  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .select("orderStatus totalAmount createdAt products")
    .skip(skip)
    .limit(limit)
    .lean();

  if (!orders.length) {
    return next(new ApiError(404, "No orders found"));
  }

  // Count total orders for pagination
  const totalOrders = await Order.countDocuments({ userId });
  const totalPages = Math.ceil(totalOrders / limit);

  // Format the response with only relevant product details
  const formattedOrders = orders.map((order) => ({
    _id: order._id,
    orderStatus: order.orderStatus,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    products: order.products.map((product) => ({
      _id: product._id,
      name: product.name,
      image: product.images?.[0] || null, // Send only the first image
      quantity: product.quantity,
    })),
  }));

  res.status(200).json(
    new ApiResponse(200, {
      orders: formattedOrders,
      totalOrders,
      totalPages,
      currentPage: page,
    }, "Orders retrieved successfully")
  );
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) return next(new ApiError(404, "Order not found"));

  if (order.orderStatus !== "Pending") {
    return next(new ApiError(400, "Order cannot be canceled at this stage"));
  }

  // Restock the products
  await Promise.all(
    order.products.map(item =>
      Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } })
    )
  );


  order.orderStatus = "Cancelled";
  await order.save();

  res.status(200).json(new ApiResponse(200, null, "Order cancelled successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const {
    status,
    paymentStatus,
    paymentMethod,
    startDate,
    endDate,
    search, // Can be orderId, userId, or user fullName
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = -1,
  } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  // Build filter conditions dynamically
  const matchCondition = {};

  if (status) matchCondition.orderStatus = status;
  if (paymentStatus) matchCondition.paymentStatus = paymentStatus;
  if (paymentMethod) matchCondition.paymentMethod = paymentMethod;

  if (startDate && endDate) {
    matchCondition.createdAt = {
      $gte: moment(startDate).startOf("day").toDate(),
      $lte: moment(endDate).endOf("day").toDate(),
    };
  }

  // If search query is provided, filter by orderId, userId, or user fullName
  if (search) {
    matchCondition.$or = [
      { _id: search }, // Order ID
      { userId: search }, // User ID
      { "user.fullName": { $regex: search, $options: "i" } }, // User Full Name (case-insensitive)
    ];
  }

  // Aggregation query with pagination
  const orders = await Order.aggregate([
    { $match: matchCondition },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "addresses",
        localField: "userId",
        foreignField: "userId",
        as: "address",
      },
    },
    { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        userId: 1,
        products: 1,
        totalAmount: 1,
        discountAmount: 1,
        shippingCharge: 1,
        payableAmount: 1,
        paymentMethod: 1,
        paymentStatus: 1,
        orderStatus: 1,
        createdAt: 1,
        "user.fullName": 1,
        "user.phoneNumber": 1,
        "address.fullName": 1,
        "address.phoneNumber": 1,
        "address.streetAddress": 1,
        "address.city": 1,
        "address.state": 1,
        "address.postalCode": 1,
        "address.country": 1,
        "address.addressType": 1,
      },
    },
    { $sort: { [sortBy]: sortOrder } },
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum },
  ]).lean();

  // Count total orders matching the filters
  const totalOrders = await Order.countDocuments(matchCondition);

  // Pagination metadata
  const totalPages = Math.ceil(totalOrders / limitNum);
  const pagination = {
    currentPage: pageNum,
    totalPages,
    totalOrders,
    nextPage: pageNum < totalPages ? pageNum + 1 : null,
    prevPage: pageNum > 1 ? pageNum - 1 : null,
  };

  // Send the response
  res.status(200).json(new ApiResponse(200, { orders, pagination }, "Fetched all orders"));
});


const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id; // Get authenticated user ID

  // Fetch order details only if it belongs to the authenticated user
  const orderDetails = await Order.aggregate([
    { 
      $match: { 
        _id: new mongoose.Types.ObjectId(orderId), 
        userId: new mongoose.Types.ObjectId(userId) // Ensure the order belongs to the user
      } 
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "addressDetails",
      },
    },
    { $unwind: { path: "$addressDetails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        userId: 1,
        products: 1,
        totalAmount: 1,
        discountAmount: 1,
        shippingCharge: 1,
        payableAmount: 1,
        orderStatus: 1,
        paymentStatus: 1,
        paymentMethod: 1,
        createdAt: 1,
        updatedAt: 1,
        userDetails: {
          fullName: 1,
          email: 1,
          phone: 1,
          avatar: 1,
        },
        addressDetails: {
          fullName: 1,
          streetAddress: 1,
          city: 1,
          state: 1,
          postalCode: 1,
          country: 1,
          addressType: 1,
          phoneNumber: 1,
          alternatePhoneNumber: 1,
        },
      },
    },
  ]);

  // If order doesn't exist or doesn't belong to the user, return an error
  if (!orderDetails.length) {
    return res.status(403).json(new ApiResponse(403, null, "Unauthorized: You do not have access to this order"));
  }

  res.status(200).json(new ApiResponse(200, orderDetails[0], "Order details fetched successfully"));
});





export {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
} 
