import Booking from '../models/Booking.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/payment-proofs';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const bookingId = req.body.bookingId || Date.now();
        cb(null, `proof-${bookingId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images allowed'));
        }
    }
});

const generateBookingId = async () => {
    let bookingId;
    let exists = true;

    while (exists) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        bookingId = `EH-${randomNum}`;
        const existing = await Booking.findOne({ bookingId });
        if (!existing) exists = false;
    }

    return bookingId;
};

export const createBooking = async (req, res) => {
    try {
        console.log('=== CREATE BOOKING REQUEST ===');
        console.log('User ID:', req.user?._id);
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const { serviceType, serviceId, serviceName, amount, paymentDetails } = req.body;

        // Strict validation
        if (!serviceType || !serviceName) {
            console.log('Missing required fields:', { serviceType, serviceName });
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${!serviceType ? 'serviceType ' : ''}${!serviceName ? 'serviceName' : ''}`.trim()
            });
        }

        // Validate amount is a valid positive number
        const parsedAmount = Number(amount);
        if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
            console.log('Invalid amount:', amount);
            return res.status(400).json({
                success: false,
                message: 'Invalid amount. Amount must be a positive number.'
            });
        }

        const bookingId = await generateBookingId();
        console.log('Generated booking ID:', bookingId);

        const booking = new Booking({
            userId: req.user._id,
            serviceType,
            serviceId,
            serviceName,
            amount: parsedAmount,
            bookingId,
            status: 'CREATED',
            paymentDetails: paymentDetails || {}
        });

        await booking.save();
        console.log('Booking saved successfully:', booking._id);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        console.error('=== CREATE BOOKING ERROR ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        res.status(500).json({
            success: false,
            message: error.message || 'Server error creating booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const submitPaymentProof = async (req, res) => {
    try {
        const { bookingId, utr } = req.body;

        if (!bookingId || !utr) {
            return res.status(400).json({ success: false, message: 'Booking ID and UTR are required' });
        }

        const booking = await Booking.findOne({ bookingId, userId: req.user._id });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.status !== 'CREATED') {
            return res.status(400).json({ success: false, message: 'Payment proof already submitted' });
        }

        booking.utr = utr;
        booking.status = 'PAYMENT_PENDING';

        if (req.file) {
            booking.proofImage = `/uploads/payment-proofs/${req.file.filename}`;
        }

        await booking.save();

        res.json({
            success: true,
            message: 'Payment proof submitted successfully. Verification within 30 minutes.',
            data: booking
        });
    } catch (error) {
        console.error('Submit payment proof error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findOne({ bookingId: id, userId: req.user._id })
            .populate('userId', 'name email');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const { status, serviceType } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (serviceType) filter.serviceType = serviceType;

        const bookings = await Booking.find(filter)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PAID', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('userId', 'name email');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({
            success: true,
            message: `Booking ${status === 'PAID' ? 'approved' : 'rejected'} successfully`,
            data: booking
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
