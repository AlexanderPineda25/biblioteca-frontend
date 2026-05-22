import axios from 'axios';

const chatbotApi = axios.create({
    baseURL: import.meta.env.VITE_CHATBOT_SERVICE_URL || 'http://localhost:3003',
    headers: {
        'Content-Type': 'application/json',
    },
});

chatbotApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

chatbotApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const sendChatMessage = async ({ message, conversationId, history }) => {
    const response = await chatbotApi.post('/api/chatbot/messages', {
        message,
        conversationId,
        history,
    });
    return response.data;
};
