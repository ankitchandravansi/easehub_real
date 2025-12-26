import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
        razorpayOrderId: {
            type: String,
            required: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        razorpaySignature: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        status: {
            type: String,
            enum: ['created', 'pending', 'success', 'failed'],
            default: 'created',
        },
        paymentMethod: String,
        failureReason: String,
    },
    { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
