// ============================================================
// DESEMPEÑO: Ejercicio 02 — useMutation (Semana 05 - Networking & TanStack Query v5)
// ============================================================
// Criterios de Evaluación (20 pts):
// 1. useMutation con mutationFn que realiza POST con Axios (6 pts)
// 2. onSuccess llama queryClient.invalidateQueries con queryKey ['posts'] (6 pts)
// 3. Botón deshabilitado mientras isPending === true (4 pts)
// 4. Lista se actualiza automáticamente tras la mutación sin reload (4 pts)
// ============================================================

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';

export interface Post {
  id: number;
  title: string;
  body: string;
}

export function Ejercicio02Component(): React.JSX.Element {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // 1. useMutation con mutationFn realizando POST con Axios
  const { mutate, isPending } = useMutation({
    mutationFn: async (newPost: { title: string; body: string }) => {
      const response = await apiClient.post<Post>('/posts', newPost);
      return response.data;
    },
    // 2. onSuccess llama queryClient.invalidateQueries con la queryKey ['posts']
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTitle('');
      setBody('');
    },
  });

  const handleCreate = () => {
    if (title.trim() && body.trim()) {
      mutate({ title: title.trim(), body: body.trim() });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crear Nueva Publicación (useMutation)</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título de la publicación..."
        placeholderTextColor="#8b949e"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        value={body}
        onChangeText={setBody}
        placeholder="Contenido de la publicación..."
        placeholderTextColor="#8b949e"
        multiline
        numberOfLines={3}
      />

      {/* 3. Botón deshabilitado mientras isPending === true */}
      <Pressable
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handleCreate}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonText}>🚀 Enviar Publicación</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#161b22',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  header: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0d1117',
    color: '#f0f6fc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    marginBottom: 10,
    fontSize: 14,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#38bdf8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#0d1117',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
