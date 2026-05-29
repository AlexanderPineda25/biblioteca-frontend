import { createApiClient } from './createApiClient.js';

const chatbotApi = createApiClient(import.meta.env.VITE_CHATBOT_SERVICE_URL || 'http://localhost:3003');

export const sendChatMessage = async ({ message, conversationId, history }) => {
    const response = await chatbotApi.post('/api/chatbot/messages', {
        message,
        conversationId,
        history,
    });
    return response.data;
};
