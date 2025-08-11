const Service = require('../models/Service');

//  GET: دریافت همه سرویس‌ها
exports.getAllServices = async (req, res, next) => {
    try {
        const services = await Service.find();
        res.status(200).json({
            success: true,
            data: services,
            message: 'Services retrieved successfully',
        });
    } catch (err) {
        next(err);
    }
};

//  POST: ساخت سرویس جدید (فقط ادمین)
exports.createService = async (req, res, next) => {
  try {
    const { name, duration, price, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Service name is required' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newService = await Service.create({ name, duration, price, description, image });
    res.status(201).json({
        success: true,
        data: newService,
        message: 'Service created successfully',
    });
  } catch (err) {
    next(err);
  }
};

//  GET: دریافت سرویس خاص با ID
exports.getServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const service = await Service.findById( id );

        if(!service) return res.status(404).json({ success: false, message: 'Service not found' });

        res.status(200).json({
            success: true,
            data: service,
            message: 'Service retrieved successfully',
        });
    } catch (err) {
        next(err);
    }
};

//  PUT: ویرایش سرویس (فقط ادمین)
exports.updateService = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`
        }

        if (req.body.name && req.body.name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Service name cannot be empty' });
        }
        
        const updatedService = await Service.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if(!updatedService) return res.status(404).json({ success: false, message: 'Service not found' });

        res.status(200).json({
            success: true,
            data: updatedService,
            message: 'Service updated successfully',
        });
    } catch (err) {
        next(err);
    }
};

//  DELETE: حذف سرویس (فقط ادمین)
exports.deleteService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete( id );
        if(!deletedService) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({
            success: true,
            data: deletedService,
            message: 'Service deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};