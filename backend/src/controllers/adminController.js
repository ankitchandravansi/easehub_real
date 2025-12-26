import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('pg', 'name location')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('user', 'name email')
            .populate('booking')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalPayments = await Payment.countDocuments({ status: 'success' });
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalBookings,
                totalPayments,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
