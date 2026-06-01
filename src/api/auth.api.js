import { createApiClient } from './createApiClient.js';

const authApi = createApiClient(import.meta.env.VITE_AUTH_SERVICE_URL);

export const login = async (credentials, { signal } = {}) => {
    const response = await authApi.post('/api/auth/login', credentials, { signal });
    return response.data;
};

export const register = async (payload, { signal } = {}) => {
    const response = await authApi.post('/api/auth/register', payload, { signal });
    return response.data;
};

export const logout = async ({ signal } = {}) => {
    const response = await authApi.post('/api/auth/logout', null, { signal });
    return response.data;
};

export const getMe = async ({ signal } = {}) => {
    const response = await authApi.get('/api/auth/me', { signal });
    return response.data;
};
