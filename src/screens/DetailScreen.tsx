// ============================================================
// SCREEN: DetailScreen
// ============================================================
// Pantalla de Detalle de Equipo (DJ / Sonido e Iluminación).
// Lee los parámetros recibidos del Stack Navigator (id y name)
// y muestra la ficha técnica completa con opciones de reserva.
// ============================================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MOCK_ITEMS } from '../data/mockData';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';
import { HomeStackParamList } from '../navigation/types';
import { useSavedStore } from '../stores/savedStore';

type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;
type DetailNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeDetail'>;

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavigationProp>();

  // Extracción de parámetros enviados desde el Stack
  const { id, name } = route.params;

  // Selectores específicos de Zustand para evitar re-renders innecesarios
  const isSaved = useSavedStore((state) => state.savedItems.some((equip) => equip.id === id));
  const toggleSaveItem = useSavedStore((state) => state.toggleSaveItem);

  // Buscar item en MOCK_ITEMS por id
  const item = useMemo(() => {
    return MOCK_ITEMS.find((equip) => equip.id === id);
  }, [id]);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Equipo no encontrado</Text>
          <Text style={styles.errorSubtitle}>
            No se encontraron datos para el equipo con ID: "{id}" ({name}).
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
        {/* Imagen del Equipo */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
          <View style={styles.imageOverlayBadge}>
            <Text style={styles.imageBadgeText}>{item.category}</Text>
          </View>
        </View>

        {/* Ficha Principal */}
        <View style={styles.contentContainer}>
          {/* Status y Rating */}
          <View style={styles.metaRow}>
            <View style={[styles.statusBadge, isAvailable ? styles.statusAvailable : styles.statusRented]}>
              <Text style={[styles.statusText, isAvailable ? styles.statusAvailableText : styles.statusRentedText]}>
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
              <Text style={styles.priceCardValue}>${item.pricePerDay} USD <Text style={styles.priceUnit}>/ día</Text></Text>
            </View>
            <View style={styles.priceTagBadge}>
              <Text style={styles.priceTagText}>Garantía Incluida</Text>
            </View>
          </View>

          {/* Sección de Especificaciones Técnicas del Dominio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Especificaciones Técnicas</Text>
            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Categoría</Text>
                <Text style={styles.specValue}>{item.category}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Identificador</Text>
                <Text style={styles.specValue}>SKU-{item.id.padStart(4, '0')}</Text>
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

          {/* Botón interactivo del Store Zustand: Guardar / Quitar */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              isSaved ? styles.saveButtonActive : styles.saveButtonInactive,
              pressed && styles.reserveButtonPressed,
            ]}
            onPress={() => toggleSaveItem(item)}
          >
            <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextActive]}>
              {isSaved ? '❤️ En Mis Equipos (Quitar)' : '⭐ Guardar en Mis Equipos'}
            </Text>
          </Pressable>

          {/* Botón de Acción Principal */}
          <Pressable
            style={({ pressed }) => [
              styles.reserveButton,
              !isAvailable && styles.reserveButtonDisabled,
              pressed && styles.reserveButtonPressed,
            ]}
            disabled={!isAvailable}
            onPress={() => alert(`Reserva iniciada para: ${item.name}`)}
          >
            <Text style={styles.reserveButtonText}>
              {isAvailable ? '⚡ Solicitar Reserva de Equipo' : '🔒 No Disponible Actualmente'}
            </Text>
          </Pressable>
        </View>
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

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
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

  // Imagen
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

  // Contenido Ficha
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

  // Tarjeta Precio
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

  // Secciones
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

  // Lista
  bulletList: {
    gap: SPACING.sm,
  },
  bulletItem: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Botón Reserva y Guardar Zustand
  saveButton: {
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  saveButtonInactive: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.primary,
  },
  saveButtonActive: {
    backgroundColor: '#da3633',
    borderColor: '#f85149',
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSizeMD + 1,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  saveButtonTextActive: {
    color: '#ffffff',
  },

  reserveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  reserveButtonDisabled: {
    backgroundColor: COLORS.surfaceAlt,
  },
  reserveButtonPressed: {
    opacity: 0.85,
  },
  reserveButtonText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
