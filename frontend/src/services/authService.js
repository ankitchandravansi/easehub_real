import api from './api';

// =========================
// AUTH SERVICES (FIXED)
// =========================

export const signup = async ({ name, email, password }) => {
    const response = await api.post('/auth/signup', {
        name,
        email,
        password
    });

    return response.data;
};

export const login = async ({ email, password }) => {
    const response = await api.post('/auth/login', {
        email,
        password
    });

    return response.data;
};

export const verifyEmail = async ({ email, otp }) => {
    const response = await api.post('/auth/verify-email', {
        email,
        otp
    });

    return response.data;
};

export const resendOTP = async ({ email }) => {
    const response = await api.post('/auth/resend-otp', {
        email
    });

    return response.data;
};

export const forgotPassword = async ({ email }) => {
    const response = await api.post('/auth/forgot-password', {
        email
    });

    return response.data;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
    const response = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword
    });

    return response.data;
};
