import { createApiClient } from './createApiClient.js';

const catalogApi = createApiClient(import.meta.env.VITE_CATALOG_SERVICE_URL);

const buildQuery = (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, value);
        }
    });
    return query.toString();
};

export const getBooks = async (filters = {}, page = 1, limit = 10) => {
    const params = {
        page,
        limit,
        title: filters.title || undefined,
        author: filters.author || undefined,
        category: filters.category || undefined,
        available: filters.available ? 'true' : undefined,
    };
    const query = buildQuery(params);
    const response = await catalogApi.get(`/api/catalog/books${query ? `?${query}` : ''}`);
    return response.data;
};

export const createBook = async (book) => {
    const response = await catalogApi.post('/api/catalog/books', book);
    return response.data;
};

export const updateBook = async (id, book) => {
    const response = await catalogApi.put(`/api/catalog/books/${id}`, book);
    return response.data;
};

export const deleteBook = async (id) => {
    const response = await catalogApi.delete(`/api/catalog/books/${id}`);
    return response.data;
};

export const getAiRecommendations = async (interest) => {
    const response = await catalogApi.post('/api/catalog/books/ai/recommendations', { interest });
    return response.data;
};
