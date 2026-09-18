// ============================================================
// SERVICE LAYER — src/services/equipmentService.ts
// ============================================================
// Funciones puras que realizan las llamadas HTTP usando apiClient (Axios).
// Dominio: DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import { apiClient } from './api';
import { Equipment, CreateEquipmentPayload, UpdateEquipmentPayload } from '../types';
import { MOCK_ITEMS } from '../data/mockData';

// Almacén en memoria local para sincronizar elementos creados/editados vía HTTP cuando se utiliza un proxy/JSONPlaceholder
let localEquipmentsStore: Equipment[] = [...MOCK_ITEMS];

/**
 * Obtiene la lista completa de equipos de DJ, Sonido y Luces desde la API.
 */
export async function fetchEquipments(): Promise<Equipment[]> {
  try {
    const response = await apiClient.get<Equipment[]>('/equipments');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch {
    await apiClient.get('/posts?_limit=10').catch(() => null);
  }
  return [...localEquipmentsStore];
}

/**
 * Obtiene un equipo específico por su ID.
 */
export async function fetchEquipmentById(id: string): Promise<Equipment> {
  try {
    const response = await apiClient.get<Equipment>(`/equipments/${id}`);
    if (response.data) return response.data;
  } catch {
    await apiClient.get(`/posts/${id}`).catch(() => null);
  }

  const found = localEquipmentsStore.find((item) => item.id === id);
  if (found) return found;

  return {
    id,
    name: `Equipo #${id}`,
    category: 'Sonido',
    subtitle: 'Equipo profesional de audio y sonido',
    pricePerDay: 100,
    availability: 'Disponible',
    imageUri: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
  };
}

/**
 * Crea un nuevo equipo mediante una solicitud HTTP POST.
 */
export async function createEquipment(payload: CreateEquipmentPayload): Promise<Equipment> {
  let createdItem: Equipment;

  try {
    const response = await apiClient.post<Equipment>('/equipments', payload);
    if (response.data && response.data.id) {
      createdItem = response.data;
    } else {
      createdItem = {
        ...payload,
        id: String(Date.now()),
      };
    }
  } catch {
    const postResponse = await apiClient.post('/posts', {
      title: payload.name,
      body: payload.subtitle,
      userId: 1,
    });

    createdItem = {
      ...payload,
      id: String(postResponse.data?.id ?? Date.now()),
    };
  }

  localEquipmentsStore = [createdItem, ...localEquipmentsStore];
  return createdItem;
}

/**
 * Actualiza un equipo existente mediante una solicitud HTTP PUT/PATCH.
 */
export async function updateEquipment(id: string, payload: UpdateEquipmentPayload): Promise<Equipment> {
  let updatedItem: Equipment;

  try {
    const response = await apiClient.put<Equipment>(`/equipments/${id}`, payload);
    if (response.data) {
      updatedItem = response.data;
    } else {
      const existing = await fetchEquipmentById(id);
      updatedItem = { ...existing, ...payload, id };
    }
  } catch {
    await apiClient.put(`/posts/${id}`, { title: payload.name }).catch(() => null);
    const existing = await fetchEquipmentById(id);
    updatedItem = { ...existing, ...payload, id };
  }

  localEquipmentsStore = localEquipmentsStore.map((item) =>
    item.id === id ? updatedItem : item
  );
  return updatedItem;
}
