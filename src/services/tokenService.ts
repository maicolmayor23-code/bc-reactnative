// ============================================================
// SERVICE: tokenService — src/services/tokenService.ts
// ============================================================
// Servicio de almacenamiento seguro cifrado respaldado por Keychain (iOS)
// y Keystore (Android) a través de expo-secure-store.
// IMPORTANTE: Almacena EXCLUSIVAMENTE accessToken y refreshToken.
// NUNCA usa AsyncStorage ni MMKV.
// ============================================================

import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'blp_auth_access_token',
  REFRESH_TOKEN: 'blp_auth_refresh_token',
} as const;

/**
 * Almacena de forma cifrada el accessToken y refreshToken en SecureStore.
 */
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
    SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
  ]);
}

/**
 * Recupera el accessToken cifrado desde SecureStore.
 */
export async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
}

/**
 * Recupera el refreshToken cifrado desde SecureStore.
 */
export async function getRefreshToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
}

/**
 * Elimina ambos tokens almacenados en SecureStore al cerrar sesión.
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
    SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
  ]);
}
