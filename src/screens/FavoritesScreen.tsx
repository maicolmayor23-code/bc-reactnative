// ============================================================
// SCREEN: FavoritesScreen
// ============================================================
// Segunda pestaña del Tab Navigator: Muestra la lista de equipos
// guardados / favoritos obtenida directamente del Store Zustand.
// Dominio: DJ / Sonido y luces (Beat & Light Pro).
// ============================================================

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Item } from '../types';
import { EquipmentCard } from '../components/EquipmentCard';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';
import { FavoritesScreenProps } from '../navigation/types';
import { useSavedStore } from '../stores/savedStore';

type FavoritesNavigationProp = FavoritesScreenProps['navigation'];

export function FavoritesScreen(): React.JSX.Element {
  const navigation = useNavigation<FavoritesNavigationProp>();

  // Selectores específicos de Zustand (evita re-renders innecesarios y sin prop-drilling)
  const favoriteItems = useSavedStore((state) => state.savedItems);
  const clearSaved = useSavedStore((state) => state.clearSaved);

  /**
   * Navegar al detalle del equipo desde favoritos hacia el Stack anidado en HomeTab.
   */
  const handleItemPress = useCallback(
    (item: Item): void => {
      navigation.navigate('HomeTab', {
        screen: 'HomeDetail',
        params: { id: item.id, name: item.name },
      });
    },
    [navigation]
  );

  /**
   * Renderizado de cada tarjeta en la lista.
   */
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <EquipmentCard item={item} onPress={handleItemPress} />,
    [handleItemPress]
  );

  /**
   * Extractor de key única.
   */
  const keyExtractor = useCallback((item: Item): string => item.id, []);

  /**
   * Separador entre tarjetas.
   */
  const renderItemSeparator = useCallback(
    (): React.JSX.Element => <View style={styles.separator} />,
    []
  );

  /**
   * Componente de Estado Vacío (Empty State) cuando no hay equipos guardados.
   */
  const renderEmptyState = useCallback(
    (): React.JSX.Element => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎧</Text>
        <Text style={styles.emptyTitle}>Sin equipos en tu lista</Text>
        <Text style={styles.emptySubtitle}>
          No has guardado ningún equipo de DJ, sonido o iluminación. Explora el catálogo en la pestaña Inicio y presiona "Guardar en Mis Equipos".
        </Text>
        <Pressable
          style={styles.exploreButton}
          onPress={() => navigation.navigate('HomeTab', { screen: 'HomeList' })}
        >
          <Text style={styles.exploreButtonText}>Explorar Catálogo</Text>
        </Pressable>
      </View>
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.mainContainer}>
        {/* Header de Favoritos */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTag}>LISTA DE PRODUCCIÓN</Text>
            <Text style={styles.headerTitle}>Equipos Guardados ★</Text>
            <Text style={styles.headerSubtitle}>
              Estado global sincrónico administrado con Zustand
            </Text>
          </View>
          <View style={styles.statsBadge}>
            <Text style={styles.statsCount}>{favoriteItems.length}</Text>
            <Text style={styles.statsLabel}>Guardados</Text>
          </View>
        </View>

        {/* Barra de Acciones del Store */}
        {favoriteItems.length > 0 && (
          <View style={styles.actionsBar}>
            <Text style={styles.actionsBarText}>
              {favoriteItems.length} {favoriteItems.length === 1 ? 'equipo seleccionado' : 'equipos seleccionados'}
            </Text>
            <Pressable style={styles.clearButton} onPress={clearSaved}>
              <Text style={styles.clearButtonText}>🗑️ Limpiar Todo</Text>
            </Pressable>
          </View>
        )}

        {/* Lista de Favoritos desde el Store Zustand */}
        <FlatList
          data={favoriteItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
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
    color: COLORS.accent,
    letterSpacing: 1.2,
    marginBottom: SPACING.xs - 2,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeSM + 1,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statsBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statsCount: {
    fontSize: TYPOGRAPHY.fontSizeXL - 2,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.accent,
  },
  statsLabel: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionsBarText: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  clearButton: {
    backgroundColor: 'rgba(218, 54, 51, 0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#da3633',
  },
  clearButtonText: {
    color: '#f85149',
    fontSize: TYPOGRAPHY.fontSizeXS + 1,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSizeXXL - 2,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: COLORS.textInverse,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
});
