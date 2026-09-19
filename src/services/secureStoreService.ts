// ============================================================
// SERVICE: secureStoreService — src/services/secureStoreService.ts
// ============================================================
// Servicio de almacenamiento seguro cifrado respaldado por Keychain (iOS)
// y Keystore (Android) a través de expo-secure-store.
// Dominio: Beat & Light Pro (Token de Operador / Código de Acceso DJ).
// ============================================================

import * as SecureStore from 'expo-secure-store';

const OPERATOR_TOKEN_KEY = 'blp_operator_access_token';

/**
 * Almacena de forma cifrada el token de operador o clave de acceso en SecureStore.
 */
export async function saveOperatorToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(OPERATOR_TOKEN_KEY, token);
}

/**
 * Recupera el token cifrado desde SecureStore.
 */
export async function getOperatorToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(OPERATOR_TOKEN_KEY);
}

/**
 * Elimina el token almacenado en SecureStore.
 */
export async function deleteOperatorToken(): Promise<void> {
  await SecureStore.deleteItemAsync(OPERATOR_TOKEN_KEY);
}
