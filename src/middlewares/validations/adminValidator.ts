import { body, param, query } from "express-validator";
import { ValidationChain } from "express-validator";

// ===============================
//   Update Status Validator
// ===============================
export const updateStatusValidator: ValidationChain[] = [
  param("id")
    .isMongoId()
    .withMessage("ID is not valid."),

  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["pending", "confirmed", "cancelled"])
    .withMessage("Status must be: (pending, confirmed, cancelled)"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string."),

  body("date")
    .notEmpty()
    .withMessage("Date is required.")
    .isISO8601()
    .withMessage("Date format must be valid (YYYY-MM-DD)."),
];

// ===============================
//   Filter Appointments Validator
// ===============================
export const filterAppointmentsValidator: ValidationChain[] = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("Date format must be valid (YYYY-MM-DD)."),

  query("serviceId")
    .optional()
    .isMongoId()
    .withMessage("Service id must be valid."),

  query("status")
    .optional()
    .isIn(["pending", "confirmed", "cancelled"])
    .withMessage("Status must be: (pending, confirmed, cancelled)"),

  query("userId")
    .optional()
    .isMongoId()
    .withMessage("User id must be valid."),
];
