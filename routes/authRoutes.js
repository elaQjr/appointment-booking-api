const express = require('express');
const router = express.Router();

// Controllers
const {
    register,
    verifyEmail,
    resendVerificationEmail,
    login,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    logout
} = require('../controllers/authController');

// Middlewares
const {
    registerValidator,
    resendVerificationValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} = require('../middlewares/validations/authValidator');
const {
    validateResult
} = require('../middlewares/validations/validateResult');


//  GET ROUTES
router.get('/refresh', refreshAccessToken);
router.get('/verify-email/:token', verifyEmail);

// POST ROUTES
router.post('/register', registerValidator, validateResult, register);
router.post('/resend-verification', resendVerificationValidator, validateResult, resendVerificationEmail);
router.post('/login', loginValidator, validateResult, login);
router.post('/forgot-password', forgotPasswordValidator, validateResult, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validateResult, resetPassword);
router.post('/logout', logout);

module.exports = router;
