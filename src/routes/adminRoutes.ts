import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

// Controllers
import {
  getAllUsers,
  getAllAppointments,
  updateAppointmentStatus,
  getDashboardStats,
  filterAppointments,
} from "../controllers/adminController";

// Middleware
import authMiddleware from "../middlewares/authMiddleware";
import authorize from "../middlewares/authorize";
import {
  updateStatusValidator,
  filterAppointmentsValidator,
} from "../middlewares/validations/adminValidator";
import { validateResult } from "../middlewares/validations/validateResult";

// GET Routers
router.get(
  "/users",
  authMiddleware,
  authorize("admin"),
  getAllUsers);
router.get(
  "/appointments",
  authMiddleware,
  authorize("admin"),
  getAllAppointments
);
router.get(
  "/dashboard-status",
  authMiddleware,
  authorize("admin"),
  getDashboardStats
);
router.get(
  "/appointments/filter",
  authMiddleware,
  authorize("admin"),
  filterAppointmentsValidator,
  validateResult,
  filterAppointments
);

// PUT Routers
router.put(
  "/appointments/:id",
  authMiddleware,
  authorize("admin"),
  updateStatusValidator,
  validateResult,
  updateAppointmentStatus
);

export default router;
