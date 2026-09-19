// ============================================================
// COMPONENT: ProgressBar (src/components/ProgressBar.tsx)
// ============================================================
// Requisito Funcional 3: Barra de progreso animada para el dominio DJ / Sonido y Luces.
// Muestra el porcentaje de capacidad, inventario o potencia del equipo.
// Utiliza interpolate para animar:
//   - Ancho (width): '0%' → '100%'
//   - Color (backgroundColor): '#ef4444' (Rojo) → '#facc15' (Amarillo) → '#22c55e' (Verde)
// Nota: usa useNativeDriver: false porque width y backgroundColor son de layout/color.
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

interface ProgressBarProps {
  /** Valor numérico entre 0 y 100 */
  progress: number;
  /** Duración de la animación en ms (default: 800) */
  duration?: number;
  /** Etiqueta descriptiva (opcional) */
  label?: string;
  /** Muestra u oculta el porcentaje impreso en texto */
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  duration = 800,
  label,
  showPercentage = true,
}: ProgressBarProps): React.JSX.Element {
  // Clampeamos el valor entre 0 y 100
  const normalizedValue = Math.min(Math.max(progress, 0), 100);

  // Valor animado entre 0 y 1
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: normalizedValue / 100,
      duration,
      useNativeDriver: false, // width y backgroundColor no soportan native driver
    }).start();
  }, [normalizedValue, duration, animValue]);

  // Interpolación de Ancho: 0% → 100%
  const widthInterpolated = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  // Interpolación de Color: Rojo → Amarillo → Verde (Nivel de Potencia / Stock)
  const colorInterpolated = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#ef4444', '#facc15', '#22c55e'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.headerRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showPercentage && (
            <Text style={styles.percentageText}>{Math.round(normalizedValue)}%</Text>
          )}
        </View>
      )}

      {/* Riel de la Barra */}
      <View style={styles.track}>
        {/* Relleno Animado */}
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolated,
              backgroundColor: colorInterpolated,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.textSecondary,
  },
  percentageText: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primary,
  },
  track: {
    height: 12,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
});
