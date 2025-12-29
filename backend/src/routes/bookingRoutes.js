import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createBooking,
    submitPaymentProof,
    getUserBookings,
    getBookingById,
    getAllBookings,
    updateBookingStatus,
    upload
} from '../controllers/bookingController.js';

const router = express.Router();

// IMPORTANT: Specific routes MUST come before parameterized routes
// Otherwise /:id will catch /create, /payment-proof, etc.

// User routes
router.post('/create', protect, createBooking);
router.post('/payment-proof', protect, upload.single('proofImage'), submitPaymentProof);
router.get('/my-bookings', protect, getUserBookings);

// Admin routes (specific paths first)
router.get('/admin/all', protect, getAllBookings);
router.patch('/admin/:id/status', protect, updateBookingStatus);

// Parameterized route LAST
router.get('/:id', protect, getBookingById);

export default router;
