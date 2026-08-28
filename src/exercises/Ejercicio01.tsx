// ============================================================
// DESEMPEÑO: Ejercicio 01 — Store Básico y Selectores (Zustand)
// ============================================================
// PASO 1: Store definido con create<TodoStore>(), estado y acciones tipadas
// PASO 2: Selector específico en cada componente
// PASO 3: Acciones addTodo / removeTodo funcionan correctamente con set
// PASO 4: Segundo componente consume el mismo store sin prop drilling
// ============================================================

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { create } from 'zustand';

// 1. Interfaz del Store (Estado + Acciones)
export interface TodoItem {
  id: string;
  text: string;
}

export interface TodoStore {
  count: number;
  todos: TodoItem[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  incrementCount: () => void;
}

// 2. Creación del store con create<TodoStore>()
export const useTodoStore = create<TodoStore>((set) => ({
  count: 0,
  todos: [],

  addTodo: (text: string) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now().toString(), text }],
      count: state.count + 1,
    })),

  removeTodo: (id: string) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  incrementCount: () =>
    set((state) => ({
      count: state.count + 1,
    })),
}));

// Componente 1: Agrega tareas y consume solo las acciones y el estado de lista
export function TodoInputComponent(): React.JSX.Element {
  const [text, setText] = useState('');
  
  // PASO 2: Selector específico para la acción addTodo
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleAdd = () => {
    if (text.trim()) {
      addTodo(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Escribe una nueva tarea..."
        placeholderTextColor="#8b949e"
      />
      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar Tarea</Text>
      </Pressable>
    </View>
  );
}

// Componente 2: Renderiza el conteo y la lista de tareas SIN recibir props (PASO 4: Sin prop drilling)
export function TodoListComponent(): React.JSX.Element {
  // PASO 2: Selectores específicos e independientes para evitar re-renders innecesarios
  const count = useTodoStore((state) => state.count);
  const todos = useTodoStore((state) => state.todos);
  const removeTodo = useTodoStore((state) => state.removeTodo);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total de Tareas Creadas: {count}</Text>
      {todos.map((todo) => (
        <View key={todo.id} style={styles.todoRow}>
          <Text style={styles.todoText}>{todo.text}</Text>
          <Pressable style={styles.deleteButton} onPress={() => removeTodo(todo.id)}>
            <Text style={styles.deleteText}>Eliminar</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#161b22',
    borderRadius: 12,
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#0d1117',
    color: '#f0f6fc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#238636',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    color: '#58a6ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  todoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  todoText: {
    color: '#c9d1d9',
  },
  deleteButton: {
    backgroundColor: '#da3633',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
