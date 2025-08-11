const express = require('express');
const router = express.Router();

// Controllers
const {
    getAllUsers,
    getAllAppointments,
    updateAppointmentStatus,
    getDashboardStats,
    filterAppointments
} = require ('../controllers/adminController');

// Middleware
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const {
    updateStatusValidator,
    filterAppointmentsValidator
} = require('../middlewares/validations/adminValidator');
const {
    validateResult
} = require('../middlewares/validations/validateResult');

// GET Routers 
router.get('/users', authMiddleware, authorize('admin'), getAllUsers);
router.get('/appointments', authMiddleware, authorize('admin'), getAllAppointments);
router.get('/dashboard-status', authMiddleware, authorize('admin'), getDashboardStats);
router.get('/appointments/filter', authMiddleware, authorize('admin'), filterAppointmentsValidator, validateResult, filterAppointments);


// PUT Routers
router.put('/appointments/:id', authMiddleware, authorize('admin'), updateStatusValidator, validateResult, updateAppointmentStatus);



module.exports = router;