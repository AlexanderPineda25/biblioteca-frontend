import { createApiClient } from './createApiClient.js';

const authApi = createApiClient(import.meta.env.VITE_AUTH_SERVICE_URL);

export const login = async (credentials) => {
    const response = await authApi.post('/api/auth/login', credentials);
    return response.data;
};

export const register = async (payload) => {
    const response = await authApi.post('/api/auth/register', payload);
    return response.data;
};

export const logout = async () => {
    const response = await authApi.post('/api/auth/logout');
    return response.data;
};

export const getMe = async () => {
    const response = await authApi.get('/api/auth/me');
    return response.data;
};
