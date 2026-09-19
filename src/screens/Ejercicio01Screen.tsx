// ============================================================
// SCREEN: Ejercicio01Screen — src/screens/Ejercicio01Screen.tsx
// ============================================================
// Demostración interactiva de JWT Auth con dummyjson.com (Ejercicio 01).
// Demuestra obtención de tokens, almacenamiento en SecureStore,
// llamada autenticada a /auth/me y logout seguro.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { loginApi, getCurrentUserApi } from '../services/authService';
import { saveTokens, getAccessToken, getRefreshToken, clearTokens } from '../services/tokenService';
import { User } from '../types';

export function Ejercicio01Screen(): React.JSX.Element {
  const [loading, setLoading] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [hasRefreshToken, setHasRefreshToken] = useState(false);
  const [storedInSecureStore, setStoredInSecureStore] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  // Al cargar la pantalla, verificar si ya existen tokens almacenados
  React.useEffect(() => {
    checkInitialTokens();
  }, []);

  const checkInitialTokens = async () => {
    try {
      const access = await getAccessToken();
      const refresh = await getRefreshToken();
      if (access && refresh) {
        setHasAccessToken(true);
        setHasRefreshToken(true);
        setStoredInSecureStore(true);
      }
    } catch {
      // noop
    }
  };

  /**
   * 1. Login con credenciales de prueba emilys / emilyspass
   */
  const handleLogin = async () => {
    setLoading(true);
    setUserInfo(null);
    try {
      const result = await loginApi({ username: 'emilys', password: 'emilyspass' });
      
      // Guardar tokens cifrados en SecureStore
      await saveTokens(result.accessToken, result.refreshToken);

      setHasAccessToken(true);
      setHasRefreshToken(true);
      setStoredInSecureStore(true);
      
      Alert.alert('Éxito', 'Tokens recibidos y guardados cifrados en SecureStore.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Fallo en inicio de sesión.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 3. Obtener Perfil mediante GET /auth/me con Authorization: Bearer <accessToken>
   */
  const handleFetchProfile = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert('Atención', 'No hay un Access Token disponible en SecureStore.');
        setLoading(false);
        return;
      }

      const profile = await getCurrentUserApi(token);
      setUserInfo(profile);
      Alert.alert('Perfil Obtenido', `Bienvenido, ${profile.firstName} ${profile.lastName}`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error al consultar /auth/me');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 5. Logout ejecutando SecureStore.deleteItemAsync para ambos tokens
   */
  const handleLogout = async () => {
    setLoading(true);
    try {
      await clearTokens();
      setHasAccessToken(false);
      setHasRefreshToken(false);
      setStoredInSecureStore(false);
      setUserInfo(null);
      Alert.alert('Sesión Cerrada', 'Ambos tokens fueron eliminados de SecureStore.');
    } catch (err: any) {
      Alert.alert('Error', 'No se pudieron eliminar los tokens.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Ionicons name="key-outline" size={36} color={COLORS.primary} />
        <Text style={styles.title}>Ejercicio 01: JWT Auth</Text>
        <Text style={styles.subtitle}>Demostración interactiva con API dummyjson.com</Text>
      </View>

      {/* Tarjeta de Estado del Token */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estado de Almacenamiento Cifrado</Text>

        <View style={styles.statusRow}>
          <Ionicons
            name={hasAccessToken ? 'checkmark-circle' : 'close-circle'}
            size={22}
            color={hasAccessToken ? '#4CAF50' : '#FF5252'}
          />
          <Text style={styles.statusText}>Access Token Recibido: {hasAccessToken ? 'SÍ' : 'NO'}</Text>
        </View>

        <View style={styles.statusRow}>
          <Ionicons
            name={hasRefreshToken ? 'checkmark-circle' : 'close-circle'}
            size={22}
            color={hasRefreshToken ? '#4CAF50' : '#FF5252'}
          />
          <Text style={styles.statusText}>Refresh Token Recibido: {hasRefreshToken ? 'SÍ' : 'NO'}</Text>
        </View>

        <View style={styles.statusRow}>
          <Ionicons
            name={storedInSecureStore ? 'lock-closed' : 'lock-open-outline'}
            size={22}
            color={storedInSecureStore ? '#61DAFB' : COLORS.textSecondary}
          />
          <Text style={styles.statusText}>
            Persistido en SecureStore: {storedInSecureStore ? 'SÍ (Keychain/Keystore)' : 'NO'}
          </Text>
        </View>

        <Text style={styles.securityNote}>
          🔒 REGLA DE SEGURIDAD: Los tokens completos nunca se muestran en texto plano en la interfaz.
        </Text>
      </View>

      {/* Botón 1: Login */}
      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>1. Login (emilys / emilyspass)</Text>
        )}
      </TouchableOpacity>

      {/* Botón 2: GET /auth/me */}
      <TouchableOpacity
        style={[styles.button, styles.profileButton, !hasAccessToken ? styles.disabledButton : null]}
        onPress={handleFetchProfile}
        disabled={loading || !hasAccessToken}
      >
        <Text style={styles.buttonText}>2. Obtener Perfil (GET /auth/me)</Text>
      </TouchableOpacity>

      {/* Datos del usuario autenticado */}
      {userInfo && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Datos del Usuario Autenticado (/auth/me)</Text>
          <Text style={styles.infoText}>👤 Nombre: {userInfo.firstName} {userInfo.lastName}</Text>
          <Text style={styles.infoText}>🏷️ Username: {userInfo.username}</Text>
          <Text style={styles.infoText}>📧 Email: {userInfo.email}</Text>
          <Text style={styles.infoText}>🆔 User ID: {userInfo.id}</Text>
        </View>
      )}

      {/* Botón 3: Logout */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton, !hasAccessToken ? styles.disabledButton : null]}
        onPress={handleLogout}
        disabled={loading || !hasAccessToken}
      >
        <Text style={[styles.buttonText, { color: '#FFF' }]}>3. Logout (Eliminar tokens)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  securityNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
  },
  profileButton: {
    backgroundColor: '#61DAFB',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
});
