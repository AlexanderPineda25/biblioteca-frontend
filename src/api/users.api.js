import axios from 'axios';
import { correlationIdInterceptor } from './correlation-id.js';

const usersApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

usersApi.interceptors.request.use(correlationIdInterceptor);

usersApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getUsers = async () => {
    const response = await usersApi.get('/api/users');
    return response.data;
};

export const getUserById = async (id) => {
    const response = await usersApi.get(`/api/users/${id}`);
    return response.data;
};

export const activateUser = async (id) => {
    const response = await usersApi.patch(`/api/users/${id}/activate`);
    return response.data;
};

export const deactivateUser = async (id) => {
    const response = await usersApi.patch(`/api/users/${id}/deactivate`);
    return response.data;
};

export const assignRoleToUser = async (id, roleName) => {
    const response = await usersApi.post(`/api/users/${id}/roles`, { roleName });
    return response.data;
};
