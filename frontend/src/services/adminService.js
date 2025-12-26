import api from '../utils/api';

export const getAllUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const getAllBookings = async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
};

export const getAllPayments = async () => {
    const response = await api.get('/admin/payments');
    return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
    const response = await api.patch(`/admin/bookings/${bookingId}/status`, { status });
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};
