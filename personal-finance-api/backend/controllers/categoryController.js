import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    $or: [{ isDefault: true, user: null }, { user: req.user._id }]
  }).sort({ type: 1, name: 1 });
  res.json({ count: categories.length, categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  if (!name?.trim() || !["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "Provide a category name and type: income or expense." });
  }
  const category = await Category.create({
    name: name.trim(),
    type,
    isDefault: false,
    user: req.user._id
  });
  res.status(201).json({ message: "Category created.", category });
});
