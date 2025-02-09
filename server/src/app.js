// ----------- Import Statements -----------
// Core Modules
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// Third-Party Modules
import MongoStore from "connect-mongo";
import passport from "passport";

// Load Environment Variables
dotenv.config();
import { config } from "./config/dotenv.js";

// Passport Configuration
import "./config/passport.js";

// Route Imports
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import offerRoutes from './routes/offer.routes.js';
import cartRoutes from './routes/cart.routes.js'
// Error Handling Middleware
import errorHandler from "./middlewares/errorHandler.middleware.js";

// ----------- Initialize Express App -----------
const app = express();

// ----------- Middleware Setup -----------
app.use(morgan("dev")); // Logger
app.use(express.json({ limit: "16kb" })); // JSON Parsing
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // URL-Encoded Data
app.use(express.static("public")); // Serve Static Files
app.use(cookieParser()); // Cookie Parser

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// ----------- Session Configuration -----------
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.mongoURI,
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ----------- Define Routes -----------
app.get("/", (req, res) => {
  console.log("Request received");
  res.status(200).json({
    message: "WORKING FINE 😀",
    success: true,
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/offer", offerRoutes);

// ----------- Error Handling Middleware -----------
app.use(errorHandler);

// ----------- Export App -----------
export default app;
