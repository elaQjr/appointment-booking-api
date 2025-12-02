import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

// Controllers
import {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController";

// Middlewares
import {
  registerValidator,
  resendVerificationValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../middlewares/validations/authValidator";
import { validateResult } from "../middlewares/validations/validateResult";

//  GET ROUTES
router.get(
  "/refresh",
  refreshAccessToken
);
router.get(
  "/verify-email/:token",
  verifyEmail
);

// POST ROUTES
router.post(
  "/register",
  registerValidator,
  validateResult,
  register
);
router.post(
  "/resend-verification",
  resendVerificationValidator,
  validateResult,
  resendVerificationEmail
);
router.post(
  "/login",
  loginValidator,
  validateResult,
  login);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateResult,
  forgotPassword
);
router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  validateResult,
  resetPassword
);
router.post("/logout",
  logout
);

export default router;
