import axios from 'axios';

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';
const API_URL = `${API_BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds for Render cold starts
    headers: {
        'Content-Type': 'application/json'
    }
});

console.log('[API Client] Configured with base URL:', API_URL);

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log detailed error for debugging
        console.error('[API Error]', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            // Clear auth data on 401
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
