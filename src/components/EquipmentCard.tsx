// ============================================================
// COMPONENT: EquipmentCard (src/components/EquipmentCard.tsx)
// ============================================================
// Tarjeta reutilizable para mostrar un equipo del dominio DJ / Sonido y Luces.
// Integra el estado global de Zustand para guardar/quitar de favoritos.
// Utiliza las constantes del sistema de theming (COLORS, TYPOGRAPHY, SPACING).
// ============================================================

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Equipment } from '../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';
import { useSavedStore } from '../stores/savedStore';

interface EquipmentCardProps {
  item: Equipment;
  onPress: (item: Equipment) => void;
}

export function EquipmentCard({ item, onPress }: EquipmentCardProps): React.JSX.Element {
  const isAvailable = item.availability === 'Disponible';

  // Selectores específicos de Zustand para UI State (Favoritos)
  const isSaved = useSavedStore((state) =>
    state.savedItems.some((saved) => saved.id === item.id)
  );
  const toggleSaveItem = useSavedStore((state) => state.toggleSaveItem);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(item)}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : item.imageUri}
          style={styles.cardImage}
          resizeMode="contain"
        />
        {/* Botón rápido de favorito/guardado con el store Zustand */}
        <Pressable
          style={({ pressed }) => [
            styles.heartButton,
            isSaved && styles.heartButtonSaved,
            pressed && styles.heartButtonPressed,
          ]}
          onPress={() => toggleSaveItem(item)}
          hitSlop={8}
        >
          <Text style={styles.heartIcon}>{isSaved ? '❤️' : '🤍'}</Text>
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        {/* Fila de Badges de Categoría y Disponibilidad */}
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={[styles.statusBadge, isAvailable ? styles.statusAvailable : styles.statusRented]}>
            <Text style={[styles.statusText, isAvailable ? styles.statusAvailableText : styles.statusRentedText]}>
              {item.availability}
            </Text>
          </View>
        </View>

        {/* Título y Subtítulo */}
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>
          {item.subtitle}
        </Text>

        {/* Fila de Precio y Acción */}
        <View style={styles.cardFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio por día:</Text>
            <Text style={styles.priceValue}>${item.pricePerDay} USD</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Ver Ficha</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// Exportaciones nombradas y por defecto para compatibilidad total de IDE
export const ItemCard = EquipmentCard;
export default EquipmentCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: {
    opacity: 0.9,
    borderColor: COLORS.primary,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(13, 17, 23, 0.75)',
    borderRadius: 20,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heartButtonSaved: {
    backgroundColor: 'rgba(218, 54, 51, 0.85)',
    borderColor: '#f85149',
  },
  heartButtonPressed: {
    transform: [{ scale: 0.9 }],
  },
  heartIcon: {
    fontSize: 18,
  },
  cardBody: {
    padding: SPACING.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryDim,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm + 2,
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
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  statusAvailableText: {
    color: COLORS.success,
  },
  statusRentedText: {
    color: COLORS.error,
  },
  cardName: {
    fontSize: TYPOGRAPHY.fontSizeXL - 1,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceAlt,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: TYPOGRAPHY.fontSizeLG + 1,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primary,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  actionButtonText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSizeSM + 1,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
