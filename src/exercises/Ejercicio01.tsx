// ============================================================
// DESEMPEÑO: Ejercicio 01 — useQuery Básico (Semana 05 - Networking & TanStack Query v5)
// ============================================================
// Criterios de Evaluación (20 pts):
// 1. QueryClientProvider configurado en la raíz de la app (4 pts)
// 2. useQuery con queryKey correcto ['posts'] y queryFn que llama a Axios (6 pts)
// 3. Muestra ActivityIndicator mientras isLoading === true (4 pts)
// 4. Muestra mensaje de error cuando isError === true (3 pts)
// 5. Renderiza FlatList con los datos cuando la query tiene éxito (3 pts)
// ============================================================

import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';

export interface Post {
  id: number;
  title: string;
  body: string;
}

export function Ejercicio01Component(): React.JSX.Element {
  // 2. useQuery con queryKey en array y queryFn que llama a Axios mediante apiClient
  const { data, isLoading, isError, error } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await apiClient.get<Post[]>('/posts?_limit=10');
      return response.data;
    },
  });

  // 3. Muestra ActivityIndicator mientras isLoading === true
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Cargando publicaciones...</Text>
      </View>
    );
  }

  // 4. Muestra mensaje de error cuando isError === true
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ Error: {error.message}</Text>
      </View>
    );
  }

  // 5. Renderiza FlatList con los datos cuando la query tiene éxito
  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#8b949e',
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    color: '#f87171',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    padding: 12,
  },
  card: {
    backgroundColor: '#161b22',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  title: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  body: {
    color: '#c9d1d9',
    fontSize: 13,
    lineHeight: 18,
  },
});
