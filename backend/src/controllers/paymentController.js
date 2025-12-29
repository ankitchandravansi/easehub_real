import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

// Razorpay disabled - using manual UPI payment system
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

export const createOrder = async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount',
            });
        }

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        const payment = await Payment.create({
            user: req.user._id,
            booking: bookingId,
            razorpayOrderId: order.id,
            amount: amount,
            status: 'created',
        });

        return res.status(201).json({
            success: true,
            data: {
                orderId: order.id,
                amount: amount,
                currency: 'INR',
                paymentId: payment._id,
            },
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating payment order',
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

        const sign = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpaySignature === expectedSign) {
            const payment = await Payment.findById(paymentId);

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found',
                });
            }

            payment.razorpayPaymentId = razorpayPaymentId;
            payment.razorpaySignature = razorpaySignature;
            payment.status = 'success';
            await payment.save();

            if (payment.booking) {
                await Booking.findByIdAndUpdate(payment.booking, {
                    paymentStatus: 'paid',
                    status: 'confirmed',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                data: payment,
            });
        } else {
            const payment = await Payment.findById(paymentId);
            if (payment) {
                payment.status = 'failed';
                payment.failureReason = 'Signature verification failed';
                await payment.save();
            }

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    } catch (error) {
        console.error('Verify Payment Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying payment',
        });
    }
};

export const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id })
            .populate('booking')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
