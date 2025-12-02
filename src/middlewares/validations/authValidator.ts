import { body, ValidationChain } from "express-validator";


// ===============================
//   Register Validator
// ===============================
export const registerValidator: ValidationChain[] = [
  body("name")
    .notEmpty()
    .withMessage("Name is required."),

  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

// ===============================
//   Resend Verification Validator
// ===============================
export const resendVerificationValidator: ValidationChain[] = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid."),
];

// ===============================
//   Login Validator
// ===============================
export const loginValidator: ValidationChain[] = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid."),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

// ===============================
//   Forgot Password Validator
// ===============================
export const forgotPasswordValidator: ValidationChain[] = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid."),
];

// ===============================
//   Reset Password Validator
// ===============================
export const resetPasswordValidator: ValidationChain[] = [
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];
