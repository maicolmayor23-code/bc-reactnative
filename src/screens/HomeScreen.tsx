// ============================================================
// SCREEN: HomeScreen
// ============================================================
// Pantalla principal: header con el nombre del dominio
// y lista de tarjetas usando ScrollView.
// ============================================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Item } from '../types';
import { ItemCard } from '../components/ItemCard';
import { MOCK_ITEMS } from '../data/mockData';

export function HomeScreen(): React.JSX.Element {
  const DOMAIN_TITLE = 'Beat & Light Pro';
  const DOMAIN_SUBTITLE = 'Catálogo de Equipos de DJ, Sonido e Iluminación';

  /**
   * Maneja la interacción al presionar una tarjeta de equipo.
   */
  function handleItemPress(item: Item): void {
    console.log('Equipo seleccionado:', item.name, `($${item.pricePerDay}/día)`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />

      {/* Header de la App */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTag}>EVENT & STAGE GEAR</Text>
          <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
          <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
        </View>

        <View style={styles.statsBadge}>
          <Text style={styles.statsCount}>{MOCK_ITEMS.length}</Text>
          <Text style={styles.statsLabel}>Equipos</Text>
        </View>
      </View>

      {/* Lista de Tarjetas con ScrollView */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ITEMS.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onPress={handleItemPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
    backgroundColor: '#161b22',
  },
  headerTitleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8b949e',
    marginTop: 4,
  },
  statsBadge: {
    backgroundColor: '#0d1117',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  statsCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  statsLabel: {
    fontSize: 10,
    color: '#8b949e',
    textTransform: 'uppercase',
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
