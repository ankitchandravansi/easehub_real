import { sendEmail } from './sendEmail.js';

/**
 * CRITICAL: Fire-and-forget email sending
 * This function sends email ASYNCHRONOUSLY without blocking the caller
 * The API response is sent BEFORE email is attempted
 * 
 * WHY THIS PREVENTS TIMEOUTS:
 * - No await in the calling function
 * - Email happens in background using setImmediate
 * - Failures are logged but don't affect API response
 * - Even if SMTP is slow/down, API responds immediately
 */
export const sendEmailAsync = ({ to, subject, html }) => {
    // Use setImmediate to defer email sending to next event loop tick
    // This ensures the current request completes first
    setImmediate(async () => {
        try {
            await sendEmail({ to, subject, html });
            console.log(`✅ Background email sent to ${to}`);
        } catch (error) {
            // Email failed but API already responded - just log it
            console.error(`⚠️  Background email failed for ${to}:`, error.message);

            // In production, you might want to:
            // - Add to retry queue
            // - Log to monitoring service
            // - Store failed email in DB for manual retry
        }
    });

    // Return immediately without waiting for email
    console.log(`📧 Email queued for ${to} (will send in background)`);
};

/**
 * Helper to send verification OTP email (non-blocking)
 */
export const sendVerificationOTP = (user, otp) => {
    sendEmailAsync({
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
};

/**
 * Helper to send password reset OTP email (non-blocking)
 */
export const sendPasswordResetOTP = (user, otp) => {
    sendEmailAsync({
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
};

export default {
    sendEmailAsync,
    sendVerificationOTP,
    sendPasswordResetOTP
};
