import mongoose, { Document, Schema } from "mongoose";
import { IUserDocument } from "./User";
import { IServiceDocument } from "./Service";

export interface IAppointment {
  user: mongoose.Types.ObjectId | IUserDocument;
  service: mongoose.Types.ObjectId | IServiceDocument;
  date: Date;
  timeSlot: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAppointmentDocument extends IAppointment, Document {}

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: String,
  },
  { timestamps: true }
);

const Appointment = mongoose.model<IAppointmentDocument>(
  "Appointment",
  appointmentSchema
);

export default Appointment;
