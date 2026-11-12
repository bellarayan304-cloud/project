import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    isDefault: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

categorySchema.index({ name:  1, type: 1, user: 1 }, { unique: true });
export default mongoose.model("Category", categorySchema);
