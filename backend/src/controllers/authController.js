import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate OTP
        const otp = user.setEmailVerificationOTP();
        await user.save();

        // Send verification email
        await sendEmail({
            to: user.email,
            subject: 'Email Verification - EaseHub',
            html: `
                <h1>Welcome to EaseHub!</h1>
                <p>Hi ${user.name},</p>
                <p>Thank you for signing up. Please verify your email using the OTP below:</p>
                <h2 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h2>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br>
                <p>Best regards,<br>EaseHub Team</p>
            `
        });

        res.status(201).json({
            success: true,
            message: 'Account created successfully. Please check your email for verification OTP.',
            data: {
                userId: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating account'
        });
    }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and OTP'
            });
        }

        const user = await User.findOne({ email }).select('+emailVerificationOTP +emailVerificationOTPExpiry');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        const isValid = user.verifyEmailOTP(otp);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        user.isEmailVerified = true;
        user.clearEmailVerificationOTP();
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified
                }
            }
        });
    } catch (error) {
        console.error('Verify Email Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error verifying email'
        });
    }
};

// @desc    Resend verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email'
            });
        }

        const user = await User.findOne({ email }).select('+lastOTPSentAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Check cooldown (60 seconds)
        if (user.lastOTPSentAt) {
            const timeSinceLastOTP = Date.now() - new Date(user.lastOTPSentAt).getTime();
            const cooldownTime = 60 * 1000; // 60 seconds

            if (timeSinceLastOTP < cooldownTime) {
                const remainingTime = Math.ceil((cooldownTime - timeSinceLastOTP) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${remainingTime} seconds before requesting a new OTP`
                });
            }
        }

        // Generate new OTP
        const otp = user.setEmailVerificationOTP();
        await user.save();

        // Send email
        await sendEmail({
            to: user.email,
            subject: 'Email Verification OTP - EaseHub',
            html: `
                <h1>Email Verification</h1>
                <p>Hi ${user.name},</p>
                <p>Your new verification OTP is:</p>
                <h2 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h2>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br>
                <p>Best regards,<br>EaseHub Team</p>
            `
        });

        res.status(200).json({
            success: true,
            message: 'New OTP sent to your email'
        });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error sending OTP'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in',
                requiresVerification: true
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified
                }
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error logging in'
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email'
            });
        }

        const user = await User.findOne({ email }).select('+lastOTPSentAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        // Check cooldown
        if (user.lastOTPSentAt) {
            const timeSinceLastOTP = Date.now() - new Date(user.lastOTPSentAt).getTime();
            const cooldownTime = 60 * 1000;

            if (timeSinceLastOTP < cooldownTime) {
                const remainingTime = Math.ceil((cooldownTime - timeSinceLastOTP) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${remainingTime} seconds before requesting a new OTP`
                });
            }
        }

        // Generate OTP
        const otp = user.setPasswordResetOTP();
        await user.save();

        // Send email
        await sendEmail({
            to: user.email,
            subject: 'Password Reset OTP - EaseHub',
            html: `
                <h1>Password Reset Request</h1>
                <p>Hi ${user.name},</p>
                <p>You requested to reset your password. Use the OTP below:</p>
                <h2 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h2>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br>
                <p>Best regards,<br>EaseHub Team</p>
            `
        });

        res.status(200).json({
            success: true,
            message: 'Password reset OTP sent to your email'
        });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error processing request'
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const user = await User.findOne({ email }).select('+passwordResetOTP +passwordResetOTPExpiry +password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isValid = user.verifyPasswordResetOTP(otp);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        user.password = newPassword;
        user.clearPasswordResetOTP();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. Please login with your new password.'
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error resetting password'
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching user'
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error logging out'
        });
    }
};
