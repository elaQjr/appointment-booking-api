import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

// Controllers
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController";

// Middelwares
import authMiddleware from "../middlewares/authMiddleware";
import authorize from "../middlewares/authorize";
import uploadMiddleware from "../middlewares/uploadMiddleware";
import {
  createServiceValidator,
  getServiceByIdValidator,
  updateServiceValidator,
  deleteServiceValidator,
} from "../middlewares/validations/serviceValidator";
import { validateResult } from "../middlewares/validations/validateResult";

// Routes
router
  .route("/")
  .get(getAllServices)
  .post(
    authMiddleware,
    authorize("admin"),
    uploadMiddleware("image"),
    createServiceValidator,
    validateResult,
    createService
  );

router
  .route("/:id")
  .get(getServiceByIdValidator,
    validateResult,
    getServiceById
  )
  .put(
    authMiddleware,
    authorize("admin"),
    uploadMiddleware("image"),
    updateServiceValidator,
    validateResult,
    updateService
  )
  .delete(
    authMiddleware,
    authorize("admin"),
    deleteServiceValidator,
    validateResult,
    deleteService
  );

export default router;
