// ============================================================
// HOOK: usePreferences — src/hooks/usePreferences.ts
// ============================================================
// Encapsula las preferencias del usuario persistidas en disco mediante MMKV.
// Proporciona estado reactivo sincrónico para ordenamiento, vista compacta y paginación.
// ============================================================

import { useMMKVString, useMMKVBoolean, useMMKVNumber } from 'react-native-mmkv';
import { storage } from '../storage/mmkv';

export type SortOption = 'name' | 'price' | 'rating';

const KEYS = {
  SORT_ORDER: 'pref_sortOrder',
  COMPACT_MODE: 'pref_compactMode',
  ITEMS_PER_PAGE: 'pref_itemsPerPage',
} as const;

export function usePreferences() {
  const [rawSortOrder, setRawSortOrder] = useMMKVString(KEYS.SORT_ORDER, storage);
  const [compactMode, setCompactMode] = useMMKVBoolean(KEYS.COMPACT_MODE, storage);
  const [itemsPerPage, setItemsPerPage] = useMMKVNumber(KEYS.ITEMS_PER_PAGE, storage);

  const sortOrder: SortOption = (rawSortOrder as SortOption) ?? 'name';

  const setSortOrder = (newSort: SortOption) => {
    setRawSortOrder(newSort);
  };

  return {
    sortOrder,
    setSortOrder,
    compactMode: compactMode ?? false,
    setCompactMode: (val: boolean) => setCompactMode(val),
    itemsPerPage: itemsPerPage ?? 10,
    setItemsPerPage: (val: number) => setItemsPerPage(val),
  };
}
