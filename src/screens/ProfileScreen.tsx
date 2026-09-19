// ============================================================
// SCREEN: ProfileScreen — src/screens/ProfileScreen.tsx
// ============================================================
// Vista de perfil del operador autenticado con datos del usuario y
// métricas del dominio Beat & Light Pro (equipos a cargo, licencia de alquiler, etc.).
// Incluye botón prominente de Cierre de Sesión (Logout).
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';
import { COLORS } from '../theme';

export function ProfileScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir del sistema Beat & Light Pro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Tarjeta de Encabezado / Avatar */}
      <View style={styles.profileHeaderCard}>
        {user?.image ? (
          <Image source={{ uri: user.image }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color={COLORS.primary} />
          </View>
        )}

        <Text style={styles.userName}>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username ?? 'Operador Beat & Light'}
        </Text>
        
        <View style={styles.roleBadge}>
          <Ionicons name="hardware-chip-outline" size={14} color="#000" />
          <Text style={styles.roleBadgeText}>
            {user?.role ?? 'Operador DJ'}
          </Text>
        </View>

        <Text style={styles.userEmail}>{user?.email ?? 'sin-correo@beatlight.pro'}</Text>
      </View>

      {/* Información del Dominio Beat & Light Pro */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Métricas & Licencia de Dominio</Text>

        <View style={styles.metricRow}>
          <View style={styles.metricIconBox}>
            <Ionicons name="disc" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricLabel}>Equipos Asignados a Cargo</Text>
            <Text style={styles.metricValue}>
              {user?.assignedEquipmentsCount ?? 8} Kits (CDJ 3000, Line Array, DMX)
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricIconBox}>
            <Ionicons name="ribbon" size={22} color="#61DAFB" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricLabel}>Licencia de Operación Activa</Text>
            <Text style={styles.metricValue}>
              {user?.activeRentalLicense ?? 'BLP-PRO-2026-N9'}
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricIconBox}>
            <Ionicons name="shield-checkmark" size={22} color="#4CAF50" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricLabel}>Estado de Autenticación Cifrada</Text>
            <Text style={styles.metricValue}>
              SecureStore (Keychain/Keystore Activo)
            </Text>
          </View>
        </View>
      </View>

      {/* Botón Prominente de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color="#FFF" />
        <Text style={styles.logoutButtonText}>Cerrar Sesión del Sistema</Text>
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
    paddingTop: 30,
  },
  profileHeaderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
    gap: 4,
  },
  roleBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  logoutButton: {
    height: 50,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
