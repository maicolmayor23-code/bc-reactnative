// ============================================================
// COMPONENT: AnimatedCard (src/components/AnimatedCard.tsx)
// ============================================================
// Requisito Funcional 2: Feedback táctil en AnimatedCard.
// Cada card se comprime al ser presionada usando Animated.spring para un efecto natural con rebote.
// scale: 1 → 0.95 (onPressIn)
// scale: 0.95 → 1 (onPressOut, con rebote)
// Usa useNativeDriver: true para un rendimiento óptimo a 60 FPS en el hilo nativo.
// ============================================================

import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function AnimatedCard({
  children,
  onPress,
  style,
  disabled = false,
}: AnimatedCardProps): React.JSX.Element {
  // Animated.Value para la escala, inicializado en 1
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Al presionar la tarjeta (onPressIn): comprimir a 0.95
  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 300,
      friction: 12,
      useNativeDriver: true, // ✅ Hilo nativo para transform
    }).start();
  };

  // Al soltar la tarjeta (onPressOut): regresar a 1 con rebote natural
  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 200,
      friction: 8, // Menor fricción = rebote sutil y natural
      useNativeDriver: true, // ✅ Hilo nativo para transform
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.cardContainer,
          style,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    // Permite aplicar estilos de contenedor recibidos
  },
});
