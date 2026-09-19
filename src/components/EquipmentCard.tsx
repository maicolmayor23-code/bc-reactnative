// ============================================================
// COMPONENT: EquipmentCard (src/components/EquipmentCard.tsx)
// ============================================================
// Tarjeta reutilizable para mostrar un equipo del dominio DJ / Sonido y Luces.
// Requisito Funcional 2: Integra AnimatedCard / Animated.spring para feedback
// táctil natural con rebote (scale: 1 → 0.95 → 1).
// Integra el estado global de Zustand para guardar/quitar de favoritos.
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
import { AnimatedCard } from './AnimatedCard';

interface EquipmentCardProps {
  item: Equipment;
  onPress: (item: Equipment) => void;
  compactMode?: boolean;
}

export function EquipmentCard({ item, onPress, compactMode = false }: EquipmentCardProps): React.JSX.Element {
  const isAvailable = item.availability === 'Disponible';

  // Selectores específicos de Zustand para UI State (Favoritos)
  const isSaved = useSavedStore((state) =>
    state.savedItems.some((saved) => saved.id === item.id)
  );
  const toggleSaveItem = useSavedStore((state) => state.toggleSaveItem);

  if (compactMode) {
    return (
      <AnimatedCard onPress={() => onPress(item)} style={styles.compactCardContainer}>
        <View style={styles.compactRow}>
          <Image
            source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : item.imageUri}
            style={styles.compactImage}
            resizeMode="cover"
          />
          <View style={styles.compactContent}>
            <View style={styles.badgeRow}>
              <Text style={styles.compactCategory}>{item.category}</Text>
              <Text style={styles.priceValue}>${item.pricePerDay}/día</Text>
            </View>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <Pressable
            style={styles.compactHeartButton}
            onPress={() => toggleSaveItem(item)}
            hitSlop={8}
          >
            <Text style={{ fontSize: 16 }}>{isSaved ? '❤️' : '🤍'}</Text>
          </Pressable>
        </View>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard onPress={() => onPress(item)} style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : item.imageUri}
          style={styles.cardImage}
          resizeMode="cover"
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
    </AnimatedCard>
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
  // Estilos Modo Compacto
  compactCardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  compactContent: {
    flex: 1,
    justifyContent: 'center',
  },
  compactCategory: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  compactTitle: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  compactHeartButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
});
