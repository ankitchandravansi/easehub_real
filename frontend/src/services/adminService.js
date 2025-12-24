import api from '../utils/api';

export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
};

export const getAllBookings = async () => {
    const response = await api.get('/bookings');
    return response.data;
};

export const updateBookingStatus = async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
};

export default {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    getAllBookings,
    updateBookingStatus
};
