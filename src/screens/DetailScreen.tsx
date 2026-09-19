// ============================================================
// SCREEN: DetailScreen (src/screens/DetailScreen.tsx)
// ============================================================
// Pantalla de Detalle de Equipo (DJ / Sonido e Iluminación).
// Requisito Funcional 1: Animación de entrada con Animated.parallel
//   - opacity: 0 → 1
//   - translateY: 30 → 0
//   - Duración: 500ms
//   - useNativeDriver: true (ejecutado en el hilo nativo de UI)
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEquipmentById } from '../hooks/useEquipmentById';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';
import { HomeStackParamList } from '../navigation/types';
import { useSavedStore } from '../stores/savedStore';
import { AnimatedButton } from '../components/AnimatedButton';

type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;
type DetailNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeDetail'>;

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavigationProp>();

  const { id, name } = route.params;

  const { data: item, isLoading, isError, error } = useEquipmentById(id);

  const isSaved = useSavedStore((state) => state.savedItems.some((equip) => equip.id === id));
  const toggleSaveItem = useSavedStore((state) => state.toggleSaveItem);

  // ------------------------------------------------------------
  // Requisito Funcional 1: Animated.parallel (fade in + slide up 500ms)
  // ------------------------------------------------------------
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true, // ✅ Hilo nativo para opacidad
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true, // ✅ Hilo nativo para transform translateY
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando detalle del equipo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !item) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Equipo no encontrado</Text>
          <Text style={styles.errorSubtitle}>
            {error?.message ?? `No se encontraron datos para el equipo: "${name}".`}
          </Text>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver al catálogo</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isAvailable = item.availability === 'Disponible';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Wrapper Animado con Fade In + Slide Up */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Imagen del Equipo */}
          <View style={styles.imageContainer}>
            <Image
              source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : item.imageUri}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.imageOverlayBadge}>
              <Text style={styles.imageBadgeText}>{item.category}</Text>
            </View>
          </View>

          {/* Ficha Principal */}
          <View style={styles.contentContainer}>
            {/* Status y Rating */}
            <View style={styles.metaRow}>
              <View
                style={[styles.statusBadge, isAvailable ? styles.statusAvailable : styles.statusRented]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isAvailable ? styles.statusAvailableText : styles.statusRentedText,
                  ]}
                >
                  ● {item.availability}
                </Text>
              </View>
              {item.rating && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)} / 5.0</Text>
                </View>
              )}
            </View>

            {/* Nombre y Subtítulo */}
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>

            {/* Tarjeta de Precio */}
            <View style={styles.priceCard}>
              <View>
                <Text style={styles.priceCardLabel}>Tarifa de Alquiler</Text>
                <Text style={styles.priceCardValue}>
                  ${item.pricePerDay} USD <Text style={styles.priceUnit}>/ día</Text>
                </Text>
              </View>
              <View style={styles.priceTagBadge}>
                <Text style={styles.priceTagText}>Garantía Incluida</Text>
              </View>
            </View>

            {/* Especificaciones Técnicas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Especificaciones Técnicas</Text>
              <View style={styles.specGrid}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Categoría</Text>
                  <Text style={styles.specValue}>{item.category}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Identificador SKU</Text>
                  <Text style={styles.specValue}>SKU-{String(item.id).padStart(4, '0')}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Uso Recomendado</Text>
                  <Text style={styles.specValue}>Eventos, DJ & Producción</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Estado Inventario</Text>
                  <Text style={styles.specValue}>{item.availability}</Text>
                </View>
              </View>
            </View>

            {/* Información Adicional */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Incluye en la Reserva</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>✓ Cableado profesional DMX / XLR / PowerCON</Text>
                <Text style={styles.bulletItem}>✓ Case de transporte rígido anti-impactos</Text>
                <Text style={styles.bulletItem}>✓ Asistencia técnica y calibración inicial</Text>
                <Text style={styles.bulletItem}>✓ Limpieza y sanitización de componentes</Text>
              </View>
            </View>

            {/* Botón Animado para Editar Equipo */}
            <AnimatedButton
              title="✏️ Editar Especificaciones del Equipo"
              onPress={() => navigation.navigate('EditEquipment', { id: item.id })}
              variant="secondary"
              style={{ marginBottom: SPACING.md }}
            />

            {/* Botón Animado Zustand: Guardar / Quitar */}
            <AnimatedButton
              title={isSaved ? '❤️ En Mis Equipos (Quitar)' : '⭐ Guardar en Mis Equipos'}
              onPress={() => toggleSaveItem(item)}
              variant={isSaved ? 'danger' : 'accent'}
              style={{ marginBottom: SPACING.md }}
            />

            {/* Botón de Acción Principal */}
            <AnimatedButton
              title={isAvailable ? '⚡ Solicitar Reserva de Equipo' : '🔒 No Disponible Actualmente'}
              onPress={() => alert(`Reserva iniciada para: ${item.name}`)}
              variant="primary"
              disabled={!isAvailable}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  errorSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 10,
  },
  backButtonText: {
    color: COLORS.textInverse,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(13, 17, 23, 0.85)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  imageBadgeText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeSM,
  },
  contentContainer: {
    padding: SPACING.xl,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  statusAvailable: {
    backgroundColor: COLORS.successBg,
  },
  statusRented: {
    backgroundColor: COLORS.errorBg,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  statusAvailableText: {
    color: COLORS.success,
  },
  statusRentedText: {
    color: COLORS.error,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ratingStar: {
    color: COLORS.warning,
    fontSize: TYPOGRAPHY.fontSizeMD,
    marginRight: SPACING.xs,
  },
  ratingText: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    fontSize: TYPOGRAPHY.fontSizeSM,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  priceCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  priceCardLabel: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  priceCardValue: {
    fontSize: TYPOGRAPHY.fontSizeXXL - 2,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primary,
  },
  priceUnit: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeightRegular,
  },
  priceTagBadge: {
    backgroundColor: COLORS.primaryDim,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 8,
  },
  priceTagText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  specGrid: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceAlt,
  },
  specLabel: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
  },
  specValue: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.textPrimary,
  },
  bulletList: {
    gap: SPACING.sm,
  },
  bulletItem: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
