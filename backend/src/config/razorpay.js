import Razorpay from 'razorpay';
import dotenv from 'dotenv';

// Ensure env vars are loaded
dotenv.config();

const createRazorpayInstance = () => {
    // Check if keys exist
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.warn('⚠️ Razorpay keys missing in .env. Payment features will be disabled.');
        return null; // Return null instead of crashing
    }

    try {
        return new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    } catch (error) {
        console.error('❌ Razorpay Error:', error.message);
        return null;
    }
};

// Export the instance (can be null)
const razorpay = createRazorpayInstance();

export default razorpay;
