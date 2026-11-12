import { Router } from "express";
import {
  createTransaction, getTransactions, getTransaction, updateTransaction,
  deleteTransaction, getMonthlySummary
} from "../controllers/transactionController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Income, expenses and monthly reports
 */
/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: List your transactions
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [income, expense] }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *     responses:
 *       200: { description: Paginated transactions }
 *   post:
 *     tags: [Transactions]
 *     summary: Create an income or expense
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount, category]
 *             properties:
 *               type: { type: string, enum: [income, expense] }
 *               amount: { type: number, example: 25.5 }
 *               category: { type: string, description: Category ObjectId }
 *               description: { type: string }
 *               date: { type: string, format: date-time }
 *     responses:
 *       201: { description: Transaction created }
 *       400: { description: Invalid transaction }
 */
/**
 * @swagger
 * /api/transactions/summary/monthly:
 *   get:
 *     tags: [Transactions]
 *     summary: Get monthly income, expenses, balance and top spending categories
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer, example: 2026 }
 *       - in: query
 *         name: month
 *         schema: { type: integer, minimum: 1, maximum: 12, example: 11 }
 *     responses:
 *       200: { description: Monthly summary }
 */
/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get one of your transactions
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Transaction details }
 *       404: { description: Not found }
 *   patch:
 *     tags: [Transactions]
 *     summary: Update one of your transactions
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string, enum: [income, expense] }
 *               amount: { type: number }
 *               category: { type: string }
 *               description: { type: string }
 *               date: { type: string, format: date-time }
 *     responses:
 *       200: { description: Transaction updated }
 *   delete:
 *     tags: [Transactions]
 *     summary: Delete one of your transactions
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Transaction deleted }
 */
router.get("/summary/monthly", protect, getMonthlySummary);
router.route("/").get(protect, getTransactions).post(protect, createTransaction);
router.route("/:id").get(protect, getTransaction).patch(protect, updateTransaction).delete(protect, deleteTransaction);

export default router;
