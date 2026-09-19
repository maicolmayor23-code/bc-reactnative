// ============================================================
// COMPONENT — src/components/FormField.tsx
// ============================================================
// Componente reutilizable de campo de entrada con integración para
// etiquetas, iconos, mensajes de error Zod e indicador de contraseña.
// Soporta tanto uso directo con props de TextInput como integración con Controller (control & name).
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  control?: any;
  name?: string;
  containerStyle?: ViewStyle;
}

export function FormField({
  label,
  error,
  iconName,
  isPassword = false,
  control,
  name,
  containerStyle,
  style,
  ...props
}: FormFieldProps): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const renderInput = (onChange?: (text: string) => void, onBlur?: () => void, value?: string) => (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={COLORS.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          onChangeText={onChange ?? props.onChangeText}
          onBlur={onBlur ?? props.onBlur}
          value={value ?? props.value}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) =>
          renderInput(onChange, onBlur, value != null ? String(value) : '')
        }
      />
    );
  }

  return renderInput();
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 48,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
