import Booking from '../models/Booking.js';
import PGHostel from '../models/PGHostel.js';
import razorpay from '../config/razorpay.js'; // Import centralized config
import crypto from 'crypto';

// Remove direct initialization
// const razorpay = new Razorpay({...})

export const createBooking = async (req, res) => {
    try {
        const { pgId, checkInDate, checkOutDate, guestName, guestEmail, guestPhone, specialRequests } = req.body;

        if (!pgId || !checkInDate || !checkOutDate || !guestName || !guestEmail || !guestPhone) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        const pg = await PGHostel.findById(pgId);
        if (!pg) {
            return res.status(404).json({
                success: false,
                message: 'PG not found'
            });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        if (days <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date range'
            });
        }

        const totalAmount = pg.price * days;

        // Check if Razorpay is initialized
        if (!razorpay) {
            return res.status(503).json({
                success: false,
                message: 'Payment system is currently unavailable (Missing configuration)'
            });
        }

        const booking = await Booking.create({
            user: req.userId,
            pg: pgId,
            checkInDate,
            checkOutDate,
            totalAmount,
            guestName,
            guestEmail,
            guestPhone,
            specialRequests
        });

        const options = {
            amount: totalAmount * 100,
            currency: 'INR',
            receipt: `booking_${booking._id}`,
            notes: {
                bookingId: booking._id.toString(),
                userId: req.userId.toString()
            }
        };

        const order = await razorpay.orders.create(options);

        booking.razorpayOrderId = order.id;
        await booking.save();

        res.status(201).json({
            success: true,
            data: {
                booking,
                order
            }
        });
    } catch (error) {
        console.error('Create Booking Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating booking'
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !bookingId) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification data'
            });
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(503).json({
                success: false,
                message: 'Payment verification unavailable (Missing configuration)'
            });
        }

        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === razorpaySignature;

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.razorpayPaymentId = razorpayPaymentId;
        booking.razorpaySignature = razorpaySignature;
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: booking
        });
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error verifying payment'
        });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId })
            .populate('pg')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Get My Bookings Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching bookings'
        });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('pg')
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.user._id.toString() !== req.userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Get Booking Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching booking'
        });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('pg')
            .populate('user', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Get All Bookings Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching bookings'
        });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking status updated',
            data: booking
        });
    } catch (error) {
        console.error('Update Booking Status Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating booking status'
        });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.user.toString() !== req.userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        console.error('Cancel Booking Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error cancelling booking'
        });
    }
};
