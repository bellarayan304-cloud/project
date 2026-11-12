import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    date: { type: Date, required: true, default: Date.now }
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });
export default mongoose.model("Transaction", transactionSchema);
