import { Request, Response, NextFunction } from "express";
import Appointment from "../models/Appointment";
import Service, { IServiceDocument } from "../models/Service";
import User, { IUserDocument } from "../models/User";
import sendEmail from "../utils/sendEmail";
import generateAppointmentEmail from "../utils/emailTemplates/generateAppointmentEmail";
import generateAppointmentStatusEmail from "../utils/emailTemplates/generateAppointmentStatusEmail";
import { Types } from "mongoose";

// Body Request types
interface BookAppointmentBody {
  service: string;
  date: Date;
  timeSlot: string;
  notes?: string;
}

interface ChangeStatusBody {
  status: "pending" | "confirmed" | "cancelled";
}

// ------------------------ Book Appointment ------------------------
export const bookAppointment = async (
  req: Request<{}, {}, BookAppointmentBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { service, date, timeSlot, notes } = req.body;

    if (!service || !date || !timeSlot) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Service, date, and timeSlot are required",
        });
    }

    const existing = await Appointment.findOne({ service, date, timeSlot });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "This time slot is already booked." });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      service,
      date,
      timeSlot,
      notes,
    });

    await appointment.populate("service");

    const user = await User.findById(req.user._id);
    const serviceObj = await Service.findById(service);

    if (!user || !serviceObj) {
      return res.status(404).json({
        success: false,
        message: "User or Service not found",
      });
    }

    const html = generateAppointmentEmail(appointment, user, serviceObj);

    await sendEmail({
      to: user.email,
      subject: `Booking Confirmation for ${user.name}`,
      html,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      data: appointment,
    });
  } catch (err: unknown) {
    next(err);
  }
};

// ------------------------ Get My Appointments ------------------------
export const getMyAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("service")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "User's appointments retrieved successfully",
    });
  } catch (err: unknown) {
    next(err);
  }
};

// ------------------------ Get All Appointments (Admin) ------------------------
export const getAllAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email")
      .populate("service");

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "All appointments retrieved successfully",
    });
  } catch (err: unknown) {
    next(err);
  }
};

// ------------------------ Cancel Appointment (User or Admin) ------------------------
export const cancelAppointment = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    const isOwner = appointment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to cancel this appointment.",
        });
    }

    await appointment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
    });
  } catch (err: unknown) {
    next(err);
  }
};

// ------------------------ Change Appointment Status (Admin) ------------------------
export const changeAppointmentStatus = async (
  req: Request<{ id: string }, {}, ChangeStatusBody>, 
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required" });
    }

    if (!status || typeof status !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value." });
    }

    const appointment = await Appointment.findById(id).populate<{ user: IUserDocument; service: IServiceDocument }>("user service");
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    appointment.status = status;
    await appointment.save();

    const html = generateAppointmentStatusEmail(appointment, status);

    await sendEmail({
      to: appointment.user.email,
      subject: `Appointment Status: ${status}`,
      html,
    });

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to '${status}'.`,
      data: appointment,
    });
  } catch (err: unknown) {
    next(err);
  }
};
