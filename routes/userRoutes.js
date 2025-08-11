const express = require('express');
const router = express.Router();

// Controllers
const {
  getProfile,
  uploadAvatar,
} = require('../controllers/userController');

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Routes

// گرفتن پروفایل کاربر لاگین‌شده
router.get('/me', authMiddleware, getProfile);

// آپلود آواتار برای کاربر لاگین‌شده
router.patch('/avatar', authMiddleware, uploadMiddleware('avatar'), uploadAvatar);

module.exports = router;
