// ============================================================
// SCREEN: FavoritesScreen
// ============================================================
// Segunda pestaña del Tab Navigator: Muestra la lista de equipos
// favoritos / destacados del catálogo de DJ / Sonido y Luces.
// ============================================================

import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Item } from '../types';
import { ItemCard } from '../components/ItemCard';
import { MOCK_ITEMS } from '../data/mockData';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';
import { HomeStackParamList } from '../navigation/types';

type FavoritesNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export function FavoritesScreen(): React.JSX.Element {
  const navigation = useNavigation<FavoritesNavigationProp>();

  /**
   * Filtrar ítems favoritos con rating >= 4.9 (al menos 3 equipos destacados).
   */
  const favoriteItems = useMemo<Item[]>(() => {
    return MOCK_ITEMS.filter((item) => item.rating && item.rating >= 4.9);
  }, []);

  /**
   * Navegar al detalle del equipo desde favoritos.
   */
  const handleItemPress = useCallback((item: Item): void => {
    navigation.navigate('HomeDetail', { id: item.id, name: item.name });
  }, [navigation]);

  /**
   * Renderizado de cada tarjeta en la lista.
   */
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <ItemCard item={item} onPress={handleItemPress} />,
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.mainContainer}>
        {/* Header de Favoritos */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTag}>EQUIPOS DESTACADOS</Text>
            <Text style={styles.headerTitle}>Favoritos ★</Text>
            <Text style={styles.headerSubtitle}>Los equipos mejor valorados para tu evento</Text>
          </View>
          <View style={styles.statsBadge}>
            <Text style={styles.statsCount}>{favoriteItems.length}</Text>
            <Text style={styles.statsLabel}>Guardados</Text>
          </View>
        </View>

        {/* Lista de Favoritos */}
        <FlatList
          data={favoriteItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
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
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  separator: {
    height: SPACING.lg,
  },
});
