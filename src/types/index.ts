// ============================================================
// TYPES — src/types/index.ts
// ============================================================
// Define aquí la interfaz del elemento de tu dominio asignado.
// Este type se usará en mockData.ts, ItemCard.tsx y HomeScreen.tsx
// ============================================================

// TODO: Renombra esta interfaz con el nombre de tu elemento
// Ejemplos: Book, Medication, Member, Dish, Movie, Destination
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
}
