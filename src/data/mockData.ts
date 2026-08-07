// ============================================================
// MOCK DATA — src/data/mockData.ts
// ============================================================
// Datos de ejemplo para tu dominio asignado.
// Reemplaza estos datos con información coherente a tu dominio.
// ============================================================

import { Item } from '../types';

// TODO: Reemplaza los valores por datos reales de tu dominio
// Usa imágenes representativas — puedes usar URLs de picsum.photos
// o incluir imágenes locales en assets/

export const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    name: 'Pioneer DDJ-FLX6',
    category: 'DJ Gear',
    subtitle: 'Controlador DJ de 4 canales con Jog Cutter y Merge FX',
    pricePerDay: 85,
    availability: 'Disponible',
    imageUri: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Kit Line Array EV 3000W',
    category: 'Sonido',
    subtitle: 'Sistema de audio activo profesional con Subwoofer de 18"',
    pricePerDay: 180,
    availability: 'Disponible',
    imageUri: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Cabeza Móvil Beam LED 230W',
    category: 'Iluminación',
    subtitle: 'Luz robótica DMX de alto alcance con gobos y prisma de 8 caras',
    pricePerDay: 50,
    availability: 'Disponible',
    imageUri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Máquina de Humo FX Pro 1500W',
    category: 'Efectos FX',
    subtitle: 'Disparador de niebla densa con LEDs RGB de alta potencia',
    pricePerDay: 40,
    availability: 'En Alquiler',
    imageUri: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    name: 'Sennheiser HD 25 Special Edition',
    category: 'DJ Gear',
    subtitle: 'Audífonos de monitoreo profesional para DJ con máximo aislamiento',
    pricePerDay: 25,
    availability: 'Disponible',
    imageUri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
];
