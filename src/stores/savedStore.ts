// ============================================================
// STORE: savedStore — src/stores/savedStore.ts
// ============================================================
// Store global con Zustand para gestionar los equipos guardados / favoritos
// del dominio DJ / Sonido y luces (Beat & Light Pro).
// ============================================================

import { create } from 'zustand';
import { Item } from '../types';

/**
 * Interfaz que define el estado y las acciones del store de equipos guardados.
 */
export interface SavedEquipmentStore {
  savedItems: Item[];
  toggleSaveItem: (item: Item) => void;
  removeItem: (id: string) => void;
  clearSaved: () => void;
}

/**
 * Hook del store Zustand para la gestión de equipos guardados.
 */
export const useSavedStore = create<SavedEquipmentStore>((set) => ({
  savedItems: [],

  /**
   * Agrega el equipo si no está guardado, o lo elimina si ya existe.
   */
  toggleSaveItem: (item: Item) =>
    set((state) => {
      const exists = state.savedItems.some((saved) => saved.id === item.id);
      if (exists) {
        return {
          savedItems: state.savedItems.filter((saved) => saved.id !== item.id),
        };
      }
      return {
        savedItems: [...state.savedItems, item],
      };
    }),

  /**
   * Elimina un equipo por su ID.
   */
  removeItem: (id: string) =>
    set((state) => ({
      savedItems: state.savedItems.filter((saved) => saved.id !== id),
    })),

  /**
   * Limpia toda la lista de equipos guardados.
   */
  clearSaved: () => set({ savedItems: [] }),
}));
