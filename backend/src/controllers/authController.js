import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendVerificationOTP, sendPasswordResetOTP } from '../utils/emailQueue.js';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ==================== SIGNUP (sends OTP, does NOT log in yet) ====================
export const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isEmailVerified) {
                return res.status(400).json({ success: false, message: 'User already exists with this email' });
            }
            // Resend OTP if user exists but not verified
            const otp = existingUser.setEmailVerificationOTP();
            await existingUser.save({ validateBeforeSave: false });
            sendVerificationOTP(existingUser, otp);
            return res.status(200).json({
                success: true,
                message: 'OTP resent. Please verify your email.',
                data: { email: existingUser.email }
            });
        }

        // Create user with isEmailVerified = false
        const user = await User.create({ name, email, password, isEmailVerified: false });

        // Generate and save OTP
        const otp = user.setEmailVerificationOTP();
        await user.save({ validateBeforeSave: false });

        // Send OTP email in background (non-blocking)
        sendVerificationOTP(user, otp);

        console.log(`✅ User registered (unverified): ${user.email}`);

        return res.status(201).json({
            success: true,
            message: 'Account created! Please check your email for the OTP to verify your account.',
            data: { email: user.email }
        });
    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error creating account' });
    }
};

// ==================== VERIFY EMAIL OTP ====================
export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email }).select('+emailVerificationOTP +emailVerificationOTPExpiry');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: 'Email is already verified' });
        }

        const isValid = user.verifyEmailOTP(otp);

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please request a new one.' });
        }

        // Mark email as verified and clear OTP
        user.isEmailVerified = true;
        user.clearEmailVerificationOTP();
        await user.save({ validateBeforeSave: false });

        const token = generateToken(user._id);

        console.log(`✅ Email verified: ${user.email}`);

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully! Welcome to EaseHub.',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }
        });
    } catch (error) {
        console.error('Verify Email Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error verifying email' });
    }
};

// ==================== RESEND EMAIL VERIFICATION OTP ====================
export const resendVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email }).select('+lastOTPSentAt');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: 'Email is already verified' });
        }

        // Rate limiting: once per 60 seconds
        if (user.lastOTPSentAt && Date.now() - user.lastOTPSentAt < 60 * 1000) {
            const waitSeconds = Math.ceil((60 * 1000 - (Date.now() - user.lastOTPSentAt)) / 1000);
            return res.status(429).json({ success: false, message: `Please wait ${waitSeconds} seconds before requesting a new OTP` });
        }

        const otp = user.setEmailVerificationOTP();
        await user.save({ validateBeforeSave: false });
        sendVerificationOTP(user, otp);

        return res.status(200).json({ success: true, message: 'New OTP sent to your email' });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error resending OTP' });
    }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Block login if email not verified
        if (!user.isEmailVerified) {
            // Resend OTP automatically
            const otp = user.setEmailVerificationOTP();
            await user.save({ validateBeforeSave: false });
            sendVerificationOTP(user, otp);

            return res.status(403).json({
                success: false,
                message: 'Please verify your email first. A new OTP has been sent.',
                requiresVerification: true,
                data: { email: user.email }
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error logging in' });
    }
};

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email }).select('+lastOTPSentAt');

        // Always respond success to avoid email enumeration
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account with that email exists, a password reset OTP has been sent.'
            });
        }

        // Rate limiting: once per 60 seconds
        if (user.lastOTPSentAt && Date.now() - user.lastOTPSentAt < 60 * 1000) {
            const waitSeconds = Math.ceil((60 * 1000 - (Date.now() - user.lastOTPSentAt)) / 1000);
            return res.status(429).json({ success: false, message: `Please wait ${waitSeconds} seconds before requesting another OTP` });
        }

        const otp = user.setPasswordResetOTP();
        await user.save({ validateBeforeSave: false });
        sendPasswordResetOTP(user, otp);

        console.log(`📧 Password reset OTP sent to: ${user.email}`);

        return res.status(200).json({
            success: true,
            message: 'Password reset OTP has been sent to your email. It expires in 5 minutes.'
        });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error sending reset OTP' });
    }
};

// ==================== RESET PASSWORD ====================
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({ email }).select('+passwordResetOTP +passwordResetOTPExpiry');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isValid = user.verifyPasswordResetOTP(otp);

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please request a new one.' });
        }

        // Update password and clear OTP
        user.password = newPassword;
        user.clearPasswordResetOTP();
        await user.save();

        console.log(`✅ Password reset successfully for: ${user.email}`);

        return res.status(200).json({ success: true, message: 'Password has been reset successfully. Please login with your new password.' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error resetting password' });
    }
};

// ==================== RESEND PASSWORD RESET OTP ====================
export const resendPasswordResetOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email }).select('+lastOTPSentAt');

        if (!user) {
            return res.status(200).json({ success: true, message: 'If an account with that email exists, a new OTP has been sent.' });
        }

        // Rate limiting
        if (user.lastOTPSentAt && Date.now() - user.lastOTPSentAt < 60 * 1000) {
            const waitSeconds = Math.ceil((60 * 1000 - (Date.now() - user.lastOTPSentAt)) / 1000);
            return res.status(429).json({ success: false, message: `Please wait ${waitSeconds} seconds before requesting another OTP` });
        }

        const otp = user.setPasswordResetOTP();
        await user.save({ validateBeforeSave: false });
        sendPasswordResetOTP(user, otp);

        return res.status(200).json({ success: true, message: 'New OTP sent to your email' });
    } catch (error) {
        console.error('Resend Reset OTP Error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error resending OTP' });
    }
};

// ==================== GET ME ====================
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            data: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== LOGOUT ====================
export const logout = async (req, res) => {
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
