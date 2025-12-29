import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`[API] Response:`, response.status, response.data);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`[API] Error ${error.response.status}:`, error.response.data);
        } else if (error.request) {
            console.error('[API] No response received:', error.message);
        } else {
            console.error('[API] Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
