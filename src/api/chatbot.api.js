import axios from 'axios';
import { correlationIdInterceptor } from './correlation-id.js';

const chatbotApi = axios.create({
    baseURL: import.meta.env.VITE_CHATBOT_SERVICE_URL || 'http://localhost:3003',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

chatbotApi.interceptors.request.use(correlationIdInterceptor);

chatbotApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
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
