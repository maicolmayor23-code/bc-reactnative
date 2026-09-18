// ============================================================
// COMPONENT — src/components/FormField.tsx
// ============================================================
// Componente genérico reutilizable que encapsula Controller + TextInput + Mensajes de Error.
// Reutilizado en CreateScreen y EditScreen para cumplir con la rúbrica y los requisitos.
// ============================================================

import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Controller, FieldPath, FieldValues } from 'react-hook-form';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

export interface FormFieldProps<TFieldValues extends FieldValues = any>
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: any;
  name: FieldPath<TFieldValues>;
  label: string;
  error?: string;
  containerStyle?: object;
}

export function FormField<TFieldValues extends FieldValues = any>({
  control,
  name,
  label,
  error,
  containerStyle,
  style,
  multiline,
  numberOfLines,
  keyboardType = 'default',
  placeholder,
  ...textInputProps
}: FormFieldProps<TFieldValues>): React.JSX.Element {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              multiline && styles.textArea,
              !!error && styles.inputError,
              style,
            ]}
            placeholder={placeholder}
            placeholderTextColor={COLORS.inputPlaceholder}
            value={value !== undefined && value !== null ? String(value) : ''}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            {...textInputProps}
          />
        )}
      />
      {!!error && <Text style={styles.errorText}>⚠️ {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
    backgroundColor: 'rgba(248, 113, 113, 0.05)',
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeXS,
    marginTop: 4,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
});
