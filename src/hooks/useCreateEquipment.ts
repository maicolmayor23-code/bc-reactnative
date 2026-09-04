// ============================================================
// CUSTOM HOOK — src/hooks/useCreateEquipment.ts
// ============================================================
// Encapsula useMutation de TanStack Query v5 para registrar un nuevo equipo
// e invalidar el caché ['equipments'] en el callback onSuccess.
// Dominio: DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createEquipment } from '../services/equipmentService';
import { Equipment, CreateEquipmentPayload } from '../types';

export function useCreateEquipment(): UseMutationResult<Equipment, Error, CreateEquipmentPayload> {
  const queryClient = useQueryClient();

  return useMutation<Equipment, Error, CreateEquipmentPayload>({
    mutationFn: createEquipment,
    onSuccess: () => {
      // Invalida la query 'equipments' para marcarla como stale y disparar el refetch automático en HomeScreen
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
    },
  });
}
