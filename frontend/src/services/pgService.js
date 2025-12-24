import api from '../utils/api';

export const getAllPGs = async () => {
    const response = await api.get('/pgs');
    return response.data;
};

export const getPGById = async (id) => {
    const response = await api.get(`/pgs/${id}`);
    return response.data;
};

export const createPG = async (pgData) => {
    const response = await api.post('/pgs', pgData);
    return response.data;
};

export const updatePG = async (id, pgData) => {
    const response = await api.put(`/pgs/${id}`, pgData);
    return response.data;
};

export const deletePG = async (id) => {
    const response = await api.delete(`/pgs/${id}`);
    return response.data;
};

export default {
    getAllPGs,
    getPGById,
    createPG,
    updatePG,
    deletePG
};
