// ============================================================
// CUSTOM HOOK — src/hooks/useEquipments.ts
// ============================================================
// Encapsula useQuery de TanStack Query v5 para obtener la lista de equipos del servidor.
// Dominio: DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchEquipments } from '../services/equipmentService';
import { Equipment } from '../types';

export function useEquipments(): UseQueryResult<Equipment[], Error> {
  return useQuery<Equipment[], Error>({
    queryKey: ['equipments'],
    queryFn: fetchEquipments,
    staleTime: 1000 * 60 * 5, // Datos considerados frescos por 5 minutos
  });
}
