// ============================================================
// SCREEN: Ejercicio02Screen — src/screens/Ejercicio02Screen.tsx
// ============================================================
// Demostración interactiva de OAuth 2.0 PKCE con Expo AuthSession (Ejercicio 02).
// Demuestra makeRedirectUri ({ scheme: "beatlightpro" }), useAuthRequest con usePKCE: true,
// y manejo explícito de respuestas (success, cancel, error).
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

// Necesario en web para cerrar la ventana emergente de autenticación al volver
WebBrowser.maybeCompleteAuthSession();

// Endpoint Discovery de GitHub OAuth
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications',
};

export function Ejercicio02Screen(): React.JSX.Element {
  const [authStatusMessage, setAuthStatusMessage] = useState<string>('Esperando acción del usuario');
  const [authStatusType, setAuthStatusType] = useState<'idle' | 'success' | 'cancel' | 'error'>('idle');

  // Configuración de URI de redirección sincronizada con app.json
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'beatlightpro',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'dummy_github_client_id_beatlightpro',
      scopes: ['read:user', 'user:email'],
      redirectUri,
      usePKCE: true, // Activación explícita de PKCE (Proof Key for Code Exchange)
    },
    discovery
  );

  // Manejo explícito de los tres casos de respuesta PKCE exigidos por la rúbrica
  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const { code } = response.params;
      setAuthStatusType('success');
      setAuthStatusMessage(`Autenticación OAuth completada exitosamente. Code recibido (intercambiable por backend).`);
      Alert.alert('Éxito OAuth', 'Autenticación OAuth PKCE completada exitosamente.');
    } else if (response.type === 'cancel' || response.type === 'dismiss') {
      setAuthStatusType('cancel');
      setAuthStatusMessage('Inicio de sesión cancelado por el usuario.');
      Alert.alert('Cancelado', 'Inicio de sesión cancelado.');
    } else if (response.type === 'error') {
      setAuthStatusType('error');
      setAuthStatusMessage(`Error durante la autenticación OAuth: ${response.error?.message || 'Error de proveedor'}`);
      Alert.alert('Error OAuth', 'Error durante la autenticación OAuth.');
    }
  }, [response]);

  const handleStartOAuth = async () => {
    if (!request) {
      Alert.alert('Cargando', 'Preparando solicitud PKCE...');
      return;
    }
    setAuthStatusType('idle');
    setAuthStatusMessage('Abriendo navegador para autenticación PKCE...');
    await promptAsync();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Ionicons name="logo-github" size={40} color={COLORS.primary} />
        <Text style={styles.title}>Ejercicio 02: OAuth 2.0 PKCE</Text>
        <Text style={styles.subtitle}>Expo AuthSession + PKCE Flow</Text>
      </View>

      {/* Tarjeta de Configuración PKCE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Configuración PKCE & Redirect URI</Text>
        <Text style={styles.infoText}>📱 Scheme configurado: <Text style={styles.bold}>beatlightpro</Text></Text>
        <Text style={styles.infoText}>🔗 Redirect URI: <Text style={styles.codeText}>{redirectUri}</Text></Text>
        <Text style={styles.infoText}>🔐 PKCE Activado: <Text style={styles.bold}>usePKCE: true</Text></Text>
        <Text style={styles.infoText}>🛡️ Scopes: <Text style={styles.bold}>read:user, user:email</Text></Text>
      </View>

      {/* Botón de inicio de flujo OAuth */}
      <TouchableOpacity
        style={[styles.button, !request ? styles.disabledButton : null]}
        onPress={handleStartOAuth}
        disabled={!request}
      >
        {!request ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión con OAuth PKCE</Text>
        )}
      </TouchableOpacity>

      {/* Tarjeta de Feedback de Respuesta (success, cancel, error) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Manejo de Respuestas PKCE</Text>
        
        <View style={styles.statusBox}>
          <Ionicons
            name={
              authStatusType === 'success'
                ? 'checkmark-circle'
                : authStatusType === 'cancel'
                ? 'warning'
                : authStatusType === 'error'
                ? 'alert-circle'
                : 'information-circle-outline'
            }
            size={24}
            color={
              authStatusType === 'success'
                ? '#4CAF50'
                : authStatusType === 'cancel'
                ? '#FFB300'
                : authStatusType === 'error'
                ? '#FF5252'
                : COLORS.textSecondary
            }
          />
          <Text style={styles.statusMessage}>{authStatusMessage}</Text>
        </View>
      </View>
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
  infoText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#61DAFB',
  },
  codeText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#FFB300',
  },
  button: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
  },
  statusMessage: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
});
