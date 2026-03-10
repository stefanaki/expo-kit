import axios from 'axios';

import { useAuthStore } from '@/lib/auth';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
if (!baseURL) {
  console.warn('[API] EXPO_PUBLIC_API_BASE_URL is not set. API requests will fail.');
}

export const apiClient = axios.create({
  baseURL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const session = useAuthStore.getState().session;
  if (session?.accessToken) {
    config.headers.set('Authorization', `Bearer ${session.accessToken}`);
  }
  return config;
});
