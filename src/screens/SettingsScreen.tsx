// ============================================================
// SCREEN: SettingsScreen — src/screens/SettingsScreen.tsx
// ============================================================
// Pantalla de Ajustes: Integra MMKV para preferencias en tiempo real
// y Expo SecureStore para el almacenamiento cifrado de datos sensibles.
// Dominio: Beat & Light Pro (DJ / Sonido y Luces).
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { usePreferences, SortOption } from '../hooks/usePreferences';
import {
  saveOperatorToken,
  getOperatorToken,
  deleteOperatorToken,
} from '../services/secureStoreService';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

export function SettingsScreen(): React.JSX.Element {
  const {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
  } = usePreferences();

  const [inputToken, setInputToken] = useState<string>('');
  const [hasTokenSaved, setHasTokenSaved] = useState<boolean>(false);
  const [tokenLength, setTokenLength] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Cargar estado inicial del token cifrado de SecureStore (sin exponer el valor plano)
  useEffect(() => {
    checkTokenStatus();
  }, []);

  const checkTokenStatus = async () => {
    try {
      const stored = await getOperatorToken();
      if (stored) {
        setHasTokenSaved(true);
        setTokenLength(stored.length);
      } else {
        setHasTokenSaved(false);
        setTokenLength(0);
      }
    } catch {
      setHasTokenSaved(false);
    }
  };

  const handleSaveToken = async () => {
    if (!inputToken.trim()) {
      Alert.alert('Atención', 'Por favor ingresa un código de acceso o token válido.');
      return;
    }

    try {
      await saveOperatorToken(inputToken.trim());
      setInputToken('');
      await checkTokenStatus();
      setStatusMessage('🔒 Token cifrado y guardado con éxito en SecureStore.');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      Alert.alert('Error', 'No se pudo guardar el token cifrado.');
    }
  };

  const handleReadTokenStatus = async () => {
    try {
      const stored = await getOperatorToken();
      if (stored) {
        Alert.alert(
          '🔒 Verificación de SecureStore',
          `El token está activo y almacenado de forma segura en el Keystore/Keychain. (${stored.length} caracteres).`
        );
      } else {
        Alert.alert('Información', 'No existe ningún token almacenado en SecureStore.');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo consultar el almacén seguro.');
    }
  };

  const handleDeleteToken = async () => {
    try {
      await deleteOperatorToken();
      await checkTokenStatus();
      setStatusMessage('🗑️ Token eliminado de SecureStore.');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      Alert.alert('Error', 'No se pudo eliminar el token.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTag}>CONFIGURACIÓN DE APP</Text>
          <Text style={styles.headerTitle}>Preferencias & Seguridad</Text>
          <Text style={styles.headerSubtitle}>Beat & Light Pro — Persistencia Local</Text>
        </View>

        {/* ============================================================ */}
        {/* SECCIÓN 1: MMKV PREFERENCIAS RE-RENDER EN TIEMPO REAL */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardIcon}>⚡</Text>
            <View>
              <Text style={styles.cardTitle}>Preferencias de Lista (MMKV)</Text>
              <Text style={styles.cardSubtitle}>Almacenamiento sincrónico e instantáneo</Text>
            </View>
          </View>

          {/* Orden de Lista */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Ordenar catálogo de equipos por:</Text>
            <View style={styles.optionRow}>
              {(['name', 'price', 'rating'] as SortOption[]).map((option) => {
                const labels: Record<SortOption, string> = {
                  name: '🔤 Nombre',
                  price: '💲 Precio',
                  rating: '⭐ Valoración',
                };
                const isSelected = sortOrder === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                    onPress={() => setSortOrder(option)}
                  >
                    <Text style={[styles.optionChipText, isSelected && styles.optionChipTextSelected]}>
                      {labels[option]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Modo Vista Compacta */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Modo Vista Compacta</Text>
              <Text style={styles.settingDescription}>
                Muestra la lista de equipos en formato reducido para escaneo rápido de inventario
              </Text>
            </View>
            <Switch
              value={compactMode}
              onValueChange={setCompactMode}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={compactMode ? COLORS.textInverse : '#8b949e'}
            />
          </View>

          {/* Ítems por página */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Ítems por página en catálogo:</Text>
            <View style={styles.stepperRow}>
              {[5, 10, 15, 20].map((num) => {
                const isSelected = itemsPerPage === num;
                return (
                  <TouchableOpacity
                    key={num}
                    style={[styles.stepperButton, isSelected && styles.stepperButtonSelected]}
                    onPress={() => setItemsPerPage(num)}
                  >
                    <Text style={[styles.stepperText, isSelected && styles.stepperTextSelected]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* SECCIÓN 2: EXPO SECURESTORE (DATOS SENSIBLES CIFRADOS) */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardIcon}>🛡️</Text>
            <View>
              <Text style={styles.cardTitle}>Seguridad (Expo SecureStore)</Text>
              <Text style={styles.cardSubtitle}>Cifrado en iOS Keychain / Android Keystore</Text>
            </View>
          </View>

          {/* Estado del token almacenado */}
          <View style={styles.tokenStatusBox}>
            <Text style={styles.tokenStatusTitle}>Estado del Token de Operador DJ:</Text>
            {hasTokenSaved ? (
              <View style={styles.tokenActiveBadge}>
                <Text style={styles.tokenActiveText}>
                  🔒 Cifrado activo •••••••••••• ({tokenLength} caracteres)
                </Text>
              </View>
            ) : (
              <View style={styles.tokenInactiveBadge}>
                <Text style={styles.tokenInactiveText}>⚠️ Ningún token configurado</Text>
              </View>
            )}
          </View>

          {/* Input para guardar dato sensible */}
          <Text style={styles.settingLabel}>Código de Acceso / Token de Operador:</Text>
          <TextInput
            style={styles.input}
            value={inputToken}
            onChangeText={setInputToken}
            placeholder="Ingrese PIN o Token de sesión..."
            placeholderTextColor={COLORS.inputPlaceholder}
            secureTextEntry
          />

          {/* Acciones para SecureStore */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveToken}>
              <Text style={styles.saveButtonText}>🔒 Guardar Token</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.readButton} onPress={handleReadTokenStatus}>
              <Text style={styles.readButtonText}>👁️ Consultar</Text>
            </TouchableOpacity>
          </View>

          {hasTokenSaved && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteToken}>
              <Text style={styles.deleteButtonText}>🗑️ Eliminar Token Cifrado</Text>
            </TouchableOpacity>
          )}

          {statusMessage !== '' && (
            <Text style={styles.statusToast}>{statusMessage}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerTag: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
  },

  // Groups and inputs
  settingGroup: {
    marginBottom: SPACING.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  optionChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionChipSelected: {
    backgroundColor: COLORS.primaryDim,
    borderColor: COLORS.primary,
  },
  optionChipText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  optionChipTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },

  // Stepper
  stepperRow: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
    gap: SPACING.sm,
  },
  stepperButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepperButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepperText: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
  stepperTextSelected: {
    color: COLORS.textInverse,
  },

  // SecureStore
  tokenStatusBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenStatusTitle: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  tokenActiveBadge: {
    backgroundColor: COLORS.successBg,
    padding: SPACING.xs + 2,
    borderRadius: 6,
  },
  tokenActiveText: {
    color: COLORS.success,
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  tokenInactiveBadge: {
    backgroundColor: COLORS.errorBg,
    padding: SPACING.xs + 2,
    borderRadius: 6,
  },
  tokenInactiveText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.textPrimary,
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.textInverse,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
  readButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: SPACING.md,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  readButtonText: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
  deleteButton: {
    backgroundColor: COLORS.errorBg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeSM,
  },
  statusToast: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});
