// ============================================================
// DESEMPEÑO: Ejercicio 01 — AsyncStorage (Semana 07 - Persistencia Local)
// ============================================================
// Criterios de Evaluación (20 pts):
// 1. Paso 1-2: guarda y recupera un string con setItem/getItem correctamente (6 pts)
// 2. Paso 3: persiste un objeto con JSON.stringify/JSON.parse sin errores de tipos (6 pts)
// 3. Paso 4: implementa removeItem y multiRemove para limpiar datos (5 pts)
// 4. useEffect con array de dependencias correcto, sin llamadas duplicadas (3 pts)
// Dominio: Beat & Light Pro (DJ / Sonido e Iluminación).
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OperatorProfile {
  id: string;
  name: string;
  role: string;
  shiftHours: number;
}

const KEYS = {
  OPERATOR_NAME: '@op_name_v1',
  OPERATOR_PROFILE: '@op_profile_v1',
  LAST_LOGIN: '@last_login_v1',
} as const;

export function Ejercicio01Component(): React.JSX.Element {
  const [operatorName, setOperatorName] = useState<string>('');
  const [savedName, setSavedName] = useState<string | null>(null);

  const [profileName, setProfileName] = useState<string>('DJ Carlos Beat');
  const [profileRole, setProfileRole] = useState<string>('Ingeniero de Sonido');
  const [savedProfile, setSavedProfile] = useState<OperatorProfile | null>(null);

  const [statusMessage, setStatusMessage] = useState<string>('');

  // 4. useEffect con array de dependencias correcto para la carga inicial al montar el componente
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // 1. Recuperar string con getItem
      const name = await AsyncStorage.getItem(KEYS.OPERATOR_NAME);
      setSavedName(name);

      // 2. Recuperar y parsear objeto con JSON.parse
      const profileJson = await AsyncStorage.getItem(KEYS.OPERATOR_PROFILE);
      if (profileJson) {
        const parsedProfile = JSON.parse(profileJson) as OperatorProfile;
        setSavedProfile(parsedProfile);
      } else {
        setSavedProfile(null);
      }
    } catch (error) {
      setStatusMessage('Error al cargar datos desde AsyncStorage.');
    }
  };

  // 1. Paso 1-2: Guarda y recupera un string con setItem/getItem
  const handleSaveString = async () => {
    if (!operatorName.trim()) return;
    try {
      await AsyncStorage.setItem(KEYS.OPERATOR_NAME, operatorName.trim());
      setOperatorName('');
      await loadAllData();
      setStatusMessage('✅ Nombre guardado correctamente en AsyncStorage.');
    } catch (err) {
      setStatusMessage('Error al guardar el nombre.');
    }
  };

  // 2. Paso 3: Persiste un objeto con JSON.stringify/JSON.parse
  const handleSaveObject = async () => {
    const profile: OperatorProfile = {
      id: String(Date.now()),
      name: profileName,
      role: profileRole,
      shiftHours: 8,
    };
    try {
      await AsyncStorage.setItem(KEYS.OPERATOR_PROFILE, JSON.stringify(profile));
      await loadAllData();
      setStatusMessage('✅ Objeto perfil serializado con JSON.stringify y guardado.');
    } catch (err) {
      setStatusMessage('Error al serializar el objeto perfil.');
    }
  };

  // 3. Paso 4: Implementa removeItem para eliminar una clave específica
  const handleRemoveItem = async () => {
    try {
      await AsyncStorage.removeItem(KEYS.OPERATOR_NAME);
      await loadAllData();
      setStatusMessage('🗑️ Clave de nombre eliminada con removeItem.');
    } catch (err) {
      setStatusMessage('Error en removeItem.');
    }
  };

  // 3. Paso 4: Implementa removeMany / multiRemove para limpiar múltiples claves simultáneamente
  const handleMultiRemove = async () => {
    try {
      const keysToRemove = [KEYS.OPERATOR_NAME, KEYS.OPERATOR_PROFILE, KEYS.LAST_LOGIN];
      if ('removeMany' in AsyncStorage) {
        await (AsyncStorage as any).removeMany(keysToRemove);
      } else if ('multiRemove' in AsyncStorage) {
        await (AsyncStorage as any).multiRemove(keysToRemove);
      } else {
        await Promise.all(keysToRemove.map((k) => AsyncStorage.removeItem(k)));
      }
      await loadAllData();
      setStatusMessage('🧹 Todas las claves limpiadas simultáneamente (removeMany / multiRemove).');
    } catch (err) {
      setStatusMessage('Error al limpiar múltiples claves.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ejercicio 01: Persistencia con AsyncStorage</Text>
      <Text style={styles.subtitle}>Demostración de setItem, getItem, removeItem y multiRemove</Text>

      {/* Paso 1 & 2: Guardar y Leer String */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Persistir Cadena de Texto (String)</Text>
        <TextInput
          style={styles.input}
          value={operatorName}
          onChangeText={setOperatorName}
          placeholder="Nombre del operador DJ..."
          placeholderTextColor="#8b949e"
        />
        <Pressable style={styles.button} onPress={handleSaveString}>
          <Text style={styles.buttonText}>💾 Guardar String (setItem)</Text>
        </Pressable>
        <Text style={styles.resultText}>
          Valor en disco: <Text style={styles.highlight}>{savedName ?? '(Ninguno)'}</Text>
        </Text>
      </View>

      {/* Paso 3: Objeto JSON */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Persistir Objeto JSON (JSON.stringify / parse)</Text>
        <TextInput
          style={styles.input}
          value={profileName}
          onChangeText={setProfileName}
          placeholder="Nombre..."
          placeholderTextColor="#8b949e"
        />
        <TextInput
          style={styles.input}
          value={profileRole}
          onChangeText={setProfileRole}
          placeholder="Rol (ej. Iluminador)..."
          placeholderTextColor="#8b949e"
        />
        <Pressable style={styles.buttonSecondary} onPress={handleSaveObject}>
          <Text style={styles.buttonText}>📦 Serializar & Guardar Objeto</Text>
        </Pressable>
        {savedProfile ? (
          <View style={styles.objectCard}>
            <Text style={styles.objectCardText}>ID: {savedProfile.id}</Text>
            <Text style={styles.objectCardText}>Operador: {savedProfile.name}</Text>
            <Text style={styles.objectCardText}>Rol: {savedProfile.role}</Text>
            <Text style={styles.objectCardText}>Turno: {savedProfile.shiftHours} horas</Text>
          </View>
        ) : (
          <Text style={styles.resultText}>Sin objeto guardado</Text>
        )}
      </View>

      {/* Paso 4: Limpieza de Datos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Limpieza de Datos (removeItem & multiRemove)</Text>
        <View style={styles.row}>
          <Pressable style={styles.dangerButton} onPress={handleRemoveItem}>
            <Text style={styles.buttonText}>🗑️ removeItem (Nombre)</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={handleMultiRemove}>
            <Text style={styles.buttonText}>🧹 multiRemove (Todo)</Text>
          </Pressable>
        </View>
      </View>

      {statusMessage !== '' && <Text style={styles.statusToast}>{statusMessage}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#8b949e',
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#161b22',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f0f6fc',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#0d1117',
    color: '#f0f6fc',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#38bdf8',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonSecondary: {
    backgroundColor: '#238636',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  dangerButton: {
    flex: 1,
    backgroundColor: '#da3633',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  resultText: {
    color: '#c9d1d9',
    fontSize: 13,
    marginTop: 4,
  },
  highlight: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  objectCard: {
    backgroundColor: '#0d1117',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  objectCardText: {
    color: '#7ee787',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  statusToast: {
    color: '#e3b341',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 8,
  },
});
