// ============================================================
// STORE: authStore — src/stores/authStore.ts
// ============================================================
// Tienda Zustand para la gestión global del estado de autenticación.
// Encapsula las acciones de sesión (login, register, logout, refreshTokens, initializeAuth).
// REGLA CRÍTICA DE SEGURIDAD:
// Los tokens (accessToken y refreshToken) se almacenan EXCLUSIVAMENTE en SecureStore.
// Zustand persist utiliza partialize para guardar únicamente el usuario y el estado en disco.
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginPayload, RegisterPayload, UserRole } from '../types';
import { loginApi, refreshApi, getCurrentUserApi } from '../services/authService';
import { saveTokens, getAccessToken, getRefreshToken, clearTokens } from '../services/tokenService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (credentials: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setError: (error: string | null) => set({ error }),

      /**
       * Iniciar Sesión con credenciales.
       * Guarda tokens en SecureStore y establece el estado de usuario.
       */
      login: async (credentials: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          const authData = await loginApi(credentials);
          
          // Guardar tokens cifrados en SecureStore
          await saveTokens(authData.accessToken, authData.refreshToken);

          const userProfile: User = {
            id: authData.id,
            username: authData.username,
            email: authData.email,
            firstName: authData.firstName,
            lastName: authData.lastName,
            image: authData.image,
            role: 'Operador DJ',
            assignedEquipmentsCount: 8,
            activeRentalLicense: 'BLP-PRO-2026-N9',
          };

          set({
            user: userProfile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || 'Usuario o contraseña incorrectos';
          set({ isLoading: false, error: errorMessage, isAuthenticated: false });
          throw new Error(errorMessage);
        }
      },

      /**
       * Registro de nuevo operador en el sistema.
       */
      register: async (data: RegisterPayload) => {
        set({ isLoading: true, error: null });
        try {
          // Simulación de registro + login con la API
          const authData = await loginApi({
            username: 'emilys',
            password: 'emilyspass',
          });

          await saveTokens(authData.accessToken, authData.refreshToken);

          const newUser: User = {
            id: authData.id,
            username: data.username,
            email: data.email,
            role: data.role as UserRole,
            assignedEquipmentsCount: 4,
            activeRentalLicense: 'BLP-STANDARD-2026',
          };

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: any) {
          const errorMessage = err.message || 'Error durante el registro';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      /**
       * Cierra la sesión activa y destruye los tokens de SecureStore.
       */
      logout: async () => {
        set({ isLoading: true });
        try {
          await clearTokens();
        } catch (err) {
          console.error('Error al limpiar SecureStore en logout:', err);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      /**
       * Renueva el accessToken utilizando el refreshToken guardado en SecureStore.
       */
      refreshTokens: async () => {
        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) {
            await get().logout();
            return;
          }

          const newTokens = await refreshApi(refreshToken);
          await saveTokens(newTokens.accessToken, newTokens.refreshToken);
        } catch (err) {
          console.warn('Fallo al refrescar tokens. Cerrando sesión.', err);
          await get().logout();
        }
      },

      /**
       * Rehidratación de la sesión al abrir la aplicación.
       * Verifica la presencia de tokens en SecureStore y valida el perfil con el backend.
       */
      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const accessToken = await getAccessToken();
          const refreshToken = await getRefreshToken();

          if (!accessToken || !refreshToken) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }

          try {
            // Validar token y recuperar datos frescos del usuario
            const currentUser = await getCurrentUserApi(accessToken);
            set({
              user: {
                ...currentUser,
                role: get().user?.role || 'Operador DJ',
                assignedEquipmentsCount: 12,
                activeRentalLicense: 'BLP-PRO-2026-N9',
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (apiErr) {
            // Si falla con 401, intentar renovar con refreshToken
            const newTokens = await refreshApi(refreshToken);
            await saveTokens(newTokens.accessToken, newTokens.refreshToken);
            const currentUser = await getCurrentUserApi(newTokens.accessToken);

            set({
              user: {
                ...currentUser,
                role: get().user?.role || 'Operador DJ',
                assignedEquipmentsCount: 12,
                activeRentalLicense: 'BLP-PRO-2026-N9',
              },
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (err) {
          console.warn('Sesión no válida o token expirado en inicio. Limpiando.', err);
          await clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'beat-light-pro-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // REGLA DE SEGURIDAD: partialize excluye tokens. Únicamente persiste datos no sensibles de usuario.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
