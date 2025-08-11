const { body, param } = require('express-validator');

exports.bookAppointmentValidator = [
    body("service")
        .notEmpty()
        .withMessage("Service is required.")
        .isMongoId()
        .withMessage("Service ID is not valid."),

    body("date")
        .notEmpty()
        .withMessage("Date is required.")
        .isISO8601()
        .withMessage("Date format must be valid (YYYY-MM-DD)"),

    body("timeSlot")
        .optional()
        .isString()
        .withMessage("Time must be sent as a string."),

    body("notes")
        .optional()
        .isString()
        .withMessage("Description must be a string")
];

exports.cancelAppointmentValidator = [
    param("id")
        .isMongoId()
        .withMessage("ID is not valid."),
];

exports.changeStatusValidator = [
    param("id")
        .isMongoId()
        .withMessage("ID is not valid."),

    body("status")
        .notEmpty()
        .withMessage("Status is required.")
        .isIn(["pending", "confirmed", "cancelled"])
        .withMessage("Status must be: (pending, confirmed, cancelled)")
];