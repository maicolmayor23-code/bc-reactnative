// ============================================================
// SERVICE: tokenService — src/services/tokenService.ts
// ============================================================
// Servicio de almacenamiento seguro cifrado respaldado por Keychain (iOS)
// y Keystore (Android) a través de expo-secure-store.
// En Web (Browser), utiliza localStorage de forma transparente como fallback.
// IMPORTANTE: Almacena EXCLUSIVAMENTE accessToken y refreshToken.
// ============================================================

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  ACCESS_TOKEN: 'blp_auth_access_token',
  REFRESH_TOKEN: 'blp_auth_refresh_token',
} as const;

/**
 * Almacena el accessToken y refreshToken.
 */
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
    } catch (e) {
      console.warn('Error al guardar tokens en localStorage web:', e);
    }
    return;
  }

  try {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  } catch (err) {
    console.warn('Error al guardar tokens en SecureStore:', err);
  }
}

/**
 * Recupera el accessToken.
 */
export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  try {
    return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
}

/**
 * Recupera el refreshToken.
 */
export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  }

  try {
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  } catch {
    return null;
  }
}

/**
 * Elimina ambos tokens al cerrar sesión.
 */
export async function clearTokens(): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(KEYS.ACCESS_TOKEN);
      localStorage.removeItem(KEYS.REFRESH_TOKEN);
    } catch (e) {
      console.warn('Error al eliminar tokens de localStorage web:', e);
    }
    return;
  }

  try {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
    ]);
  } catch (err) {
    console.warn('Error al eliminar tokens de SecureStore:', err);
  }
}
