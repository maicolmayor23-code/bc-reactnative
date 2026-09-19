// ============================================================
// TYPES — src/types/index.ts
// ============================================================
// Define la interfaz del elemento del dominio asignado: DJ / Sonido e Iluminación.
// ============================================================

export type EquipmentCategory = 'DJ Gear' | 'Sonido' | 'Iluminación' | 'Efectos FX';
export type EquipmentAvailability = 'Disponible' | 'En Alquiler';

/**
 * Interfaz que representa un equipo o servicio del dominio DJ / Sonido e Iluminación.
 */
export interface Item {
  id: string;
  name: string;
  category: EquipmentCategory;
  subtitle: string;
  pricePerDay: number;
  availability: EquipmentAvailability;
  imageUri: string | any;
  rating?: number;
}

