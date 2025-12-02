import express, { Request, response, NextFunction } from "express";
const router = express.Router();

// Controllers
import {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  cancelAppointment,
  changeAppointmentStatus,
} from "../controllers/appointmentController";

// Middlewares
import authMiddleware from "../middlewares/authMiddleware";
import authorize from "../middlewares/authorize";
import {
  bookAppointmentValidator,
  cancelAppointmentValidator,
  changeStatusValidator,
} from "../middlewares/validations/appointmentValidator";
import { validateResult } from "../middlewares/validations/validateResult";

// -------------------- User Routes --------------------

// Book a new appointment
router.post(
  "/",
  authMiddleware,
  bookAppointmentValidator,
  validateResult,
  bookAppointment
);

// Get my own appointments
router.get(
  "/me",
  authMiddleware,
  getMyAppointments
);

// Cancel my appointment
router.delete(
  "/:id",
  authMiddleware,
  cancelAppointmentValidator,
  validateResult,
  cancelAppointment
);

// -------------------- Admin Routes --------------------

// Get all appointments (admin only)
router.get
(
  "/",
  authMiddleware,
  authorize("admin"),
  getAllAppointments
);

// Change status of an appointment (admin only)
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("admin"),
  changeStatusValidator,
  validateResult,
  changeAppointmentStatus
);

export default router;
