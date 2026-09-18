// ============================================================
// TYPES — src/types/index.ts
// ============================================================
// Definición de tipos e interfaces estricta para el dominio DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import type { EquipmentFormData } from '../schemas/equipmentSchema';

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
  imageUri: string;
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
