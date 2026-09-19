// ============================================================
// SCREEN: Ejercicio02Screen (src/screens/Ejercicio02Screen.tsx)
// ============================================================
// Pantalla contenedora interactiva para el Ejercicio 02 (Interpolation & Stagger).
// ============================================================

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Ejercicio02Component } from '../exercises/Ejercicio02';
import { COLORS } from '../theme';

export function Ejercicio02Screen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Ejercicio02Component />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
