// ============================================================
// HOOK: useEquipments — src/hooks/useEquipments.ts
// ============================================================
// Encapsula TanStack Query v5 + AsyncStorage para brindar soporte de caché offline
// y fallback cuando la red o la API no están disponibles.
// Dominio: DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchEquipments } from '../services/equipmentService';
import { Equipment } from '../types';

const CACHE_KEY = '@cached_equipments_v1';

export interface UseEquipmentsResult {
  data: Equipment[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
  isOffline: boolean;
  isFromCache: boolean;
}

export function useEquipments(): UseEquipmentsResult {
  const [isFromCache, setIsFromCache] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const query = useQuery<Equipment[], Error>({
    queryKey: ['equipments'],
    queryFn: async () => {
      try {
        const remoteData = await fetchEquipments();
        // Guardar copia de respaldo en AsyncStorage al completar exitosamente
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(remoteData));
        setIsFromCache(false);
        setIsOffline(false);
        return remoteData;
      } catch (err) {
        // En caso de fallo de red, intentar cargar desde el caché local de AsyncStorage
        const cachedJson = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedJson) {
          const cachedData = JSON.parse(cachedJson) as Equipment[];
          setIsFromCache(true);
          setIsOffline(true);
          return cachedData;
        }
        setIsOffline(true);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
    isOffline,
    isFromCache,
  };
}
