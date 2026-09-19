// ============================================================
// SERVICE LAYER — src/services/api.ts
// ============================================================
// Instancia centralizada de Axios con baseURL, timeout e interceptors.
// Incluye inyección automática de Bearer token e interceptor de
// respuesta 401 para renovación transparente de tokens (Auto-Refresh).
// ============================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './tokenService';
import { refreshApi } from './authService';

declare const process: { env: { [key: string]: string | undefined } };

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://dummyjson.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Interceptor de Solicitud (Request Interceptor)
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta (Response Interceptor: Auto-Refresh en 401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    // Si el error es 401 y no se ha reintentado previamente
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          // Intentar renovar tokens mediante el refresh endpoint
          const newTokens = await refreshApi(refreshToken);
          await saveTokens(newTokens.accessToken, newTokens.refreshToken);

          // Inyectar el nuevo token y reintentar la petición original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.warn('Fallo en renovación de token 401. Forzando logout limpio.', refreshError);
        await clearTokens();
      }
    }

    return Promise.reject(error);
  }
);
