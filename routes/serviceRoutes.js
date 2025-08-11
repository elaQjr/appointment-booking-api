const express = require('express');
const router = express.Router();

// Controllers
const {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');

// Middelwares
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const {
    createServiceValidator,
    getServiceByIdValidator,
    updateServiceValidator,
    deleteServiceValidator
} = require('../middlewares/validations/serviceValidator');
const { validateResult } = require('../middlewares/validations/validateResult');

// Routes
router.route('/')
    .get( getAllServices)
    .post(authMiddleware, authorize('admin'), uploadMiddleware("image"), createServiceValidator, validateResult, createService);

router.route('/:id')
    .get(getServiceByIdValidator, validateResult, getServiceById)
    .put(authMiddleware, authorize('admin'), uploadMiddleware("image"), updateServiceValidator, validateResult, updateService)
    .delete(authMiddleware, authorize('admin'), deleteServiceValidator, validateResult, deleteService);

module.exports = router;
