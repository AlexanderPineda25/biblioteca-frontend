import axios from 'axios';
import { correlationIdInterceptor } from './correlation-id.js';

const rolesApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

rolesApi.interceptors.request.use(correlationIdInterceptor);

rolesApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);

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
