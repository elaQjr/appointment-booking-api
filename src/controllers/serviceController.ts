import { Request, Response, NextFunction } from "express";
import Service, { IService } from "../models/Service";
import { Types } from "mongoose";

// Body Request types
interface CreateServiceBody {
  name: string;
  duration?: number;
  price?: number;
  description?: string;
}

interface UpdateServiceBody {
  name?: string;
  duration?: number;
  price?: number;
  description?: string;
  image?: string;
}

//  GET: دریافت همه سرویس‌ها
export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services: IService[] = await Service.find();
    res.status(200).json({
      success: true,
      data: services,
      message: "Services retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

//  POST: ساخت سرویس جدید (فقط ادمین)
export const createService = async (
  req: Request<{}, {}, CreateServiceBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, duration, price, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Service name is required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newService: IService = await Service.create({
      name,
      duration,
      price,
      description,
      image,
    });
    res.status(201).json({
      success: true,
      data: newService,
      message: "Service created successfully",
    });
  } catch (err) {
    next(err);
  }
};

//  GET: دریافت سرویس خاص با ID
export const getServiceById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json( {success: false, message: "Invalid service ID"} );
    }

    const service = await Service.findById(id);

    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });

    res.status(200).json({
      success: true,
      data: service,
      message: "Service retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

//  PUT: ویرایش سرویس (فقط ادمین)
export const updateService = async (
  req: Request<{ id: string }, {}, UpdateServiceBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (req.body.name?.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Service name cannot be empty" });
    }

    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedService)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });

    res.status(200).json({
      success: true,
      data: updatedService,
      message: "Service updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

//  DELETE: حذف سرویس (فقط ادمین)
export const deleteService = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json( {success: false, message: "Invalid service ID"} );
    }

    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    res.status(200).json({
      success: true,
      data: deletedService,
      message: "Service deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
