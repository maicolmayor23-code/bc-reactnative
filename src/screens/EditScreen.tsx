// ============================================================
// SCREEN — src/screens/EditScreen.tsx
// ============================================================
// Formulario para editar un equipo existente usando React Hook Form + Zod.
// Carga defaultValues con reset() dentro de useEffect cuando llegan los datos.
// Dominio: DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '../components/FormField';
import { equipmentSchema, type EquipmentFormData, CATEGORIES, AVAILABILITY_OPTIONS } from '../schemas/equipmentSchema';
import { useEquipmentById } from '../hooks/useEquipmentById';
import { useUpdateEquipment } from '../hooks/useUpdateEquipment';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import { EditEquipmentScreenProps } from '../navigation/types';

export function EditScreen({ route, navigation }: EditEquipmentScreenProps): React.JSX.Element {
  const { id } = route.params;
  const { data: equipment, isLoading, isError } = useEquipmentById(id);
  const { mutate: updateMutate, isPending } = useUpdateEquipment();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: '',
      category: 'DJ Gear' as const,
      subtitle: '',
      pricePerDay: 75,
      availability: 'Disponible' as const,
      imageUri: '',
      rating: 4.8,
    },
  });

  // Cargar los datos del equipo en el formulario cuando la query finalice
  useEffect(() => {
    if (equipment) {
      reset({
        name: equipment.name,
        category: equipment.category,
        subtitle: equipment.subtitle,
        pricePerDay: equipment.pricePerDay,
        availability: equipment.availability,
        imageUri: equipment.imageUri ?? '',
        rating: equipment.rating,
      });
    }
  }, [equipment, reset]);

  const onSubmit = (data: EquipmentFormData): void => {
    updateMutate(
      {
        id,
        data: {
          name: data.name.trim(),
          category: data.category,
          subtitle: data.subtitle.trim(),
          pricePerDay: Number(data.pricePerDay),
          availability: data.availability,
          imageUri: data.imageUri?.trim() || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
          rating: Number(data.rating),
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Éxito', 'El equipo se actualizó correctamente');
          navigation.goBack();
        },
        onError: (err: Error) => {
          Alert.alert('Error', `No se pudo actualizar el equipo: ${err.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando datos del equipo...</Text>
      </View>
    );
  }

  if (isError || !equipment) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del equipo.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLoadingOrSubmitting = isPending || isSubmitting;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Editar Equipo</Text>
      <Text style={styles.headerSubtitle}>Modificar especificaciones de {equipment.name}</Text>

      {/* Nombre */}
      <FormField
        control={control}
        name="name"
        label="Nombre / Modelo del Equipo *"
        placeholder="Ej. Pioneer CDJ-3000 / Kit Array 4000W"
        error={errors.name?.message}
      />

      {/* Categoría */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoría *</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, value === cat && styles.chipActive]}
                  onPress={() => onChange(cat)}
                >
                  <Text style={[styles.chipText, value === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.category && <Text style={styles.errorTextInline}>⚠️ {errors.category.message}</Text>}
      </View>

      {/* Especificación Técnica / Subtitle */}
      <FormField
        control={control}
        name="subtitle"
        label="Especificación Técnica (Resumen) *"
        placeholder="Ej. Reproductor multiformat con pantalla táctil HD"
        multiline
        numberOfLines={3}
        error={errors.subtitle?.message}
      />

      {/* Precio por Día y Calificación */}
      <View style={styles.rowGroup}>
        <FormField
          control={control}
          name="pricePerDay"
          label="Precio / Día (USD) *"
          placeholder="75"
          keyboardType="numeric"
          error={errors.pricePerDay?.message}
          containerStyle={{ flex: 1, marginRight: SPACING.sm }}
        />

        <FormField
          control={control}
          name="rating"
          label="Calificación (1.0 - 5.0) *"
          placeholder="4.9"
          keyboardType="numeric"
          error={errors.rating?.message}
          containerStyle={{ flex: 1, marginLeft: SPACING.sm }}
        />
      </View>

      {/* Disponibilidad */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Estado de Inventario *</Text>
        <Controller
          control={control}
          name="availability"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipContainer}>
              {AVAILABILITY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, value === opt && styles.chipActive]}
                  onPress={() => onChange(opt)}
                >
                  <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.availability && <Text style={styles.errorTextInline}>⚠️ {errors.availability.message}</Text>}
      </View>

      {/* URL Imagen */}
      <FormField
        control={control}
        name="imageUri"
        label="URL de la Imagen (Opcional)"
        placeholder="https://images.unsplash.com/..."
        keyboardType="url"
        error={errors.imageUri?.message}
      />

      {/* Botón de Guardar Cambios */}
      <TouchableOpacity
        style={[styles.submitButton, isLoadingOrSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoadingOrSubmitting}
      >
        {isLoadingOrSubmitting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.textInverse} size="small" />
            <Text style={styles.submitButtonText}> Guardando Cambios...</Text>
          </View>
        ) : (
          <Text style={styles.submitButtonText}>💾 Actualizar Equipo</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeMD,
    marginTop: SPACING.md,
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
    letterSpacing: 0.5,
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
  errorTextInline: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeXS,
    marginTop: 4,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeMD,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  retryButtonText: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
