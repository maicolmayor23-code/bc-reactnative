// ============================================================
// SCREEN: HomeScreen
// ============================================================
// Pantalla principal: Consume el Server State vía useEquipments (useQuery).
// Incluye estados de Loading (ActivityIndicator), Error (Mensaje + Reintentar),
// Vacío (ListEmptyComponent) y Pull-to-refresh (onRefresh + isFetching).
// ============================================================

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { Item } from '../types';
import { EquipmentCard } from '../components/EquipmentCard';
import { useEquipments } from '../hooks/useEquipments';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const DOMAIN_TITLE = 'Beat & Light Pro';
  const DOMAIN_SUBTITLE = 'Catálogo de Equipos de DJ, Sonido e Iluminación';

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Consumo del Server State desde TanStack Query v5
  const { data: equipments, isLoading, isError, error, isFetching, refetch } = useEquipments();

  /**
   * Filtrado dinámico optimizado con useMemo.
   */
  const filteredItems = useMemo<Item[]>(() => {
    const list = equipments ?? [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;

    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
    );
  }, [equipments, searchQuery]);

  /**
   * Navegación al detalle del equipo.
   */
  const handleItemPress = useCallback(
    (item: Item): void => {
      navigation.navigate('HomeDetail', { id: item.id, name: item.name });
    },
    [navigation]
  );

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <EquipmentCard item={item} onPress={handleItemPress} />,
    [handleItemPress]
  );

  const keyExtractor = useCallback((item: Item): string => item.id, []);

  const renderItemSeparator = useCallback(
    (): React.JSX.Element => <View style={styles.separator} />,
    []
  );

  /**
   * Componente de Estado Vacío (ListEmptyComponent)
   */
  const renderListEmpty = useCallback(
    (): React.JSX.Element => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎧</Text>
        <Text style={styles.emptyTitle}>No hay equipos registrados</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? `No encontramos ningún equipo que coincida con "${searchQuery}".`
            : 'No hay equipos disponibles en el inventario. ¡Puedes registrar el primero!'}
        </Text>
        {searchQuery ? (
          <Pressable style={styles.actionButton} onPress={() => setSearchQuery('')}>
            <Text style={styles.actionButtonText}>Limpiar búsqueda</Text>
          </Pressable>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('CreateEquipment')}
          >
            <Text style={styles.actionButtonText}>➕ Registrar Nuevo Equipo</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [searchQuery, navigation]
  );

  // 1. Estado de Carga Inicial (Loading State)
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando catálogo de equipos...</Text>
          <Text style={styles.loadingSubtext}>Conectando a la API en tiempo real</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Estado de Error (Error State)
  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Error al cargar los equipos</Text>
          <Text style={styles.errorSubtitle}>
            {error?.message ?? 'No pudimos establecer comunicación con el servidor de la API.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>🔄 Reintentar conexión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 3. Renderizado Principal (Lista de Equipos con Pull-to-Refresh)
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.mainContainer}>
            {/* Header de la App */}
            <View style={styles.header}>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTag}>EVENT & STAGE GEAR</Text>
                <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
                <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('CreateEquipment')}
              >
                <Text style={styles.addButtonText}>➕ Crear</Text>
              </TouchableOpacity>
            </View>

            {/* Barra de Búsqueda */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Text style={styles.searchIcon}>🔎</Text>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar por nombre, categoría..."
                  placeholderTextColor={COLORS.inputPlaceholder}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery('')} style={styles.clearIconContainer}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Lista con FlatList, Pull-to-Refresh y ListEmptyComponent */}
            <FlatList
              data={filteredItems}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ItemSeparatorComponent={renderItemSeparator}
              ListEmptyComponent={renderListEmpty}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onRefresh={refetch}
              refreshing={isFetching}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
  },
  loadingSubtext: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
  },
  errorIcon: {
    fontSize: 54,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.fontSizeXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.error,
    marginBottom: SPACING.xs,
  },
  errorSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 10,
  },
  retryButtonText: {
    color: COLORS.textInverse,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceAlt,
    backgroundColor: COLORS.surface,
  },
  headerTitleContainer: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  headerTag: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSizeXXL - 2,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },

  // Búsqueda
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
  clearIconContainer: {
    padding: SPACING.xs,
  },
  clearIcon: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Lista
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.lg,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSizeXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  actionButton: {
    backgroundColor: COLORS.primaryDim,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
});
