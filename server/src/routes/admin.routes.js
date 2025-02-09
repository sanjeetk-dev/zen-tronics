import { Router } from "express";
const router = Router();

import {
  login,
  logout,
  updateOrderStatusById,
  getUserById,
  updateUserStatusById,
  getAllUsersWithOrders,
  getAdminDashboardStats,
  deleteReviews,
} from "../controllers/admin.controller.js"; 

import { protectAdmin } from "../middlewares/auth.middleware.js";

// 🔹 Admin Authentication Routes
router.post("/login", login);

// 🔒 Protect all routes after this middleware
router.use(protectAdmin);
router.post("/logout", logout);

// 🔹 Order Routes
router.route("/orders").get(getAllUsersWithOrders);
router.route("/order/:orderId").patch(updateOrderStatusById);

// 🔹 User Routes
router.route("/users").get(getAllUsersWithOrders);
router.route("/user/:userId")
  .get(getUserById)
  .patch(updateUserStatusById);

// 🔹 Review Management
router.route("/reviews/delete").delete(deleteReviews);

// 🔹 Dashboard Stats
router.route("/dashboard/stats").get(getAdminDashboardStats);

export default router;
