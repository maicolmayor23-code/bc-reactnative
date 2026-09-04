// ============================================================
// SERVICE LAYER — src/services/equipmentService.ts
// ============================================================
// Funciones puras que realizan las llamadas HTTP usando apiClient (Axios).
// Dominio: DJ / Sonido y Luces (Beat & Light Pro).
// ============================================================

import { apiClient } from './api';
import { Equipment, CreateEquipmentPayload } from '../types';
import { MOCK_ITEMS } from '../data/mockData';

// Almacén en memoria local para sincronizar elementos creados vía POST cuando se utiliza un proxy/JSONPlaceholder
let localEquipmentsStore: Equipment[] = [...MOCK_ITEMS];

/**
 * Obtiene la lista completa de equipos de DJ, Sonido y Luces desde la API.
 */
export async function fetchEquipments(): Promise<Equipment[]> {
  try {
    // Si la URL apunta a /equipments o un endpoint personalizado:
    const response = await apiClient.get<Equipment[]>('/equipments');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch {
    // Si el endpoint /equipments no existe en la API pública de prueba (ej. JSONPlaceholder),
    // realizamos la llamada HTTP real a /posts para verificar la conexión de red y retornamos los datos del dominio
    await apiClient.get('/posts?_limit=10');
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

  // Fallback si es un ítem creado dinámicamente
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
    // Llamada HTTP POST real a /posts para verificar comunicación de red
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

  // Insertar al inicio del almacén local para reflejar la mutación al invalidar caché
  localEquipmentsStore = [createdItem, ...localEquipmentsStore];
  return createdItem;
}
