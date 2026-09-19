// ============================================================
// NAVIGATION: RootNavigator — src/navigation/RootNavigator.tsx
// ============================================================
// Navegador Raíz que efectúa la conmutación reactiva y condicional entre
// AuthNavigator (Login/Registro) y AppNavigator (Área Protegida) basándose
// en el estado de autenticación (isAuthenticated) e rehidratación inicial (isLoading).
// Previene parpadeos visuales al abrir la aplicación.
// ============================================================

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { COLORS } from '../theme';

export function RootNavigator(): React.JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Rehidratar sesión segura desde SecureStore al arrancar la app
    initializeAuth();
  }, [initializeAuth]);

  // Pantalla de Carga / Splash mientras se valida la sesión en SecureStore
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="disc" size={64} color={COLORS.primary} />
        <Text style={styles.loadingTitle}>BEAT & LIGHT PRO</Text>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
        <Text style={styles.loadingSubtext}>Verificando credenciales cifradas...</Text>
      </View>
    );
  }

  // Navegación Condicional Trazable: AuthStack vs AppStack
  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 2,
    marginTop: 12,
  },
  spinner: {
    marginTop: 24,
  },
  loadingSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
});
