// ============================================================
// DESEMPEÑO: Ejercicio 02 — Persist Middleware (Zustand + AsyncStorage)
// ============================================================
// PASO 1: persist importado y wrapping el store correctamente
// PASO 2: AsyncStorage configurado como storage de persist
// PASO 3: partialize excluye correctamente campos volátiles
// PASO 4: onRehydrateStorage ejecutado al arrancar la app
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaz del estado del usuario / sesión
export interface UserSessionState {
  // Datos persistentes
  user: { id: string; name: string; email: string } | null;
  theme: 'light' | 'dark';
  
  // Campo volátil (NO debe guardarse en disco)
  isLoading: boolean;
  tempSessionToken: string | null;

  // Acciones
  setUser: (user: { id: string; name: string; email: string }) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

// Store Zustand con Middleware Persist y AsyncStorage
export const useUserSessionStore = create<UserSessionState>()(
  // PASO 1: persist importado y wrapping el store
  persist(
    (set) => ({
      user: null,
      theme: 'dark',
      isLoading: false,
      tempSessionToken: null,

      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      setIsLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, tempSessionToken: null }),
    }),
    {
      name: 'user-session-storage', // Clave única en AsyncStorage

      // PASO 2: AsyncStorage configurado como storage de persist
      storage: createJSONStorage(() => AsyncStorage),

      // PASO 3: partialize excluye correctamente campos volátiles (isLoading, tempSessionToken)
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
      }),

      // PASO 4: onRehydrateStorage ejecutado al arrancar la app
      onRehydrateStorage: (state) => {
        console.log('🔄 Iniciando rehidratación desde AsyncStorage...');
        return (rehydratedState, error) => {
          if (error) {
            console.error('❌ Error durante la rehidratación del store:', error);
          } else {
            console.log('✅ Rehidratación completada exitosamente:', rehydratedState);
          }
        };
      },
    }
  )
);
