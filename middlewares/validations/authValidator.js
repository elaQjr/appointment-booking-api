const { body } = require('express-validator');

exports.registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required."),

    body("email")
        .notEmpty()
        .withMessage("Email is not valid."),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
];

exports.resendVerificationValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid."),
];

exports.loginValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is not valid."),

    body("password")
        .notEmpty()
        .withMessage("Password is required."),
];

exports.forgotPasswordValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Email is not valid.")
];

exports.resetPasswordValidator = [
    body("newPassword")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long.")
];