import api from '../utils/api';

// Signup - sends ONLY name, email, password (NOT confirmPassword)
export const signup = async ({ name, email, password }) => {
    const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        confirmPassword: password // Backend expects this for validation
    });
    return response.data;
};

// Verify Email
export const verifyEmail = async ({ email, otp }) => {
    const response = await api.post('/auth/verify-email', { email, otp });
    if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
};

// Resend OTP
export const resendOTP = async ({ email }) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
};

// Login
export const login = async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
};

// Forgot Password
export const forgotPassword = async ({ email }) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

// Reset Password
export const resetPassword = async ({ email, otp, newPassword, confirmPassword }) => {
    const response = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
        confirmPassword
    });
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
