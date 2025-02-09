import moment from "moment";
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
import { User } from '../models/user.model.js';
import { Coupon } from '../models/coupon.model.js'
import { Order } from '../models/order.model.js'
import { config } from '../config/dotenv.js';
import { getCache, setCache, deleteCache, flushCache } from '../utils/cache.js';
import { sendOrderEmail } from '../utils/nodemailer.js'
import { emailTemplates } from '../utils/email.template.js'

const login = asyncHandler(async (req, res) => {
  const { pass } = req.body;

  if (!pass || pass !== config.admin_password) {
    throw new ApiError(400, "Invalid Credentials");
  }
  req.session.admin = true;
  res.json({ message: "Admin logged in successfully" });
});

const logout = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    res.json(new ApiResponse(200, {}, "Logout successfully"));
  });
});

const updateOrderStatusById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  // Fetch order with user details in a single query using populate
  const order = await Order.findById(orderId).populate("userId", "fullName email");
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Update the order status
  order.orderStatus = status;
  await order.save();

  // Prepare order details
  const orderDetail = {
    fullName: order.userId.fullName,
    orderId: order._id,
    items: order.products,
    totalAmount: order.totalAmount,
    status,
  };

  // **Select the appropriate email template**
  let emailSubject = `Your Order #${order._id} has been ${status}`;
  let emailContent = "";

  switch (status) {
    case "Delivered":
      emailContent = emailTemplates.orderDelivered(orderDetail);
      emailSubject = `Your Order #${order._id} has been Delivered! 🎉`;
      break;
    case "Cancelled":
      emailDetail = { ...orderDetail, refundStatus: true };
      emailContent = emailTemplates.orderCancelled(emailDetail);
      emailSubject = `Your Order #${order._id} has been Cancelled ❌`;
      break;
    default:
      emailContent = emailTemplates.orderUpdate(orderDetail);
  }

  // Send email
  const response = await sendOrderEmail(order.userId.email, emailSubject, "", emailContent);

  if (!response) {
    return res.status(200).json(new ApiResponse(200, order, "Order status updated successfully, but email not sent"));
  }

  res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
});


const getAllUsersWithOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  const matchStage = {};
  if (search) {
    matchStage.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const users = await User.aggregate([
    { $match: matchStage }, // Apply search filter if provided
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orderHistory",
      },
    },
    {
      $addFields: {
        totalOrders: { $size: "$orderHistory" },
        totalSpent: { $sum: "$orderHistory.totalAmount" },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $project: {
        fullName: 1,
        email: 1,
        status: 1,
        totalOrders: 1,
        totalSpent: 1,
        createdAt: 1,
        orderHistory: {
          orderId: "$orderHistory._id",
          totalAmount: "$orderHistory.totalAmount",
          status: "$orderHistory.orderStatus",
          createdAt: "$orderHistory.createdAt",
        },
      },
    },
  ]);

  const totalUsers = await User.countDocuments(matchStage); // Total users count for pagination

  res.status(200).json(
    new ApiResponse(200, { users, totalUsers, page, limit }, "Users fetched successfully")
  );
});


const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match by user ID
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orderHistory",
      },
    },
    {
      $addFields: {
        totalOrders: { $size: "$orderHistory" },
        totalSpent: { $sum: "$orderHistory.totalAmount" },
      },
    },
    {
      $project: {
        fullName: 1,
        email: 1,
        status: 1,
        totalOrders: 1,
        totalSpent: 1,
        createdAt: 1,
        orderHistory: {
          orderId: "$orderHistory._id",
          totalAmount: "$orderHistory.totalAmount",
          status: "$orderHistory.orderStatus",
          createdAt: "$orderHistory.createdAt",
        },
      },
    },
  ]);

  if (!user.length) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, user[0], "User details fetched successfully"));
});

