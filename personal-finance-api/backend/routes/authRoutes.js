import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Account registration, login and profile
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Ayaan }
 *               email: { type: string, example: ayaan@example.com }
 *               password: { type: string, minLength: 8, example: securePass123 }
 *     responses:
 *       201: { description: Account created }
 *       400: { description: Invalid input }
 *       409: { description: Email already exists }
 */
router.post("/register", register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post("/login", login);
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get the current user's profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: User profile }
 *       401: { description: Unauthorized }
 *   patch:
 *     tags: [Auth]
 *     summary: Update the current user's name
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       200: { description: Profile updated }
 */
router.route("/profile").get(protect, getProfile).patch(protect, updateProfile);

export default router;
