import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceType: {
        type: String,
        enum: ['PG', 'Laundry', 'Meal', 'Extra'],
        required: true
    },
    serviceId: {
        type: String,
        required: false
    },
    serviceName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    bookingId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['CREATED', 'PAYMENT_PENDING', 'PAID', 'CANCELLED'],
        default: 'CREATED'
    },
    utr: {
        type: String,
        default: null
    },
    proofImage: {
        type: String,
        default: null
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// bookingSchema.index({ bookingId: 1 }, { unique: true }); // Removed: duplicate of schema definition
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ utr: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
