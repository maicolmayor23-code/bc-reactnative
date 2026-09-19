// ============================================================
// MMKV STORAGE INSTANCE — src/storage/mmkv.ts
// ============================================================
// Instancia global de MMKV para el almacenamiento sincrónico
// de preferencias en el dominio Beat & Light Pro.
// ============================================================

import { MMKV } from 'react-native-mmkv';

/**
 * Instancia global de MMKV respaldada por C++ / JSI.
 */
export const storage = new MMKV({
  id: 'beat-light-pro-storage',
});
