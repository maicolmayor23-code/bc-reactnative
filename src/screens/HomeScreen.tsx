// ============================================================
// SCREEN: HomeScreen
// ============================================================
// Pantalla principal: Header con título del dominio, búsqueda con
// TextInput, filtrado dinámico con useMemo y virtualización con FlatList.
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
  ListRenderItem,
} from 'react-native';
import { Item } from '../types';
import { ItemCard } from '../components/ItemCard';
import { MOCK_ITEMS } from '../data/mockData';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const DOMAIN_TITLE = 'Beat & Light Pro';
  const DOMAIN_SUBTITLE = 'Catálogo de Equipos de DJ, Sonido e Iluminación';

  const [searchQuery, setSearchQuery] = useState<string>('');

  /**
   * Filtrado dinámico optimizado con useMemo.
   * Filtra los elementos según coincidencia en nombre, categoría o subtítulo.
   */
  const filteredItems = useMemo<Item[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return MOCK_ITEMS;
    }
    return MOCK_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  /**
   * Manejador de selección de un equipo -> Navega a HomeDetail pasando id y name.
   */
  const handleItemPress = useCallback(
    (item: Item): void => {
      navigation.navigate('HomeDetail', { id: item.id, name: item.name });
    },
    [navigation]
  );

  /**
   * Callback para renderizar cada tarjeta en la FlatList.
   */
  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <ItemCard item={item} onPress={handleItemPress} />,
    [handleItemPress]
  );

  /**
   * Callback para extraer la key única del item (ID).
   */
  const keyExtractor = useCallback((item: Item): string => item.id, []);

  /**
   * Componente separador visual entre elementos de la lista.
   */
  const renderItemSeparator = useCallback(
    (): React.JSX.Element => <View style={styles.separator} />,
    []
  );

  /**
   * Componente de Estado Vacío (Empty State) cuando la búsqueda no produce resultados.
   */
  const renderListEmpty = useCallback(
    (): React.JSX.Element => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>Sin resultados encontrados</Text>
        <Text style={styles.emptySubtitle}>
          No encontramos ningún equipo que coincida con "{searchQuery}". Prueba buscando con otro término o categoría.
        </Text>
        <Pressable style={styles.clearSearchButton} onPress={() => setSearchQuery('')}>
          <Text style={styles.clearSearchText}>Limpiar búsqueda</Text>
        </Pressable>
      </View>
    ),
    [searchQuery]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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

              <View style={styles.statsBadge}>
                <Text style={styles.statsCount}>{filteredItems.length}</Text>
                <Text style={styles.statsLabel}>Equipos</Text>
              </View>
            </View>

            {/* Barra de Búsqueda con TextInput */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Text style={styles.searchIcon}>🔎</Text>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar por nombre, categoría..."
                  placeholderTextColor={COLORS.inputPlaceholder}
                  keyboardType="default"
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                  clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery('')} style={styles.clearIconContainer}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Lista Virtualizada con FlatList */}
            <FlatList
              data={filteredItems}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ItemSeparatorComponent={renderItemSeparator}
              ListEmptyComponent={renderListEmpty}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
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

  // Header
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
    color: COLORS.primary,
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
    color: COLORS.primary,
  },
  statsLabel: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
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

  // Lista y Separador
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
  clearSearchButton: {
    backgroundColor: COLORS.primaryDim,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  clearSearchText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
});
