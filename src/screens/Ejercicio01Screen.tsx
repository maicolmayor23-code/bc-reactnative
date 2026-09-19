// ============================================================
// SCREEN: Ejercicio01Screen (src/screens/Ejercicio01Screen.tsx)
// ============================================================
// Pantalla contenedora interactiva para el Ejercicio 01 (Timing & Spring API).
// ============================================================

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Ejercicio01Component } from '../exercises/Ejercicio01';
import { COLORS } from '../theme';

export function Ejercicio01Screen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Ejercicio01Component />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
