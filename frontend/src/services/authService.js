import api from '../utils/api';

export const signup = async ({ name, email, password }) => {
    const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        confirmPassword: password,
    });
    return response.data;
};

export const verifyEmail = async ({ email, otp }) => {
    const response = await api.post('/auth/verify-email', { email, otp });
    // Save token after email verification (this is when login actually happens)
    if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
};

export const resendOTP = async ({ email }) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
};

export const login = async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const forgotPassword = async ({ email }) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async ({ email, otp, newPassword, confirmPassword }) => {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword, confirmPassword });
    return response.data;
};

export const resendResetOTP = async ({ email }) => {
    const response = await api.post('/auth/resend-reset-otp', { email });
    return response.data;
};
