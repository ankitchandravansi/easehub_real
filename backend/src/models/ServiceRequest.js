import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceType: {
        type: String,
        enum: ['pg', 'meal', 'laundry', 'extra'],
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'serviceModel'
    },
    serviceModel: {
        type: String,
        enum: ['PGHostel', 'MealPlan', 'LaundryService', null]
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'in-progress', 'completed', 'rejected'],
        default: 'pending'
    },
    requestDetails: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    attachments: [{
        type: String
    }],
    adminNotes: {
        type: String
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Populate user details when querying
serviceRequestSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email phone'
    });
    next();
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
