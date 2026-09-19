// ============================================================
// SCHEMAS — src/schemas/authSchema.ts
// ============================================================
// Validación estricta con Zod para Login y Registro de usuarios.
// ============================================================

import { z } from 'zod';

/**
 * Esquema de validación para inicio de sesión.
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'El nombre de usuario es obligatorio')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Roles disponibles para el dominio Beat & Light Pro
 */
export const USER_ROLES = ['Operador DJ', 'Técnico de Iluminación', 'Ingeniero de Sonido'] as const;

/**
 * Esquema de validación para registro de nuevo operador.
 */
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'El nombre de usuario es obligatorio')
      .min(3, 'El usuario debe tener al menos 3 caracteres'),
    email: z
      .string()
      .min(1, 'El correo electrónico es obligatorio')
      .email('Ingresa un correo electrónico válido'),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
    role: z.enum(USER_ROLES, {
      message: 'Selecciona un rol técnico válido',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
