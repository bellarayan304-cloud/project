import { Router } from "express";
import { getCategories, createCategory } from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Predefined and personal categories
 */
/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: List predefined and your custom categories
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Category list }
 *   post:
 *     tags: [Categories]
 *     summary: Create a personal category
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name: { type: string, example: Rent }
 *               type: { type: string, enum: [income, expense] }
 *     responses:
 *       201: { description: Category created }
 */
router.route("/").get(protect, getCategories).post(protect, createCategory);

export default router;
