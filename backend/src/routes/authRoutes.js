import express from 'express';
import {
    signup,
    login,
    getMe,
    logout,
    verifyEmail,
    resendVerificationOTP,
    forgotPassword,
    resetPassword,
    resendPasswordResetOTP
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);

// Email OTP verification (signup)
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendVerificationOTP);

// Forgot / Reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-reset-otp', resendPasswordResetOTP);

export default router;
