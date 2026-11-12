import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";

export const getAdminOverview = asyncHandler(async (req, res) => {
  const [totalUsers, transactionTotals, topSpendingCategories] = await Promise.all([
    User.countDocuments(),
    Transaction.aggregate([
      { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]),
    Transaction.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: "$category", totalSpent: { $sum: "$amount" }, transactions: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      { $project: { _id: 0, category: "$category.name", totalSpent: 1, transactions: 1 } }
    ])
  ]);
  res.json({
    totalUsers,
    totalTransactions: transactionTotals.reduce((sum, item) => sum + item.count, 0),
    totalIncome: transactionTotals.find((item) => item._id === "income")?.total || 0,
    totalExpenses: transactionTotals.find((item) => item._id === "expense")?.total || 0,
    topSpendingCategories
  });
});
