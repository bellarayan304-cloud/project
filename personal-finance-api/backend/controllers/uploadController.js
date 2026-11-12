import { Readable } from "node:stream";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

const uploadBuffer = (buffer) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: "personal-finance/profile-pictures", resource_type: "image" },
    (error, result) => error ? reject(error) : resolve(result)
  );
  Readable.from(buffer).pipe(stream);
});

export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please attach an image using the field name 'image'." });
  if (!isCloudinaryConfigured) {
    return res.status(503).json({ message: "Cloudinary is not configured. Add Cloudinary credentials to .env." });
  }

  const result = await uploadBuffer(req.file.buffer);
  req.user.profilePicture = result.secure_url;
  req.user.profilePicturePublicId = result.public_id;
  await req.user.save();

  res.json({
    message: "Profile picture uploaded.",
    profilePicture: req.user.profilePicture
  });
});
