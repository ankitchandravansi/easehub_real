import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationOTP: {
            type: String,
            select: false
        },
        emailVerificationOTPExpiry: {
            type: Date,
            select: false
        },
        passwordResetOTP: {
            type: String,
            select: false
        },
        passwordResetOTPExpiry: {
            type: Date,
            select: false
        },
        lastOTPSentAt: {
            type: Date,
            select: false
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate 6-digit OTP
userSchema.methods.generateOTP = function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Set email verification OTP
userSchema.methods.setEmailVerificationOTP = function () {
    const otp = this.generateOTP();
    this.emailVerificationOTP = otp;
    this.emailVerificationOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.lastOTPSentAt = Date.now();
    return otp;
};

// Set password reset OTP
userSchema.methods.setPasswordResetOTP = function () {
    const otp = this.generateOTP();
    this.passwordResetOTP = otp;
    this.passwordResetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.lastOTPSentAt = Date.now();
    return otp;
};

// Verify email OTP
userSchema.methods.verifyEmailOTP = function (otp) {
    if (!this.emailVerificationOTP || !this.emailVerificationOTPExpiry) {
        return false;
    }

    if (Date.now() > this.emailVerificationOTPExpiry) {
        return false;
    }

    return this.emailVerificationOTP === otp;
};

// Verify password reset OTP
userSchema.methods.verifyPasswordResetOTP = function (otp) {
    if (!this.passwordResetOTP || !this.passwordResetOTPExpiry) {
        return false;
    }

    if (Date.now() > this.passwordResetOTPExpiry) {
        return false;
    }

    return this.passwordResetOTP === otp;
};

// Clear email verification OTP
userSchema.methods.clearEmailVerificationOTP = function () {
    this.emailVerificationOTP = undefined;
    this.emailVerificationOTPExpiry = undefined;
};

// Clear password reset OTP
userSchema.methods.clearPasswordResetOTP = function () {
    this.passwordResetOTP = undefined;
    this.passwordResetOTPExpiry = undefined;
};

const User = mongoose.model('User', userSchema);

export default User;
