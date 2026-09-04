// ============================================================
// SERVICE LAYER — src/services/api.ts
// ============================================================
// Instancia centralizada de Axios con baseURL, timeout e interceptors.
// ============================================================

import axios from 'axios';

declare const process: { env: { [key: string]: string | undefined } };

// La baseURL se obtiene desde la variable de entorno Expo (EXPO_PUBLIC_API_URL)
// Con fallback a jsonplaceholder o API predeterminada
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://jsonplaceholder.typicode.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000, // 10 segundos para prevenir llamadas colgadas
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de Solicitud (Request Interceptor)
apiClient.interceptors.request.use(
  (config) => {
    // Listo para adjuntar tokens JWT de autenticación en headers cuando se requiera
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta (Response Interceptor)
apiClient.interceptors.response.use(
  (response) => response,
  (error: { response?: { status?: number; data?: unknown }; message?: string }) => {
    if (error.response?.status === 401) {
      console.warn('Sesión expirada o no autorizada (401)');
    } else if (error.response?.status === 500) {
      console.error('Error de Servidor Interno (500):', error.response.data);
    }
    // Siempre rechazar la promesa para que TanStack Query capture el estado de error
    return Promise.reject(error);
  }
);
