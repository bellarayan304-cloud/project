import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateCategory = async (categoryId, type, userId) => {
  if (!mongoose.isValidObjectId(categoryId)) return false;
  return Boolean(await Category.findOne({
    _id: categoryId,
    type,
    $or: [{ isDefault: true, user: null }, { user: userId }]
  }));
};

export const createTransaction = asyncHandler(async (req, res) => {
  const { type, amount, category, description = "", date } = req.body;
  if (!["income", "expense"].includes(type) || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ message: "Type must be income/expense and amount must be greater than 0." });
  }
  if (!(await validateCategory(category, type, req.user._id))) {
    return res.status(400).json({ message: "Category is invalid or does not match transaction type." });
  }
  const transaction = await Transaction.create({
    user: req.user._id, type, amount: Number(amount), category, description,
    ...(date ? { date: new Date(date) } : {})
  });
  await transaction.populate("category", "name type");
  res.status(201).json({ message: "Transaction created.", transaction });
});

export const getTransactions = asyncHandler(async (req, res) => {
  const { type, from, to, page = 1, limit = 20 } = req.query;
  const filter = { user: req.user._id };
  if (type && ["income", "expense"].includes(type)) filter.type = type;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const [transactions, total] = await Promise.all([
    Transaction.find(filter).populate("category", "name type")
      .sort({ date: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
    Transaction.countDocuments(filter)
  ]);
  res.json({ count: transactions.length, total, page: safePage, pages: Math.ceil(total / safeLimit), transactions });
});

export const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id })
    .populate("category", "name type");
  if (!transaction) return res.status(404).json({ message: "Transaction not found." });
  res.json({ transaction });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!transaction) return res.status(404).json({ message: "Transaction not found." });

  const type = req.body.type ?? transaction.type;
  const category = req.body.category ?? transaction.category.toString();
  if (!["income", "expense"].includes(type) || !(await validateCategory(category, type, req.user._id))) {
    return res.status(400).json({ message: "Category is invalid or does not match transaction type." });
  }
  if (req.body.amount !== undefined && (!Number.isFinite(Number(req.body.amount)) || Number(req.body.amount) <= 0)) {
    return res.status(400).json({ message: "Amount must be greater than 0." });
  }

  transaction.type = type;
  transaction.category = category;
  if (req.body.amount !== undefined) transaction.amount = Number(req.body.amount);
  if (req.body.description !== undefined) transaction.description = req.body.description;
  if (req.body.date !== undefined) transaction.date = new Date(req.body.date);
  await transaction.save();
  await transaction.populate("category", "name type");
  res.json({ message: "Transaction updated.", transaction });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!transaction) return res.status(404).json({ message: "Transaction not found." });
  res.json({ message: "Transaction deleted." });
});

export const getMonthlySummary = asyncHandler(async (req, res) => {
  const year = Number(req.query.year);
  const month = Number(req.query.month);
  const now = new Date();
  const selectedYear = Number.isInteger(year) ? year : now.getFullYear();
  const selectedMonth = Number.isInteger(month) ? month : now.getMonth() + 1;
  if (selectedMonth < 1 || selectedMonth > 12 || selectedYear < 2000 || selectedYear > 2100) {
    return res.status(400).json({ message: "Provide a valid month (1-12) and year (2000-2100)." });
  }
  const start = new Date(selectedYear, selectedMonth - 1, 1);
  const end = new Date(selectedYear, selectedMonth, 1);

  const [totals, categories] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id), date: { $gte: start, $lt: end } } },
      { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]),
    Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id), type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      { $project: { _id: 0, category: "$category.name", total: 1, count: 1 } }
    ])
  ]);
  const income = totals.find((item) => item._id === "income")?.total || 0;
  const expenses = totals.find((item) => item._id === "expense")?.total || 0;
  res.json({
    period: { year: selectedYear, month: selectedMonth },
    income, expenses, balance: income - expenses,
    transactionCounts: {
      income: totals.find((item) => item._id === "income")?.count || 0,
      expense: totals.find((item) => item._id === "expense")?.count || 0
    },
    topSpendingCategories: categories
  });
});
