import api from '../utils/api';

// Remove local axios instance and interceptors as they are in utils/api.js

// Signup
export const signup = async (data) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
};

// Verify Email
export const verifyEmail = async (data) => {
    const response = await api.post('/auth/verify-email', data);
    if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
};

// Resend OTP
export const resendOTP = async (data) => {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
};

// Login
export const login = async (data) => {
    const response = await api.post('/auth/login', data);
    if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
};

// Forgot Password
export const forgotPassword = async (data) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
};

// Reset Password
export const resetPassword = async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
};

// Get Current User
export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export default api;
