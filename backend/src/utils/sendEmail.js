import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
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
};

export default sendEmail;
