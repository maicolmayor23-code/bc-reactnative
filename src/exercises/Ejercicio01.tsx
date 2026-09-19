// ============================================================
// DESEMPEÑO: Ejercicio 01 — Animated.timing & Animated.spring (Semana 09)
// ============================================================
// Criterios de Evaluación (20 pts):
// 1. Fade in/out correcto con Animated.timing (opacity 0→1→0) (6 pts)
// 2. Scale feedback en tap con Animated.spring (6 pts)
// 3. Animated.parallel para animar 2+ propiedades simultáneamente (4 pts)
// 4. Animated.sequence para encadenar animaciones en ráfaga (4 pts)
// Dominio: Beat & Light Pro (DJ / Sonido e Iluminación).
// ============================================================

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';
import { AnimatedButton } from '../components/AnimatedButton';

export function Ejercicio01Component(): React.JSX.Element {
  // ------------------------------------------------------------
  // 1. Animated.timing — Fade In / Fade Out de Luz Strobe DMX
  // ------------------------------------------------------------
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isFadedIn, setIsFadedIn] = useState(false);

  const toggleFade = () => {
    const toValue = isFadedIn ? 0 : 1;
    Animated.timing(fadeAnim, {
      toValue,
      duration: 600,
      useNativeDriver: true, // ✅ Hilo nativo para opacity
    }).start(() => {
      setIsFadedIn(!isFadedIn);
    });
  };

  // ------------------------------------------------------------
  // 2. Animated.spring — Feedback táctil en Tap de Botón DJ Cue
  // ------------------------------------------------------------
  const springScale = useRef(new Animated.Value(1)).current;

  const triggerSpring = () => {
    // Comprimir y rebotar
    Animated.spring(springScale, {
      toValue: 0.85,
      tension: 300,
      friction: 8,
      useNativeDriver: true, // ✅ Hilo nativo para transform scale
    }).start(() => {
      Animated.spring(springScale, {
        toValue: 1,
        tension: 200,
        friction: 5, // Fricción baja = rebote natural
        useNativeDriver: true,
      }).start();
    });
  };

  // ------------------------------------------------------------
  // 3. Animated.parallel — Animación simultánea de Opacidad + Traslación (Slide)
  // ------------------------------------------------------------
  const parallelOpacity = useRef(new Animated.Value(0)).current;
  const parallelTranslateY = useRef(new Animated.Value(40)).current;
  const [parallelActive, setParallelActive] = useState(false);

  const triggerParallel = () => {
    const toVal = parallelActive ? 0 : 1;
    const transVal = parallelActive ? 40 : 0;

    Animated.parallel([
      Animated.timing(parallelOpacity, {
        toValue: toVal,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(parallelTranslateY, {
        toValue: transVal,
        tension: 180,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setParallelActive(!parallelActive);
    });
  };

  // ------------------------------------------------------------
  // 4. Animated.sequence — Secuencia encadenada paso a paso (Flash Strobe Ráfaga)
  // ------------------------------------------------------------
  const sequenceScale = useRef(new Animated.Value(1)).current;
  const sequenceOpacity = useRef(new Animated.Value(1)).current;
  const [sequenceStatus, setSequenceStatus] = useState('Listo para iniciar secuencia');

  const triggerSequence = () => {
    setSequenceStatus('Ejecutando ráfaga de flashes DMX...');
    Animated.sequence([
      // Paso 1: Reducir tamaño
      Animated.timing(sequenceScale, { toValue: 0.7, duration: 200, useNativeDriver: true }),
      // Paso 2: Opacidad flash
      Animated.timing(sequenceOpacity, { toValue: 0.2, duration: 150, useNativeDriver: true }),
      // Paso 3: Opacidad a 1
      Animated.timing(sequenceOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      // Paso 4: Expandir con rebote spring
      Animated.spring(sequenceScale, { toValue: 1.2, tension: 250, friction: 6, useNativeDriver: true }),
      // Paso 5: Volver al estado normal
      Animated.spring(sequenceScale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start(() => {
      setSequenceStatus('✅ Secuencia DMX completada exitosamente');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ejercicio 01: Timing & Spring API</Text>
      <Text style={styles.subtitle}>
        Demostración de animaciones en hilo nativo para equipos Beat & Light Pro
      </Text>

      {/* Criterio 1: Animated.timing (Fade in/out) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Animated.timing — Fade In / Fade Out (Opacity)</Text>
        <Text style={styles.description}>
          Transición lineal de opacidad (0 → 1 → 0) para controlar el encendido suave de la cabeza robótica DMX.
        </Text>

        <Animated.View style={[styles.demoCard, { opacity: fadeAnim }]}>
          <Text style={styles.demoIcon}>💡</Text>
          <Text style={styles.demoText}>Cabeza Robótica LED — Haz DMX Activo</Text>
        </Animated.View>

        <AnimatedButton
          title={isFadedIn ? 'Fade Out (Apagar)' : 'Fade In (Encender)'}
          onPress={toggleFade}
          variant="primary"
        />
      </View>

      {/* Criterio 2: Animated.spring (Scale feedback en tap) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Animated.spring — Feedback Táctil con Rebote</Text>
        <Text style={styles.description}>
          Respuesta física natural al presionar el botón CUE de la consola de mezclas Pioneer CDJ 3000.
        </Text>

        <View style={styles.centerBox}>
          <Animated.View style={{ transform: [{ scale: springScale }] }}>
            <Pressable style={styles.cueButton} onPress={triggerSpring}>
              <Text style={styles.cueText}>CUE / TAP</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>

      {/* Criterio 3: Animated.parallel (Simultáneo opacity + translateY) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Animated.parallel — Animaciones Simultáneas</Text>
        <Text style={styles.description}>
          Ejecuta al mismo tiempo un fade in de opacidad (0 → 1) y un deslizable vertical (translateY: 40 → 0).
        </Text>

        <Animated.View
          style={[
            styles.parallelCard,
            {
              opacity: parallelOpacity,
              transform: [{ translateY: parallelTranslateY }],
            },
          ]}
        >
          <Text style={styles.parallelTitle}>🔊 Sistema Line Array dB Technologies</Text>
          <Text style={styles.parallelSubtitle}>
            Potencia: 2400W RMS | Respuesta Frecuencia: 45Hz - 20kHz
          </Text>
        </Animated.View>

        <AnimatedButton
          title={parallelActive ? 'Ocultar con Parallel' : 'Mostrar con Parallel'}
          onPress={triggerParallel}
          variant="accent"
        />
      </View>

      {/* Criterio 4: Animated.sequence (Encadenado paso a paso) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Animated.sequence — Secuencia Encadenada</Text>
        <Text style={styles.description}>
          Ejecuta en orden estricto una serie de 5 pasos animados (compresión → ráfaga de opacidad → rebote).
        </Text>

        <View style={styles.centerBox}>
          <Animated.View
            style={[
              styles.sequenceBox,
              {
                opacity: sequenceOpacity,
                transform: [{ scale: sequenceScale }],
              },
            ]}
          >
            <Text style={styles.sequenceIcon}>⚡</Text>
            <Text style={styles.sequenceBoxText}>Strobe Ráfaga FX</Text>
          </Animated.View>
        </View>

        <AnimatedButton
          title="Disparar Secuencia FX"
          onPress={triggerSequence}
          variant="secondary"
        />
        <Text style={styles.statusText}>{sequenceStatus}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 14,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  demoCard: {
    backgroundColor: COLORS.primaryDim,
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  demoIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  demoText: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
  centerBox: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  cueButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#0284c7',
    borderWidth: 4,
    borderColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  cueText: {
    color: '#ffffff',
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
    fontSize: TYPOGRAPHY.fontSizeLG,
    letterSpacing: 1.5,
  },
  parallelCard: {
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: SPACING.md,
  },
  parallelTitle: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    marginBottom: SPACING.xs,
  },
  parallelSubtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSM,
  },
  sequenceBox: {
    width: 140,
    height: 90,
    backgroundColor: '#3b0764',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sequenceIcon: {
    fontSize: 28,
  },
  sequenceBoxText: {
    color: '#ffffff',
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: TYPOGRAPHY.fontSizeSM,
    marginTop: 4,
  },
  statusText: {
    color: COLORS.success,
    fontSize: TYPOGRAPHY.fontSizeSM,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
});
