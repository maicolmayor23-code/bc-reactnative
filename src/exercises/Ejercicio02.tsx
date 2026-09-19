// ============================================================
// DESEMPEÑO: Ejercicio 02 — MMKV + SecureStore (Semana 07 - Persistencia Local)
// ============================================================
// Criterios de Evaluación (20 pts):
// 1. Paso 1-2: MMKV sincrónico — storage.set() / storage.getString() funcionan sin await (7 pts)
// 2. Paso 3: Custom hook useMMKVString o useMMKVBoolean con listener reactivo (6 pts)
// 3. Paso 4: SecureStore — setItemAsync / getItemAsync para dato sensible, sin valores en texto plano en el código (7 pts)
// Dominio: Beat & Light Pro (DJ / Sonido e Iluminación).
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, StyleSheet, ScrollView } from 'react-native';
import { useMMKVString, useMMKVBoolean } from 'react-native-mmkv';
import { storage } from '../storage/mmkv';
import * as SecureStore from 'expo-secure-store';

const SYNC_KEY = 'demo_sync_mode';
const REACTIVE_KEY = 'demo_reactive_theme';
const SECURE_KEY = 'demo_secure_access_pin';

export function Ejercicio02Component(): React.JSX.Element {
  // ============================================================
  // PASO 1 & 2: MMKV Sincrónico sin await
  // ============================================================
  const [syncValue, setSyncValue] = useState<string>(() => {
    // Lectura sincrónica instantánea al inicializar
    return storage.getString(SYNC_KEY) ?? 'Normal';
  });

  const handleSaveSync = (mode: string) => {
    // 1. Escrita sincrónica — sin necesidad de async/await
    storage.set(SYNC_KEY, mode);
    const readDirectly = storage.getString(SYNC_KEY);
    setSyncValue(readDirectly ?? mode);
  };

  // ============================================================
  // PASO 3: Hooks reactivos de MMKV (useMMKVBoolean)
  // ============================================================
  // 2. Listener reactivo automático sincronizado con la memoria y el disco
  const [darkMode, setDarkMode] = useMMKVBoolean(REACTIVE_KEY, storage);
  const [stageMode, setStageMode] = useMMKVString('demo_stage_mode', storage);

  // ============================================================
  // PASO 4: SecureStore Cifrado de Datos Sensibles
  // ============================================================
  const [inputPin, setInputPin] = useState<string>('');
  const [hasStoredPin, setHasStoredPin] = useState<boolean>(false);
  const [pinLength, setPinLength] = useState<number>(0);
  const [secureMessage, setSecureMessage] = useState<string>('');

  useEffect(() => {
    verifySecureStoreStatus();
  }, []);

  const verifySecureStoreStatus = async () => {
    try {
      // 3. getItemAsync de forma asíncrona segura
      const stored = await SecureStore.getItemAsync(SECURE_KEY);
      if (stored) {
        setHasStoredPin(true);
        setPinLength(stored.length);
      } else {
        setHasStoredPin(false);
        setPinLength(0);
      }
    } catch (err) {
      setHasStoredPin(false);
    }
  };

  const handleSaveSecurePin = async () => {
    if (!inputPin.trim()) return;
    try {
      // 3. setItemAsync para cifrado en Keychain/Keystore
      await SecureStore.setItemAsync(SECURE_KEY, inputPin.trim());
      setInputPin('');
      await verifySecureStoreStatus();
      setSecureMessage('🔒 PIN cifrado y almacenado en SecureStore sin exponer texto plano.');
    } catch (err) {
      setSecureMessage('Error al guardar en SecureStore.');
    }
  };

  const handleDeleteSecurePin = async () => {
    try {
      await SecureStore.deleteItemAsync(SECURE_KEY);
      await verifySecureStoreStatus();
      setSecureMessage('🗑️ PIN cifrado eliminado correctamente.');
    } catch (err) {
      setSecureMessage('Error al eliminar PIN.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ejercicio 02: MMKV Sincrónico & Expo SecureStore</Text>
      <Text style={styles.subtitle}>Demostración de almacenamiento sincrónico JSI y cifrado Keychain/Keystore</Text>

      {/* Paso 1-2: MMKV Sincrónico sin await */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. MMKV Sincrónico (storage.set / getString sin await)</Text>
        <Text style={styles.description}>
          MMKV ejecuta lecturas y escrituras inmediatas mediante la interfaz C++ JSI sin bloquear el hilo JS.
        </Text>
        <View style={styles.row}>
          <Pressable style={styles.chipButton} onPress={() => handleSaveSync('Ecualización Directa')}>
            <Text style={styles.chipText}>Modo Directo</Text>
          </Pressable>
          <Pressable style={styles.chipButton} onPress={() => handleSaveSync('Preset DJ Club')}>
            <Text style={styles.chipText}>Preset Club</Text>
          </Pressable>
        </View>
        <Text style={styles.resultText}>
          Estado sincrónico en disco: <Text style={styles.highlight}>{syncValue}</Text>
        </Text>
      </View>

      {/* Paso 3: Custom hook reactivo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. MMKV Hooks Reactivos (useMMKVBoolean / useMMKVString)</Text>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Modo Escenario Oscuro (Dark Theme):</Text>
          <Switch
            value={darkMode ?? false}
            onValueChange={(val) => setDarkMode(val)}
            trackColor={{ false: '#30363d', true: '#38bdf8' }}
            thumbColor={darkMode ? '#ffffff' : '#8b949e'}
          />
        </View>
        <View style={styles.row}>
          {(['Line Array', 'Subwoofers', 'Luces DMX'] as const).map((mode) => (
            <Pressable
              key={mode}
              style={[styles.smallChip, stageMode === mode && styles.smallChipActive]}
              onPress={() => setStageMode(mode)}
            >
              <Text style={[styles.smallChipText, stageMode === mode && styles.smallChipTextActive]}>
                {mode}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.resultText}>
          Modo seleccionado: <Text style={styles.highlight}>{stageMode ?? 'Ninguno'}</Text>
        </Text>
      </View>

      {/* Paso 4: SecureStore Cifrado */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. SecureStore (setItemAsync / getItemAsync Cifrado)</Text>
        <Text style={styles.description}>
          Guarda y recupera un dato sensible sin mostrar el valor en texto plano en la interfaz.
        </Text>
        <View style={styles.tokenBox}>
          <Text style={styles.tokenBoxText}>
            {hasStoredPin
              ? `🔒 Clave cifrada activa (${pinLength} dígitos/caracteres en Keychain/Keystore)`
              : '⚠️ Sin PIN seguro configurado'}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          value={inputPin}
          onChangeText={setInputPin}
          placeholder="Ingrese nuevo PIN de mesa de mezclas..."
          placeholderTextColor="#8b949e"
          secureTextEntry
        />
        <View style={styles.row}>
          <Pressable style={styles.primaryButton} onPress={handleSaveSecurePin}>
            <Text style={styles.buttonText}>🔒 Guardar Cifrado</Text>
          </Pressable>
          {hasStoredPin && (
            <Pressable style={styles.dangerButton} onPress={handleDeleteSecurePin}>
              <Text style={styles.buttonText}>🗑️ Eliminar</Text>
            </Pressable>
          )}
        </View>
      </View>

      {secureMessage !== '' && <Text style={styles.statusToast}>{secureMessage}</Text>}
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
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: '#8b949e',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  chipButton: {
    backgroundColor: '#21262d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  chipText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#f0f6fc',
    fontSize: 13,
  },
  smallChip: {
    backgroundColor: '#0d1117',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  smallChipActive: {
    backgroundColor: '#38bdf8',
    borderColor: '#38bdf8',
  },
  smallChipText: {
    color: '#c9d1d9',
    fontSize: 12,
  },
  smallChipTextActive: {
    color: '#0d1117',
    fontWeight: 'bold',
  },
  resultText: {
    color: '#c9d1d9',
    fontSize: 13,
    marginTop: 6,
  },
  highlight: {
    color: '#7ee787',
    fontWeight: 'bold',
  },
  tokenBox: {
    backgroundColor: '#0d1117',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  tokenBoxText: {
    color: '#e3b341',
    fontSize: 12,
    fontWeight: 'bold',
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
  primaryButton: {
    flex: 1,
    backgroundColor: '#38bdf8',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
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
  statusToast: {
    color: '#7ee787',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 8,
  },
});
