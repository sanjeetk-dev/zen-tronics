import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // Price per item
        total: { type: Number, required: true }, // quantity * price
        discount: { type: Number, default: 0 }, // Discount per item
      },
    ],
    totalAmount: { type: Number, default: 0 }, // Total before discount
    discountAmount: { type: Number, default: 0 },
    appliedCoupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", default: null },
    shippingCharge: { type: Number, default: 0 }, // Shipping fee
    shippingDiscount: { type: Number, default: 0 }, 
    taxAmount: { type: Number, default: 0 }, // GST/VAT
    finalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Cart = mongoose.model("Cart", cartSchema);
