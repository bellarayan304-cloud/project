import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import Category from "../models/Category.js";

const defaults = [
  ["Salary", "income"], ["Business", "income"], ["Freelance", "income"],
  ["Investment", "income"], ["Other income", "income"],
  ["Food", "expense"], ["Transport", "expense"], ["Housing", "expense"],
  ["Utilities", "expense"], ["Shopping", "expense"], ["Healthcare", "expense"],
  ["Education", "expense"], ["Entertainment", "expense"], ["Other expense", "expense"]
];

try {
  await connectDB();
  for (const [name, type] of defaults) {
    await Category.updateOne(
      { name, type, user: null },
      { $setOnInsert: { name, type, isDefault: true, user: null } },
      { upsert: true }
    );
  }
  console.log("Default categories seeded.");
  process.exit(0);
} catch (error) {
  console.error("Category seeding failed:", error.message);
  process.exit(1);
}
