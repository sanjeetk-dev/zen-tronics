import mongoose from "mongoose";

const defectiveProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
},{
  timestamps: true
});

export const DefectiveProduct = mongoose.model("DefectiveProduct", defectiveProductSchema);
