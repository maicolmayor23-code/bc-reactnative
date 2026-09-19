// ============================================================
// TYPES — src/types/index.ts
// ============================================================
// Definición de tipos e interfaces estricta para el dominio DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import type { EquipmentFormData } from '../schemas/equipmentSchema';
import type { LoginFormData, RegisterFormData } from '../schemas/authSchema';

export type LoginPayload = LoginFormData;
export type RegisterPayload = RegisterFormData;

export type EquipmentCategory = 'DJ Gear' | 'Sonido' | 'Iluminación' | 'Efectos FX';
export type EquipmentAvailability = 'Disponible' | 'En Alquiler';

/**
 * Modelo completo del Equipo en el sistema Beat & Light Pro.
 */
export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  subtitle: string;
  pricePerDay: number;
  availability: EquipmentAvailability;
  imageUri: string | any;
  rating: number;
  brand?: string;
  model?: string;
  description?: string;
  specifications?: string[];
}

/**
 * Alias de compatibilidad Item
 */
export type Item = Equipment;

/**
 * Re-exportación del tipo de formulario inferido automáticamente por Zod.
 */
export type { EquipmentFormData };

/**
 * Payload requerido para la creación de un nuevo equipo mediante POST.
 */
export type CreateEquipmentPayload = Omit<Equipment, 'id'>;

/**
 * Payload para la actualización de un equipo existente mediante PUT/PATCH.
 */
export type UpdateEquipmentPayload = Partial<CreateEquipmentPayload>;

// ============================================================
// TIPOS DE AUTENTICACIÓN Y USUARIO
// ============================================================

export type UserRole = 'Operador DJ' | 'Técnico de Iluminación' | 'Ingeniero de Sonido';

export interface User {
  id: number | string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
  role?: UserRole;
  assignedEquipmentsCount?: number;
  activeRentalLicense?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
}

export interface JwtPayload {
  sub: string | number;
  username?: string;
  email?: string;
  exp: number;
  iat: number;
}

