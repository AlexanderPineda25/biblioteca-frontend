import axios from 'axios';
import { correlationIdInterceptor } from './correlation-id.js';

export function createApiClient(baseURL) {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  client.interceptors.request.use(correlationIdInterceptor);

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      return Promise.reject(error);
    }
  );

  return client;
}
