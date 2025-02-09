import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount: { type: Number, required: true, min: 1, max: 100 }, // Percentage-based discount
    maxLimit: { type: Number, required: true }, // Max usage limit
    minOrderAmount: { type: Number, default: 0 }, // Minimum order value required
    startDate: { type: Date, required: true }, // When the coupon becomes active
    expiry: { type: Date, required: true }, // When the coupon expires
    usedCount: { type: Number, default: 0 }, // Track how many times used
    isActive: { type: Boolean, default: true }, // Easily enable/disable coupons
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }] // Optional: Restrict to categories
  },
  { timestamps: true }
);

// Auto-disable expired coupons
couponSchema.pre("save", function (next) {
  if (new Date() > this.expiry) {
    this.isActive = false;
  }
  next();
});

export const Coupon = mongoose.model("Coupon", couponSchema);
