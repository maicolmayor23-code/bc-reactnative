// ============================================================
// SCREEN: RegisterScreen — src/screens/RegisterScreen.tsx
// ============================================================
// Formulario de registro de nuevo operador con React Hook Form + Zod.
// Dominio: Beat & Light Pro.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { registerSchema, RegisterFormData, USER_ROLES } from '../schemas/authSchema';
import { FormField } from '../components/FormField';
import { useAuthStore } from '../stores/authStore';
import { COLORS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: RegisterScreenProps): React.JSX.Element {
  const registerAction = useAuthStore((state) => state.register);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Operador DJ',
    },
  });

  const currentRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerAction(data);
      Alert.alert('Registro Exitoso', 'Tu cuenta de operador ha sido creada correctamente.');
    } catch (err: any) {
      Alert.alert('Error de Registro', err.message || 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          <Text style={styles.backButtonText}>Volver a Login</Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Registro de Operador</Text>
          <Text style={styles.formSubtitle}>Crea una cuenta técnica para gestionar consolas y equipos</Text>

          {/* Campo Username */}
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Nombre de Usuario"
                placeholder="Ej. dj_martinez"
                iconName="person-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.username?.message}
              />
            )}
          />

          {/* Campo Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Correo Electrónico"
                placeholder="operador@beatlight.pro"
                iconName="mail-outline"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          {/* Selección de Rol de Dominio */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Rol Técnico del Dominio</Text>
            <View style={styles.roleOptions}>
              {USER_ROLES.map((role) => {
                const selected = currentRole === role;
                return (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleChip, selected ? styles.roleChipSelected : null]}
                    onPress={() => setValue('role', role)}
                  >
                    <Text style={[styles.roleChipText, selected ? styles.roleChipTextSelected : null]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.role?.message && (
              <Text style={styles.errorText}>{errors.role.message}</Text>
            )}
          </View>

          {/* Campo Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Contraseña"
                placeholder="••••••••"
                iconName="lock-closed-outline"
                isPassword
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          {/* Campo Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Confirmar Contraseña"
                placeholder="••••••••"
                iconName="checkmark-circle-outline"
                isPassword
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          {/* Botón Submit */}
          <TouchableOpacity
            style={[styles.submitButton, loading ? styles.disabledButton : null]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitButtonText}>REGISTRAR OPERADOR</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  backButtonText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  roleChipTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  submitButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});
