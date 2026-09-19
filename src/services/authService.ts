// ============================================================
// SERVICE: authService — src/services/authService.ts
// ============================================================
// Llamadas HTTP a la API de prueba (https://dummyjson.com/auth)
// ============================================================

import axios from 'axios';
import { AuthResponse, AuthTokens, LoginPayload, User } from '../types';

const AUTH_BASE_URL = 'https://dummyjson.com/auth';

/**
 * Inicia sesión con credenciales (username y password).
 */
export async function loginApi(credentials: LoginPayload): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>(`${AUTH_BASE_URL}/login`, {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 30, // expiración simulada de 30 minutos
  }, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
}

/**
 * Solicita un nuevo par de tokens enviando el refreshToken actual.
 */
export async function refreshApi(refreshToken: string): Promise<AuthTokens> {
  const response = await axios.post<AuthTokens>(`${AUTH_BASE_URL}/refresh`, {
    refreshToken,
    expiresInMins: 30,
  }, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
}

/**
 * Consulta la información del usuario autenticado actual enviando el token Bearer.
 */
export async function getCurrentUserApi(accessToken: string): Promise<User> {
  const response = await axios.get<User>(`${AUTH_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
