import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

// ==================== JWT TOKEN GENERATION ====================
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// ==================== 1️⃣ SIGNUP (OTP REQUIRED) ====================
// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // ========== VALIDATION ==========
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

        // ========== CREATE USER IN DB (CRITICAL: BEFORE EMAIL) ==========
        const user = await User.create({
            name,
            email,
            password
        });

        // ========== GENERATE OTP AND SAVE TO DB ==========
        const otp = user.setEmailVerificationOTP();
        await user.save();

        console.log(`✅ User created: ${user.email} | OTP: ${otp} (saved to DB)`);

        // ========== SEND EMAIL (NON-BLOCKING) ==========
        // CRITICAL: Email wrapped in try-catch - MUST NOT block response
        let emailSent = false;
        try {
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
            emailSent = true;
            console.log(`✅ Verification email sent to ${user.email}`);
        } catch (emailError) {
            // Email failed but user is already created - just log the error
            console.error(`⚠️  Email send failed for ${user.email}:`, emailError.message);
            console.log(`ℹ️  User can still verify using resend OTP`);
        }

        // ========== ALWAYS RETURN SUCCESS IF USER + OTP ARE SAVED ==========
        res.status(201).json({
            success: true,
            message: emailSent
                ? 'Account created successfully. Please check your email for verification OTP.'
                : 'Account created successfully. Email delivery delayed - please use "Resend OTP" if needed.',
            data: {
                userId: user._id,
                email: user.email,
                emailSent // Let frontend know if email was sent
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

// ==================== 2️⃣ EMAIL VERIFICATION ====================
// @desc    Verify email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // ========== VALIDATION ==========
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and OTP'
            });
        }

        // ========== FIND USER WITH OTP FIELDS ==========
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

        // ========== VERIFY OTP ==========
        const isValid = user.verifyEmailOTP(otp);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // ========== MARK AS VERIFIED AND CLEAR OTP ==========
        user.isEmailVerified = true;
        user.clearEmailVerificationOTP();
        await user.save();

        console.log(`✅ Email verified for ${user.email}`);

        // ========== GENERATE TOKEN AND RETURN ==========
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

// ==================== 3️⃣ RESEND OTP (SIGNUP ONLY) ====================
// @desc    Resend verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // ========== VALIDATION ==========
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

        // ========== COOLDOWN CHECK ==========
        // 30 seconds for development, increase to 60-120 for production
        const cooldownTime = 30 * 1000; // 30 seconds

        if (user.lastOTPSentAt) {
            const timeSinceLastOTP = Date.now() - new Date(user.lastOTPSentAt).getTime();

            if (timeSinceLastOTP < cooldownTime) {
                const remainingTime = Math.ceil((cooldownTime - timeSinceLastOTP) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${remainingTime} seconds before requesting a new OTP`
                });
            }
        }

        // ========== GENERATE NEW OTP AND SAVE TO DB ==========
        const otp = user.setEmailVerificationOTP();
        await user.save();

        console.log(`✅ New OTP generated for ${user.email} | OTP: ${otp} (saved to DB)`);

        // ========== SEND EMAIL (NON-BLOCKING) ==========
        let emailSent = false;
        try {
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
            emailSent = true;
            console.log(`✅ OTP email sent to ${user.email}`);
        } catch (emailError) {
            // Email failed but OTP is already saved - just log the error
            console.error(`⚠️  Email send failed for ${user.email}:`, emailError.message);
            console.log(`ℹ️  OTP is saved in DB, user can still verify manually`);
        }

        // ========== ALWAYS RETURN SUCCESS IF OTP IS SAVED ==========
        res.status(200).json({
            success: true,
            message: emailSent
                ? 'New OTP sent to your email'
                : 'New OTP generated. Email delivery delayed - please try again or contact support.',
            data: {
                emailSent
            }
        });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error sending OTP'
        });
    }
};

// ==================== 4️⃣ LOGIN (NO OTP) ====================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ========== VALIDATION ==========
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // ========== FIND USER WITH PASSWORD ==========
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // ========== VERIFY PASSWORD ==========
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // ========== CHECK EMAIL VERIFICATION ==========
        // CRITICAL: Login requires verified email, but NO OTP generation here
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in',
                requiresVerification: true,
                email: user.email // Frontend can use this to show resend OTP option
            });
        }

        // ========== GENERATE TOKEN AND RETURN ==========
        const token = generateToken(user._id);

        console.log(`✅ Login successful for ${user.email}`);

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

// ==================== 5️⃣ FORGOT PASSWORD (OTP REQUIRED) ====================
// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // ========== VALIDATION ==========
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

        // ========== COOLDOWN CHECK ==========
        const cooldownTime = 30 * 1000; // 30 seconds

        if (user.lastOTPSentAt) {
            const timeSinceLastOTP = Date.now() - new Date(user.lastOTPSentAt).getTime();

            if (timeSinceLastOTP < cooldownTime) {
                const remainingTime = Math.ceil((cooldownTime - timeSinceLastOTP) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${remainingTime} seconds before requesting a new OTP`
                });
            }
        }

        // ========== GENERATE PASSWORD RESET OTP AND SAVE TO DB ==========
        const otp = user.setPasswordResetOTP();
        await user.save();

        console.log(`✅ Password reset OTP generated for ${user.email} | OTP: ${otp} (saved to DB)`);

        // ========== SEND EMAIL (NON-BLOCKING) ==========
        let emailSent = false;
        try {
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
            emailSent = true;
            console.log(`✅ Password reset email sent to ${user.email}`);
        } catch (emailError) {
            console.error(`⚠️  Email send failed for ${user.email}:`, emailError.message);
            console.log(`ℹ️  OTP is saved in DB, user can still reset password manually`);
        }

        // ========== ALWAYS RETURN SUCCESS IF OTP IS SAVED ==========
        res.status(200).json({
            success: true,
            message: emailSent
                ? 'Password reset OTP sent to your email'
                : 'Password reset OTP generated. Email delivery delayed - please try again.',
            data: {
                emailSent
            }
        });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error processing request'
        });
    }
};

// ==================== 6️⃣ RESET PASSWORD ====================
// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        // ========== VALIDATION ==========
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

        // ========== FIND USER WITH PASSWORD RESET OTP ==========
        const user = await User.findOne({ email }).select('+passwordResetOTP +passwordResetOTPExpiry +password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // ========== VERIFY OTP ==========
        const isValid = user.verifyPasswordResetOTP(otp);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // ========== UPDATE PASSWORD AND CLEAR OTP ==========
        user.password = newPassword;
        user.clearPasswordResetOTP();
        await user.save();

        console.log(`✅ Password reset successful for ${user.email}`);

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

// ==================== ADDITIONAL ROUTES ====================
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
