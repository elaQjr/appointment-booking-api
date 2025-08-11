const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const generateAppointmentEmail = require('../utils/emailTemplates/generateAppointmentEmail');
const generateAppointmentStatusEmail = require('../utils/emailTemplates/generateAppointmentStatusEmail');

// ------------------------ Book Appointment ------------------------
exports.bookAppointment = async (req, res, next) => {
  try {
    const { service, date, timeSlot, notes } = req.body;

    if (!service || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Service, date, and timeSlot are required' });
    }

    const existing = await Appointment.findOne({ service, date, timeSlot });
    if (existing) {
      return res.status(409).json({  success: false, message: 'This time slot is already booked.' });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      service,
      date,
      timeSlot,
      notes,
    });

    await appointment.populate('service');

    const user = await User.findById(req.user._id);
    const serviceObj = await Service.findById(service);

    const html = generateAppointmentEmail(appointment, user, serviceObj);

    await sendEmail({
      to: user.email,
      subject: `Booking Confirmation for ${user.name}`,
      html,
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

// ------------------------ Get My Appointments ------------------------
exports.getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('service')
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "User's appointments retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

// ------------------------ Get All Appointments (Admin) ------------------------
exports.getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('service');

    return res.status(200).json({
      success: true,
      data: appointments,
      message: 'All appointments retrieved successfully',
    });
  } catch (err) {
    next(err);
  }
};

// ------------------------ Cancel Appointment (User or Admin) ------------------------
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Appointment ID is required' });

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({  success: false, message: 'Appointment not found.' });
    }

    const isOwner = appointment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({  success: false, message: 'You are not authorized to cancel this appointment.' });
    }

    await appointment.deleteOne();

    return res.status(200).json({ 
      success: true,
      message: 'Appointment cancelled successfully.',
     });
  } catch (err) {
    next(err);
  }
};

// ------------------------ Change Appointment Status (Admin) ------------------------
exports.changeAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

    status = status.trim().toLowerCase();

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const appointment = await Appointment.findById(id).populate('user service');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
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
  } catch (err) {
    next(err);
  }
};
