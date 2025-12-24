import api from '../utils/api';

export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/bookings/verify-payment', paymentData);
    return response.data;
};

export const getMyBookings = async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
};

export const getBookingById = async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
};

export const cancelBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
};

export default {
    createBooking,
    verifyPayment,
    getMyBookings,
    getBookingById,
    cancelBooking
};
