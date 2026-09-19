// ============================================================
// DESEMPEÑO: Ejercicio 02 — Interpolation & Stagger (Semana 09)
// ============================================================
// Criterios de Evaluación (20 pts):
// 1. Rotación animada con interpolate (0°→360°) para vinilo DJ / giratorio (5 pts)
// 2. Color interpolado (verde → amarillo → rojo) según nivel de vúmetro de audio (5 pts)
// 3. Barra de progreso animada (width 0% → 100%) (5 pts)
// 4. Animated.stagger para animar lista de canales DMX en cascada (5 pts)
// Dominio: Beat & Light Pro (DJ / Sonido e Iluminación).
// ============================================================

import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';
import { ProgressBar } from '../components/ProgressBar';
import { AnimatedButton } from '../components/AnimatedButton';

export function Ejercicio02Component(): React.JSX.Element {
  // ------------------------------------------------------------
  // 1. Rotación Interpolada (0° → 360°) — Vinilo DJ Giratorio
  // ------------------------------------------------------------
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const toggleSpin = () => {
    if (isSpinning) {
      loopRef.current?.stop();
      setIsSpinning(false);
    } else {
      spinAnim.setValue(0);
      loopRef.current = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true, // ✅ Native driver para transform rotate
        })
      );
      loopRef.current.start();
      setIsSpinning(true);
    }
  };

  const spinRotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ------------------------------------------------------------
  // 2. Color Interpolado & 3. Barra de Progreso (0% → 100%)
  // ------------------------------------------------------------
  const [progressVal, setProgressVal] = useState(65);

  const handleRandomProgress = () => {
    const nextVal = Math.floor(Math.random() * 95) + 5;
    setProgressVal(nextVal);
  };

  // ------------------------------------------------------------
  // 4. Animated.stagger — Animación en Cascada de Canales DMX
  // ------------------------------------------------------------
  const CHANNELS = [
    { id: '1', name: 'Canal 01: Subwoofers Master', level: '85 dB' },
    { id: '2', name: 'Canal 02: Line Array Izquierdo', level: '92 dB' },
    { id: '3', name: 'Canal 03: Line Array Derecho', level: '92 dB' },
    { id: '4', name: 'Canal 04: Cabezas Robóticas DMX', level: 'Preset Auto' },
    { id: '5', name: 'Canal 05: Máquina de Humo / Haz FX', level: 'Standby' },
  ];

  // Crear 5 valores animados para la opacidad y posición de cada canal
  const staggerAnims = useRef(CHANNELS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    runStagger();
  }, []);

  const runStagger = () => {
    // Resetear valores a 0
    staggerAnims.forEach((anim) => anim.setValue(0));

    // Stagger con 80ms de retraso entre cada elemento
    Animated.stagger(
      80, // 80ms delay entre cada uno
      staggerAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        })
      )
    ).start();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ejercicio 02: Interpolación & Stagger</Text>
      <Text style={styles.subtitle}>
        Mapeo de valores no numéricos y cascadas animadas en Beat & Light Pro
      </Text>

      {/* Criterio 1: Rotación Interpolada (0° → 360°) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. interpolate — Rotación Vinilo DJ (0° → 360°)</Text>
        <Text style={styles.description}>
          Transforma un Animated.Value lineal de 0 a 1 en rotación continua en grados usando el hilo nativo.
        </Text>

        <View style={styles.centerBox}>
          <Animated.View
            style={[
              styles.vinylDisk,
              {
                transform: [{ rotate: spinRotate }],
              },
            ]}
          >
            <View style={styles.vinylCenter} />
            <Text style={styles.vinylText}>PIONEER DJ</Text>
          </Animated.View>
        </View>

        <AnimatedButton
          title={isSpinning ? '⏹️ Detener Vinilo' : '▶️ Girar Vinilo (33 RPM)'}
          onPress={toggleSpin}
          variant={isSpinning ? 'danger' : 'primary'}
        />
      </View>

      {/* Criterios 2 y 3: Color Interpolado y Barra de Progreso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2 & 3. Barra de Progreso e Interpolación de Color</Text>
        <Text style={styles.description}>
          Anima el ancho de la barra de 0% a 100% mientras cambia el color dinámicamente:
          Rojo (#ef4444) → Amarillo (#facc15) → Verde (#22c55e).
        </Text>

        <ProgressBar
          progress={progressVal}
          label="Carga de Potencia de Escenario RMS"
          showPercentage
        />

        <View style={{ marginTop: SPACING.md }}>
          <AnimatedButton
            title="⚡ Cambiar Nivel de Potencia RMS"
            onPress={handleRandomProgress}
            variant="accent"
          />
        </View>
      </View>

      {/* Criterio 4: Animated.stagger (Entrada en Cascada) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Animated.stagger — Entrada en Cascada</Text>
        <Text style={styles.description}>
          Carga en cascada la lista de canales del controlador de sonido con 80ms de desfase entre cada item.
        </Text>

        <View style={styles.channelsList}>
          {CHANNELS.map((ch, idx) => {
            const translateY = staggerAnims[idx].interpolate({
              inputRange: [0, 1],
              outputRange: [25, 0],
            });

            return (
              <Animated.View
                key={ch.id}
                style={[
                  styles.channelRow,
                  {
                    opacity: staggerAnims[idx],
                    transform: [{ translateY }],
                  },
                ]}
              >
                <Text style={styles.channelName}>{ch.name}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{ch.level}</Text>
                </View>
              </Animated.View>
            );
          })}
        </View>

        <AnimatedButton
          title="🔄 Reejecutar Cascada (Stagger 80ms)"
          onPress={runStagger}
          variant="secondary"
        />
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
  centerBox: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  vinylDisk: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#111827',
    borderWidth: 6,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  vinylCenter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  vinylText: {
    position: 'absolute',
    bottom: 12,
    fontSize: 8,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  channelsList: {
    marginVertical: SPACING.md,
    gap: SPACING.sm,
  },
  channelRow: {
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.md,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  channelName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeSM + 1,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  levelBadge: {
    backgroundColor: COLORS.primaryDim,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  levelText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSizeXS + 1,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
