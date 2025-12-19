// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
