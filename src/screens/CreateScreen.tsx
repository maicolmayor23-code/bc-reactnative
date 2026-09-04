// ============================================================
// SCREEN — src/screens/CreateScreen.tsx
// ============================================================
// Formulario para crear un nuevo equipo de DJ / Sonido y Luces consumiendo useCreateEquipment.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useCreateEquipment } from '../hooks/useCreateEquipment';
import { EquipmentCategory, EquipmentAvailability } from '../types';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import { CreateEquipmentScreenProps } from '../navigation/types';

const CATEGORIES: EquipmentCategory[] = ['DJ Gear', 'Sonido', 'Iluminación', 'Efectos FX'];
const AVAILABILITY_OPTIONS: EquipmentAvailability[] = ['Disponible', 'En Alquiler'];

export function CreateScreen({ navigation }: CreateEquipmentScreenProps): React.JSX.Element {
  const { mutate, isPending } = useCreateEquipment();

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<EquipmentCategory>('DJ Gear');
  const [subtitle, setSubtitle] = useState<string>('');
  const [pricePerDay, setPricePerDay] = useState<string>('75');
  const [availability, setAvailability] = useState<EquipmentAvailability>('Disponible');
  const [imageUri, setImageUri] = useState<string>(
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80'
  );
  const [rating, setRating] = useState<string>('4.9');

  const handleSubmit = (): void => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre del equipo');
      return;
    }
    if (!subtitle.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa una breve descripción técnica');
      return;
    }

    const price = parseFloat(pricePerDay) || 50;
    const rate = parseFloat(rating) || 4.8;

    mutate(
      {
        name: name.trim(),
        category,
        subtitle: subtitle.trim(),
        pricePerDay: price,
        availability,
        imageUri: imageUri.trim(),
        rating: rate,
      },
      {
        onSuccess: () => {
          Alert.alert('Éxito', 'El equipo fue creado y registrado correctamente');
          navigation.goBack();
        },
        onError: (err: Error) => {
          Alert.alert('Error', `No se pudo registrar el equipo: ${err.message}`);
        },
      }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Registrar Nuevo Equipo</Text>
      <Text style={styles.headerSubtitle}>Beat & Light Pro — Gestión de Inventario</Text>

      {/* Nombre */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre / Modelo del Equipo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Pioneer CDJ-3000 / Kit Array 4000W"
          placeholderTextColor={COLORS.inputPlaceholder}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Categoría */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoría *</Text>
        <View style={styles.chipContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Descripción técnica / Subtitle */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Especificación Técnica (Resumen) *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ej. Reproductor de medios profesional multiformat con pantalla táctil HD"
          placeholderTextColor={COLORS.inputPlaceholder}
          value={subtitle}
          onChangeText={setSubtitle}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Precio por día */}
      <View style={styles.rowGroup}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
          <Text style={styles.label}>Precio / Día (USD) *</Text>
          <TextInput
            style={styles.input}
            placeholder="75"
            placeholderTextColor={COLORS.inputPlaceholder}
            keyboardType="numeric"
            value={pricePerDay}
            onChangeText={setPricePerDay}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: SPACING.sm }]}>
          <Text style={styles.label}>Calificación Inicial</Text>
          <TextInput
            style={styles.input}
            placeholder="4.9"
            placeholderTextColor={COLORS.inputPlaceholder}
            keyboardType="numeric"
            value={rating}
            onChangeText={setRating}
          />
        </View>
      </View>

      {/* Disponibilidad */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Estado de Inventario</Text>
        <View style={styles.chipContainer}>
          {AVAILABILITY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, availability === opt && styles.chipActive]}
              onPress={() => setAvailability(opt)}
            >
              <Text style={[styles.chipText, availability === opt && styles.chipTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* URL Imagen */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>URL de la Imagen (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor={COLORS.inputPlaceholder}
          value={imageUri}
          onChangeText={setImageUri}
        />
      </View>

      {/* Botón de Enviar */}
      <TouchableOpacity
        style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isPending}
      >
        {isPending ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.textInverse} size="small" />
            <Text style={styles.submitButtonText}> Guardando Equipo...</Text>
          </View>
        ) : (
          <Text style={styles.submitButtonText}>💾 Registrar Equipo en el Servidor</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 2,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSizeXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  rowGroup: {
    flexDirection: 'row',
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  chipTextActive: {
    color: COLORS.textInverse,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
