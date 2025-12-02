import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import Service from "../models/Service";
import Appointment, { IAppointment } from "../models/Appointment";
import { Types } from "mongoose";

// Body Request types
interface updateAppointmentStatusBody {
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  date: Date;
}

interface FilterAppointmentsQuery {
  date?: string;
  serviceId?: string;
  status?: "pending" | "confirmed" | "cancelled";
  userId?: string;
}

// ---------- GET ALL USERS -----------
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: IUser[] = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      data: users,
      message: "Users retrieved successfully",
    });
  } catch (err: unknown) {
    next(err);
  }
};

// ----------- GET ALL APPOINTMENTS ----------
export const getAllAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments: IAppointment[] = await Appointment.find().populate(
      "user",
      "name email"
    );

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "Appointments retrieved successfully",
    });
  } catch (err: unknown) {
    next(err);
  }
};

// --------- UPDATE APPOINTMENT STATUS ---------
export const updateAppointmentStatus = async (
  req: Request<{ id: string }, {}, updateAppointmentStatusBody>,
  res: Response,
  next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes, date } = req.body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (date) {
      const newDate = new Date(date);
      if (isNaN(newDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date format" });
      }
      appointment.date = newDate;
    }

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (err: unknown) {
    next(err);
  }
};

// --------- GET DASHBOARD STATUS ----------
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next:NextFunction
) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({
      status: "pending",
    });
    const confirmedAppointments = await Appointment.countDocuments({
      status: "confirmed",
    });
    const cancelledAppointments = await Appointment.countDocuments({
      status: "cancelled",
    });

    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();

    const latestAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("service", "name price")


    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalAppointments,
          pendingAppointments,
          confirmedAppointments,
          cancelledAppointments,
          totalUsers,
          totalServices,
        },
        latestAppointments,
      },
      message: "Dashboard stats retrieved successfully",
    });
  } catch (err: unknown) {
    next(err);
  }
};

//  ---------- FILTER APPOINTMENTS ----------
export const filterAppointments = async (
  req: Request<{}, {}, {}, FilterAppointmentsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, serviceId, status, userId } = req.query;

    const query: Record<string, any> = {};

    if (date && typeof date === 'string') {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date format" });
      }
      query.date = {
        $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
        $lte: new Date(parsedDate.setHours(23, 59, 59, 999)),
      };
    }

    if (serviceId && typeof serviceId === 'string') {
      query.service = serviceId.trim();
    }

    if (status && typeof status === 'string') {
      query.status = status.trim();
    }

    if (userId && typeof userId === 'string') {
      query.user = userId.trim();
    }

    const appointments = await Appointment.find(query)
      .populate("user service")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
      message: "Filtered appointments retrieved successfully",
    });
  } catch (err: unknown) {
    next(err);
  }
};
