import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cost: {type: Number, required: true},
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    discountedPrice: { type: Number },
    defected: { type: Number, default: 0 },
    totalQuantity: {type: Number, required: true},
    stock: { type: Number, required: true },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ratings: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    isDeleted: { type: Boolean, default: false } ,
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook to auto-calculate discounted price
productSchema.pre("save", function (next) {
  this.discountedPrice = (this.price - (this.price * this.discountPercentage) / 100).toFixed(2);
  next();
});

export const Product = mongoose.model("Product", productSchema);
