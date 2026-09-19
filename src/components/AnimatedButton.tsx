// ============================================================
// COMPONENT: AnimatedButton (src/components/AnimatedButton.tsx)
// ============================================================
// Botón interactivo reutilizable con micro-animaciones en tap.
// Combina Animated.timing y Animated.spring para feedback visual táctil.
// Usa useNativeDriver: true para opacity y scale.
// ============================================================

import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'accent';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  icon?: string;
}

export function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
  icon,
}: AnimatedButtonProps): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.94,
        tension: 300,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 250,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.surfaceAlt,
          borderColor: COLORS.border,
          textColor: COLORS.textPrimary,
        };
      case 'danger':
        return {
          backgroundColor: '#da3633',
          borderColor: '#f85149',
          textColor: '#ffffff',
        };
      case 'accent':
        return {
          backgroundColor: COLORS.accent,
          borderColor: COLORS.accent,
          textColor: '#ffffff',
        };
      case 'primary':
      default:
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
          textColor: COLORS.textInverse,
        };
    }
  };

  const variantStyle = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: variantStyle.backgroundColor,
            borderColor: variantStyle.borderColor,
            opacity: disabled ? 0.5 : opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        <Text style={[styles.buttonText, { color: variantStyle.textColor }, textStyle]}>
          {icon ? `${icon}  ${title}` : title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
