import api from "./api";

// PG Services
export const getAllPGs = async () => {
    return await api.get("/pg");
};

export const getPGById = async (id) => {
    return await api.get(`/pg/${id}`);
};

// Meal Services
export const getAllMeals = async () => {
    return await api.get("/meals");
};

export const getMealById = async (id) => {
    return await api.get(`/meals/${id}`);
};

// Laundry Services
export const getAllLaundry = async () => {
    return await api.get("/laundry");
};

export const getLaundryById = async (id) => {
    return await api.get(`/laundry/${id}`);
};

// Extra Services / Requests
export const getMyRequests = async () => {
    return await api.get("/requests/my");
};

export const createRequest = async (data) => {
    return await api.post("/requests", data);
};

export const getRequestById = async (id) => {
    return await api.get(`/requests/${id}`);
};

// Admin Services
export const getAdminStats = async () => {
    return await api.get("/admin/stats");
};

export const createPG = async (data) => {
    return await api.post("/pg", data);
};

export const updatePG = async (id, data) => {
    return await api.put(`/pg/${id}`, data);
};

export const deletePG = async (id) => {
    return await api.delete(`/pg/${id}`);
};

// Booking Services
export const createBooking = async (data) => {
    return await api.post("/bookings", data);
};

export const getMyBookings = async () => {
    return await api.get("/bookings/my");
};

export const getAllBookings = async () => {
    return await api.get("/bookings");
};
