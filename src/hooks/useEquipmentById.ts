// ============================================================
// CUSTOM HOOK — src/hooks/useEquipmentById.ts
// ============================================================
// Encapsula useQuery para obtener la información de un equipo por su ID.
// Dominio: DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchEquipmentById } from '../services/equipmentService';
import { Equipment } from '../types';

export function useEquipmentById(id: string): UseQueryResult<Equipment, Error> {
  return useQuery<Equipment, Error>({
    queryKey: ['equipment', id],
    queryFn: () => fetchEquipmentById(id),
    enabled: Boolean(id),
  });
}
