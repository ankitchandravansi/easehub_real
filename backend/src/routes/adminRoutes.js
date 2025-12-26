import express from 'express';
import {
    getAllUsers,
    getAllBookings,
    getAllPayments,
    updateBookingStatus,
    getDashboardStats,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.get('/payments', getAllPayments);
router.patch('/bookings/:bookingId/status', updateBookingStatus);
router.get('/stats', getDashboardStats);

export default router;
