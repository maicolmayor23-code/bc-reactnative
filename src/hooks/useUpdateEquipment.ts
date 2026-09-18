// ============================================================
// CUSTOM HOOK — src/hooks/useUpdateEquipment.ts
// ============================================================
// Encapsula useMutation de TanStack Query v5 para actualizar un equipo existente
// e invalidar los cachés ['equipments'] y ['equipment', id] en onSuccess.
// Dominio: DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateEquipment } from '../services/equipmentService';
import { Equipment, UpdateEquipmentPayload } from '../types';

interface UpdateParams {
  id: string;
  data: UpdateEquipmentPayload;
}

export function useUpdateEquipment(): UseMutationResult<Equipment, Error, UpdateParams> {
  const queryClient = useQueryClient();

  return useMutation<Equipment, Error, UpdateParams>({
    mutationFn: ({ id, data }: UpdateParams) => updateEquipment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
      queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] });
    },
  });
}
