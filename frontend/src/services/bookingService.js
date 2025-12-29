import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings/create', bookingData);
    return response.data;
};

export const submitPaymentProof = async (bookingId, utr, proofFile) => {
    const formData = new FormData();
    formData.append('bookingId', bookingId);
    formData.append('utr', utr);
    if (proofFile) {
        formData.append('proofImage', proofFile);
    }

    const response = await api.post('/bookings/payment-proof', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getUserBookings = async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
};

export const getBookingById = async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
};

export const getAllBookings = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/bookings/admin/all?${params}`);
    return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
    const response = await api.patch(`/bookings/admin/${bookingId}/status`, { status });
    return response.data;
};
