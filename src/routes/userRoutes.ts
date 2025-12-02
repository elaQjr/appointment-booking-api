import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

// Controllers
import { getProfile, uploadAvatar } from "../controllers/userController";

// Middlewares
import authMiddleware from "../middlewares/authMiddleware";
import uploadMiddleware from "../middlewares/uploadMiddleware";

// Routes

// گرفتن پروفایل کاربر لاگین‌شده
router.get(
  "/me",
  authMiddleware,
  getProfile
);

// آپلود آواتار برای کاربر لاگین‌شده
router.patch(
  "/avatar",
  authMiddleware,
  uploadMiddleware("avatar"),
  uploadAvatar
);

export default router;
