import api from "./api";

export const fetchPGs = async () => {
    const response = await api.get("/pg");
    return response.data;
};
