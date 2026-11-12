import { Router } from "express";
import { uploadProfilePicture } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Profile image uploads
 */
/**
 * @swagger
 * /api/upload/profile-picture:
 *   post:
 *     tags: [Upload]
 *     summary: Upload or replace your profile picture
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image: { type: string, format: binary }
 *     responses:
 *       200: { description: Image uploaded }
 *       400: { description: Invalid or missing image }
 *       503: { description: Cloudinary not configured }
 */
router.post("/profile-picture", protect, upload.single("image"), uploadProfilePicture);

export default router;
