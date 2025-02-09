import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    couponCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Automatically deactivate expired offers
offerSchema.pre("save", function (next) {
  this.isActive = new Date() < this.endDate;
  next();
});

export const Offer = mongoose.model("Offer", offerSchema);
