import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    image: { 
      url: String,
      public_id: String
    },
    isDeleted: { type: Boolean, default: false } 
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