const updateUserStatusById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!["active", "inactive", "suspended"].includes(status)) {
    throw new ApiError(400, "Invalid status. Allowed: active, inactive, suspended");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  );

  if (!updatedUser) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, updatedUser, "User status updated successfully"));
});

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const sevenWeeksAgo = new Date();
  sevenWeeksAgo.setDate(sevenWeeksAgo.getDate() - 7 * 7); // Last 7 weeks

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Last 7 days

  // 📌 Total Users, Orders, and Revenue
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
  ]);

  // 📌 Total Refunds (Cancelled & Paid Orders)
  const totalRefunds = await Order.aggregate([
    { $match: { orderStatus: "Cancelled", isPaid: true } },
    { $group: { _id: null, refunds: { $sum: "$totalAmount" } } },
  ]);

  // 📌 Order Statistics (Pending, Shipped, Delivered, etc.)
  const orderStats = await Order.aggregate([
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
  ]);

  // 📌 Weekly Sales for Last 7 Weeks
  const weeklySales = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenWeeksAgo } } },
    {
      $group: {
        _id: { $isoWeek: "$createdAt" }, // Get week number
        totalSales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
        startDate: { $min: "$createdAt" }, // Earliest date in the week
        endDate: { $max: "$createdAt" }    // Latest date in the week
      }
    },
    { $sort: { "_id": 1 } }, // Sort by week number
    {
      $project: {
        _id: 1,
        totalSales: 1,
        orderCount: 1,
        dateRange: { start: "$startDate", end: "$endDate" }
      }
    }
  ]);

  // 📌 Daily Sales for Last 7 Days
  const dailySales = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  // 📌 Top 5 Best-Selling Products
  const topProducts = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        sold: { $sum: "$products.quantity" },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 5 },
  ]);

  // 📌 Category-Wise Sales
  const categorySales = await Order.aggregate([
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $group: {
        _id: "$productInfo.categoryId",
        totalSales: { $sum: "$products.price" },
      },
    },
    { $sort: { totalSales: -1 } },
  ]);


  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: sevenWeeksAgo } } },
    {
      $group: {
        _id: { $isoWeek: "$createdAt" }, // Group by week number
        newUsers: { $sum: 1 },
        startDate: { $min: "$createdAt" },
        endDate: { $max: "$createdAt" }
      }
    },
    { $sort: { "_id": 1 } },
    {
      $project: {
        _id: 1,
        newUsers: 1,
        dateRange: { start: "$startDate", end: "$endDate" }
      }
    }
  ]);

  // 📌 Profit Calculation
  const profitData = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$products.price" },
        totalCost: { $sum: "$products.cost" },
      },
    },
    {
      $project: {
        revenue: 1,
        totalCost: 1,
        profit: { $subtract: ["$revenue", "$totalCost"] },
        profitMargin: { $multiply: [{ $divide: [{ $subtract: ["$revenue", "$totalCost"] }, "$revenue"] }, 100] },
      },
    },
  ]);

  // 📌 Order Growth Rate (Compare Last 7 Days with Previous 7 Days)
  const previousWeekSales = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenWeeksAgo, $lt: sevenDaysAgo }, isPaid: true } },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);

  const recentWeekSales = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, isPaid: true } },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);

  const previousSales = previousWeekSales[0]?.totalSales || 0;
  const recentSales = recentWeekSales[0]?.totalSales || 0;
  const orderGrowthRate = previousSales
    ? ((recentSales - previousSales) / previousSales) * 100
    : 0;

  res.status(200).json(
    new ApiResponse(200, {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      totalRefunds: totalRefunds[0]?.refunds || 0,
      orderStats,
      weeklySales,
      dailySales,
      topProducts,
      categorySales,
      profit: profitData[0]?.profit || 0,
      profitMargin: profitData[0]?.profitMargin || 0,
      orderGrowthRate,
      userGrowth
    }, "Admin dashboard stats fetched successfully")
  );
});

const deleteReviews = asyncHandler(async (req, res) => {
  const { reviewIds } = req.body;

  if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
    throw new ApiError(400, "Invalid or empty review IDs array.");
  }

  // Delete multiple reviews
  const result = await Review.deleteMany({ _id: { $in: reviewIds } });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No reviews found with the provided IDs.");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      { deletedCount: result.deletedCount },
      `${result.deletedCount} review(s) deleted successfully.`
    )
  );
});



export {
  login,
  logout,
  updateOrderStatusById,
  getUserById,
  updateUserStatusById,
  getAllUsersWithOrders,
  getAdminDashboardStats,
  deleteReviews,
}
