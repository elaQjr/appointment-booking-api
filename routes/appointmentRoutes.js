const express = require('express');
const router = express.Router();

// Controllers
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  cancelAppointment,
  changeAppointmentStatus,
} = require('../controllers/appointmentController');

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const {
  bookAppointmentValidator,
  cancelAppointmentValidator,
  changeStatusValidator,
} = require('../middlewares/validations/appointmentValidator');
const { validateResult } = require('../middlewares/validations/validateResult');

// -------------------- User Routes --------------------

// Book a new appointment
router.post(
  '/',
  authMiddleware,
  bookAppointmentValidator,
  validateResult,
  bookAppointment
);

// Get my own appointments
router.get(
  '/me',
  authMiddleware,
  getMyAppointments
);

// Cancel my appointment
router.delete(
  '/:id',
  authMiddleware,
  cancelAppointmentValidator,
  validateResult,
  cancelAppointment
);

// -------------------- Admin Routes --------------------

// Get all appointments (admin only)
router.get(
  '/',
  authMiddleware,
  authorize('admin'),
  getAllAppointments
);

// Change status of an appointment (admin only)
router.patch(
  '/:id/status',
  authMiddleware,
  authorize('admin'),
  changeStatusValidator,
  validateResult,
  changeAppointmentStatus
);

module.exports = router;
