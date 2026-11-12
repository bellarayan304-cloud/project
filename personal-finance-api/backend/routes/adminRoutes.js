import { Router } from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only analytics
 */
/**
 * @swagger
 * /api/admin/overview:
 *   get:
 *     tags: [Admin]
 *     summary: Get platform-wide totals and top spending categories
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Admin overview }
 *       401: { description: Unauthorized }
 *       403: { description: Admin role required }
 */
router.get("/overview", protect, adminOnly, getAdminOverview);

export default router;
