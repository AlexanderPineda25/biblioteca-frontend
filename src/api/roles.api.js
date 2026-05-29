import { createApiClient } from './createApiClient.js';

const rolesApi = createApiClient(import.meta.env.VITE_AUTH_SERVICE_URL);

export const getRoles = async () => {
    const response = await rolesApi.get('/api/roles');
    return response.data;
};

export const createRole = async (name) => {
    const response = await rolesApi.post('/api/roles', { name });
    return response.data;
};

export const addPermissionToRole = async (roleName, code, description = '') => {
    const response = await rolesApi.post(`/api/roles/${roleName}/permissions`, { code, description });
    return response.data;
};
