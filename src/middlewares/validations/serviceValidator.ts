import { body, param, ValidationChain } from "express-validator";

// ===============================
//   Create Service Validator
// ===============================
export const createServiceValidator: ValidationChain[] = [
  body("name")
    .notEmpty()
    .withMessage("Service name is required."),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required.")
    .isInt({ min: 5 })
    .withMessage("Duration must be an integer of at least 5 minutes."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isNumeric()
    .withMessage("Price must be a number."),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
];

// ===============================
//   Get Service By ID Validator
// ===============================
export const getServiceByIdValidator: ValidationChain[] = [
  param("id")
    .isMongoId()
    .withMessage("ID is not valid."),
];

// ===============================
//   Update Service Validator
// ===============================
export const updateServiceValidator: ValidationChain[] = [
  param("id")
    .isMongoId()
    .withMessage("ID is not valid."),

  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string."),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number."),

  body("duration")
    .optional()
    .isInt({ min: 5 })
    .withMessage("Duration must be an integer of at least 5 minutes."),
];

// ===============================
//   Delete Service Validator
// ===============================
export const deleteServiceValidator: ValidationChain[] = [
  param("id")
    .isMongoId()
    .withMessage("ID is not valid."),
];
