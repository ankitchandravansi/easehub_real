import mongoose from 'mongoose';

const laundryServiceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    pricingType: {
        type: String,
        enum: ['per-kg', 'monthly', 'per-item'],
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    features: [{
        type: String
    }],
    turnaroundTime: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const LaundryService = mongoose.model('LaundryService', laundryServiceSchema);

export default LaundryService;
