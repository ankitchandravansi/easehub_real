import nodemailer from "nodemailer";

/**
 * Send email with timeout protection
 * CRITICAL: This function MUST NOT hang - it has a 10-second timeout
 * If email sending takes longer, it will reject and allow the caller to handle it
 */
export const sendEmail = async ({ to, subject, html }) => {
    // BUG FIX: Wrap email sending in Promise.race with timeout
    // This prevents the request from hanging if SMTP server is slow/unresponsive
    const emailPromise = (async () => {
        try {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
                throw new Error('Email credentials not configured. Check EMAIL_USER and EMAIL_APP_PASSWORD in .env');
            }

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                },
                // CRITICAL: Add connection timeout
                connectionTimeout: 10000, // 10 seconds
                greetingTimeout: 5000,    // 5 seconds
                socketTimeout: 10000      // 10 seconds
            });

            const mailOptions = {
                from: `"EaseHub" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${to} | MessageID: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error(`❌ Email send failed to ${to}:`, error.message);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    })();

    // BUG FIX: Race email promise against timeout
    // This ensures sendEmail NEVER hangs for more than 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Email sending timeout after 10 seconds'));
        }, 10000);
    });

    return Promise.race([emailPromise, timeoutPromise]);
};

export default sendEmail;
