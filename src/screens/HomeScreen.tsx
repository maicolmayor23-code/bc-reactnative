// ============================================================
// SCREEN: HomeScreen (src/screens/HomeScreen.tsx)
// ============================================================
// Pantalla principal: Integra las animaciones exigidas en la Semana 09:
//   1. Entrada en cascada con Animated.stagger(80, [...]) al cargar la lista.
//   2. LayoutAnimation al agregar o eliminar items de equipos.
//   3. Habilitación de Android con UIManager fuera del componente.
//   4. Barra de progreso animada (ProgressBar) con el stock/disponibilidad del dominio.
// ============================================================

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  LayoutAnimation,
  UIManager,
  Animated,
} from 'react-native';
import { Item } from '../types';
import { EquipmentCard } from '../components/EquipmentCard';
import { ProgressBar } from '../components/ProgressBar';
import { useEquipments } from '../hooks/useEquipments';
import { usePreferences } from '../hooks/usePreferences';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

// ⚠️ Habilitación obligatoria de LayoutAnimation en Android (fuera del componente)
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const DOMAIN_TITLE = 'Beat & Light Pro';
  const DOMAIN_SUBTITLE = 'Catálogo de Equipos de DJ, Sonido e Iluminación';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [localItems, setLocalItems] = useState<Item[]>([]);

  // Consumo de MMKV Preferences
  const { sortOrder, compactMode, itemsPerPage } = usePreferences();

  // Consumo de Server State
  const { data: equipments, isLoading, isError, isOffline, isFromCache, error, isFetching, refetch } = useEquipments();

  // Actualizar items locales cuando la query responde
  useEffect(() => {
    if (equipments) {
      setLocalItems(equipments);
    }
  }, [equipments]);

  /**
   * Filtrado, ordenamiento MMKV y paginación.
   */
  const filteredItems = useMemo<Item[]>(() => {
    let list = [...localItems];
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query)
      );
    }

    if (sortOrder === 'price') {
      list.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortOrder === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (itemsPerPage && itemsPerPage > 0) {
      list = list.slice(0, itemsPerPage);
    }

    return list;
  }, [localItems, searchQuery, sortOrder, itemsPerPage]);

  // 计算 % de Disponibilidad del inventario para la ProgressBar
  const availabilityPercentage = useMemo(() => {
    if (!localItems.length) return 0;
    const availableCount = localItems.filter((eq) => eq.availability === 'Disponible').length;
    return Math.round((availableCount / localItems.length) * 100);
  }, [localItems]);

  // ------------------------------------------------------------
  // Requisito Funcional 4: Entrada en Cascada con Animated.stagger(80, [...])
  // ------------------------------------------------------------
  const itemAnimations = useRef<Animated.Value[]>([]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      // Recrear valores animados para la cantidad de elementos filtrados
      itemAnimations.current = filteredItems.map(() => new Animated.Value(0));

      Animated.stagger(
        80, // 80ms de desfase en cascada
        itemAnimations.current.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true, // ✅ Hilo nativo para opacity y translateY
          })
        )
      ).start();
    }
  }, [filteredItems.length]);

  // ------------------------------------------------------------
  // Requisito Funcional 5: LayoutAnimation al Eliminar un Item de la Lista
  // ------------------------------------------------------------
  const handleRemoveItem = useCallback((id: string) => {
    // Animar la transición del layout antes de actualizar el estado
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLocalItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ------------------------------------------------------------
  // Requisito Funcional 5: LayoutAnimation al Agregar un Item Simulado
  // ------------------------------------------------------------
  const handleAddQuickItem = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const newId = String(Date.now());
    const newItem: Item = {
      id: newId,
      name: `Consola DMX ${newId.slice(-4)}`,
      category: 'Iluminación',
      subtitle: 'Controlador de Luces Neón 512 Canales',
      pricePerDay: 180,
      availability: 'Disponible',
      imageUri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80',
      rating: 4.9,
    };
    setLocalItems((prev) => [newItem, ...prev]);
  }, []);

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
    ({ item, index }) => {
      const animValue = itemAnimations.current[index] || new Animated.Value(1);

      const translateY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0],
      });

      return (
        <Animated.View
          style={{
            opacity: animValue,
            transform: [{ translateY }],
          }}
        >
          <View style={styles.cardItemWrapper}>
            <EquipmentCard item={item} onPress={handleItemPress} compactMode={compactMode} />
            <TouchableOpacity
              style={styles.deleteBadge}
              onPress={() => handleRemoveItem(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteBadgeText}>✕ Eliminar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    },
    [handleItemPress, compactMode, handleRemoveItem]
  );

  const keyExtractor = useCallback((item: Item): string => item.id, []);

  const renderItemSeparator = useCallback(
    (): React.JSX.Element => <View style={styles.separator} />,
    []
  );

  const renderListEmpty = useCallback(
    (): React.JSX.Element => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎧</Text>
        <Text style={styles.emptyTitle}>No hay equipos registrados</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? `No encontramos ningún equipo que coincida con "${searchQuery}".`
            : 'No hay equipos disponibles en el inventario. ¡Puedes agregar el primero!'}
        </Text>
        {searchQuery ? (
          <Pressable style={styles.actionButton} onPress={() => setSearchQuery('')}>
            <Text style={styles.actionButtonText}>Limpiar búsqueda</Text>
          </Pressable>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={handleAddQuickItem}>
            <Text style={styles.actionButtonText}>➕ Simular Agregar Equipo</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [searchQuery, handleAddQuickItem]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando catálogo de equipos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Error al cargar los equipos</Text>
          <Text style={styles.errorSubtitle}>
            {error?.message ?? 'No pudimos establecer comunicación con el servidor.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>🔄 Reintentar conexión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

              {/* Botón con LayoutAnimation para agregar item rápido */}
              <TouchableOpacity style={styles.addButton} onPress={handleAddQuickItem}>
                <Text style={styles.addButtonText}>➕ Agregar</Text>
              </TouchableOpacity>
            </View>

            {/* Requisito Funcional 3: Barra de Progreso animada en la Cabecera */}
            <View style={styles.progressSection}>
              <ProgressBar
                progress={availabilityPercentage}
                label="Stock de Equipos Disponibles en Inventario"
                showPercentage
              />
            </View>

            {/* Barra de Búsqueda */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Text style={styles.searchIcon}>🔎</Text>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar equipo o categoría..."
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

            {/* Banner de Estado Offline */}
            {(isOffline || isFromCache) && (
              <View style={styles.offlineBanner}>
                <Text style={styles.offlineBannerText}>
                  ⚠️ Mostrando datos sin red (Caché local)
                </Text>
              </View>
            )}

            {/* Lista principal con Stagger y LayoutAnimation */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
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
  progressSection: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceAlt,
  },
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
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.lg,
  },
  cardItemWrapper: {
    position: 'relative',
  },
  deleteBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(218, 54, 51, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  deleteBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
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
  offlineBanner: {
    backgroundColor: '#d97706',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineBannerText: {
    color: '#ffffff',
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
