// ============================================================
// SCHEMA — src/schemas/equipmentSchema.ts
// ============================================================
// Esquema de validación estricto con Zod para el dominio DJ / Sonido y Luces.
// ============================================================

import { z } from 'zod';

export const CATEGORIES = ['DJ Gear', 'Sonido', 'Iluminación', 'Efectos FX'] as const;
export const AVAILABILITY_OPTIONS = ['Disponible', 'En Alquiler'] as const;

export const equipmentSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre no puede superar 80 caracteres'),
  category: z.enum(CATEGORIES, {
    message: 'Selecciona una categoría válida',
  }),
  subtitle: z
    .string()
    .min(5, 'La especificación técnica debe tener al menos 5 caracteres')
    .max(200, 'La especificación técnica no puede superar 200 caracteres'),
  pricePerDay: z.coerce
    .number({ message: 'Ingresa un número válido' })
    .positive('El precio diario debe ser mayor a 0'),
  availability: z.enum(AVAILABILITY_OPTIONS, {
    message: 'Selecciona un estado de disponibilidad',
  }),
  imageUri: z
    .string()
    .url('Debe ser una URL válida (http:// o https://)')
    .or(z.literal(''))
    .optional(),
  rating: z.coerce
    .number({ message: 'Ingresa una calificación válida' })
    .min(1.0, 'La calificación mínima es 1.0')
    .max(5.0, 'La calificación máxima es 5.0'),
});

/**
 * Tipo inferido automáticamente desde el esquema Zod (sin duplicación manual).
 */
export type EquipmentFormData = z.infer<typeof equipmentSchema>;
