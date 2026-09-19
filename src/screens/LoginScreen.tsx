// ============================================================
// SCREEN: LoginScreen — src/screens/LoginScreen.tsx
// ============================================================
// Pantalla de inicio de sesión con React Hook Form + Zod.
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
import { loginSchema, LoginFormData } from '../schemas/authSchema';
import { FormField } from '../components/FormField';
import { useAuthStore } from '../stores/authStore';
import { COLORS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: LoginScreenProps): React.JSX.Element {
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.error);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data);
    } catch (err: any) {
      Alert.alert('Error de Autenticación', err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga credenciales de prueba predeterminadas (emilys / emilyspass)
   */
  const handleFillTestCredentials = () => {
    setValue('username', 'emilys');
    setValue('password', 'emilyspass');
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
        <View style={styles.headerContainer}>
          <Ionicons name="disc" size={54} color={COLORS.primary} />
          <Text style={styles.brandTitle}>BEAT & LIGHT PRO</Text>
          <Text style={styles.subtitle}>Sistema Profesional para Operadores DJ & Sonido</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>

          {authError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#FF5252" />
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}

          {/* Campo Username */}
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Nombre de Usuario"
                placeholder="Ej. emilys"
                iconName="person-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.username?.message}
              />
            )}
          />

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

          {/* Botón rápido de credenciales de prueba */}
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleFillTestCredentials}
            activeOpacity={0.7}
          >
            <Ionicons name="flash-outline" size={16} color={COLORS.primary} />
            <Text style={styles.testButtonText}>Cargar Credenciales de Prueba (emilys)</Text>
          </TouchableOpacity>

          {/* Botón Principal Submit */}
          <TouchableOpacity
            style={[styles.submitButton, loading ? styles.disabledButton : null]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitButtonText}>ACCEDER AL SISTEMA</Text>
            )}
          </TouchableOpacity>

          {/* Redirección a Registro */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tienes una cuenta de operador?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}> Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    minHeight: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 2,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
  errorBannerText: {
    color: '#FF5252',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 20,
  },
  testButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  submitButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  registerText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
