const User = require('../models/User');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

// ---------- GET ALL USERS -----------
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json({
            success: true,
            data: users,
            message: "Users retrieved successfully",
    });
    } catch (err) {
        next(err);
    }
};

// ----------- GET ALL APPOINTMENTS ----------
exports.getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find().populate('user', 'name email');

        return res.status(200).json({
            success: true,
            data: appointments,
            message: "Appointments retrieved successfully",
        });
    } catch (err) {
        next(err);
    }
};

// --------- UPDATE APPOINTMENT STATUS ---------
exports.updateAppointmentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes, date } = req.body;

        if (!id) return res.status(400).json({ success: false, message: 'Appointment ID is required' });

        const appointment = await Appointment.findById(id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        
        if (status) appointment.status = status;
        if (notes) appointment.notes = notes;
        if (date) {
            const newDate = new Date(date);
            if (isNaN(newDate)) {
                return res.status(400).json({ success: false, message: "Invalid date format" });
            }
            appointment.date = newDate;
        }

        await appointment.save();

        return res.status(200).json({ 
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });
    } catch (err) {
        next(err);
    }
};
 
// --------- GET DASHBOARD STATUS ----------
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: "pending"});
        const confirmedAppointments = await Appointment.countDocuments({ status: "confirmed"});
        const cancelledAppointments = await Appointment.countDocuments({ status: "cancelled"});

        const totalUsers = await User.countDocuments();
        const totalServices = await Service.countDocuments();

        const latestAppointments = await Appointment.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user service")

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
    } catch (err) {
        next(err);
    }
};

//  ---------- FILTER APPOINTMENTS ----------
exports.filterAppointments = async (req, res, next) => {
    try {
        const { date, serviceId, status, userId } = req.query;

        const query = {};

        if (date) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate)) {
                return res.status(400).json({ success: false, message: "Invalid date format" });
            }
            query.date = {
                $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
                $lte: new Date(parsedDate.setHours(23, 59, 59, 59)),
            };
        }

        if (serviceId) {
            query.service = serviceId.trim();
        }

        if (status) {
            query.status = status.trim();
        }

        if (userId) {
            query.user = userId.trim();
        }

        const appointments = await Appointment.find(query)
            .populate("user service")
            .sort({ date: 1});

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments,
            message: "Filtered appointments retrieved successfully",
        });
    } catch (err) {
        next(err);
    }
};