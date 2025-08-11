const { validationResult } = require('express-validator');
const fs = require('fs');

exports.validateResult = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting invalid file:", err)
            });
        }
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
};