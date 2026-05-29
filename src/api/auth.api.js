import axios from 'axios';
import { correlationIdInterceptor } from './correlation-id.js';

const authApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

authApi.interceptors.request.use(correlationIdInterceptor);

export const login = async (credentials) => {
    console.log('[auth.api] POST /api/auth/login with:', credentials, 'baseURL:', authApi.defaults.baseURL);
    const response = await authApi.post('/api/auth/login', credentials);
    console.log('[auth.api] login response:', response.status, response.headers, response.data);
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
    console.log('[auth.api] GET /api/auth/me');
    const response = await authApi.get('/api/auth/me');
    console.log('[auth.api] getMe response:', response.status, response.data);
    return response.data;
};
