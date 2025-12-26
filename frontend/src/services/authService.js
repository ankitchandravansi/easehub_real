import api from './api';

// =========================
// AUTH SERVICES (FINAL)
// =========================

export const signup = async ({ name, email, password }) => {
    const res = await api.post('/auth/signup', { name, email, password });
    return res.data;
};

export const login = async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
};

export const verifyEmail = async ({ email, otp }) => {
    const res = await api.post('/auth/verify-email', { email, otp });
    return res.data;
};

export const resendOTP = async ({ email }) => {
    const res = await api.post('/auth/resend-otp', { email });
    return res.data;
};

export const forgotPassword = async ({ email }) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
    const res = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword
    });
    return res.data;
};

// ✅ ADD THIS (VERY IMPORTANT)
export const getMe = async () => {
    const res = await api.get('/auth/me');
    return res.data;
};

export const logout = async () => {
    const res = await api.post('/auth/logout');
    return res.data;
};
