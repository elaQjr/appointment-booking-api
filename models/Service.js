const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Service name is required.'],
        trim: true,
    },
    description: {
        type: String,
        default: ' ',
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: 0,
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required.'],
    },
    department: {
        type: String,
        enum: ['رادیولوژی', 'آزمایشگاه', 'سونوگرافی', 'فیزیوتراپی', 'مشاوره', 'دیگر'],
        default: 'دیگر',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
    },
},{
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;