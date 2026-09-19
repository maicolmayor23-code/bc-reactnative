// ============================================================
// MOCK DATA — src/data/mockData.ts
// ============================================================
// Catálogo completo de equipos para el dominio DJ / Sonido e Iluminación (10+ items).
// Conectado con las imágenes locales almacenadas en src/assets/.
// ============================================================

import { Item } from '../types';

export const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    name: 'Pioneer DDJ-FLX6',
    category: 'DJ Gear',
    subtitle: 'Controlador DJ de 4 canales con Jog Cutter y Merge FX',
    pricePerDay: 85,
    availability: 'Disponible',
    imageUri: require('../assets/Pioneer DDJ-FLX6.png'),
  },
  {
    id: '2',
    name: 'Kit Line Array EV 3000W',
    category: 'Sonido',
    subtitle: 'Sistema de audio activo profesional con Subwoofer de 18"',
    pricePerDay: 180,
    availability: 'Disponible',
    imageUri: require('../assets/Kit Line Array EV 3000W.png'),
  },
  {
    id: '3',
    name: 'Cabeza Móvil Beam LED 230W',
    category: 'Iluminación',
    subtitle: 'Luz robótica DMX de alto alcance con gobos y prisma de 8 caras',
    pricePerDay: 50,
    availability: 'Disponible',
    imageUri: require('../assets/Cabeza Móvil Beam LED 230W.png'),
  },
  {
    id: '4',
    name: 'Máquina de Humo FX Pro 1500W',
    category: 'Efectos FX',
    subtitle: 'Disparador de niebla densa con LEDs RGB de alta potencia',
    pricePerDay: 40,
    availability: 'En Alquiler',
    imageUri: require('../assets/Máquina de Humo FX Pro 1500W.png'),
  },
  {
    id: '5',
    name: 'Sennheiser HD 25 Special Edition',
    category: 'DJ Gear',
    subtitle: 'Audífonos de monitoreo profesional para DJ con máximo aislamiento',
    pricePerDay: 25,
    availability: 'Disponible',
    imageUri: require('../assets/Sennheiser HD 25 Special Edition.png'),
  },
  {
    id: '6',
    name: 'Behringer X32 Compact',
    category: 'Sonido',
    subtitle: 'Consola de mezcla digital de 40 entradas y 25 buses con faders motorizados',
    pricePerDay: 130,
    availability: 'Disponible',
    imageUri: require('../assets/Behringer X32 Compact.png'),
  },
  {
    id: '7',
    name: 'Láser Robótico RGB 3W DMX',
    category: 'Iluminación',
    subtitle: 'Proyector láser show profesional con más de 100 patrones programados',
    pricePerDay: 70,
    availability: 'En Alquiler',
    imageUri: require('../assets/Láser Robótico RGB 3W DMX.png'),
  },
  {
    id: '8',
    name: 'JBL EON715 1300W',
    category: 'Sonido',
    subtitle: 'Altavoz amplificado de 15 pulgadas con Bluetooth y DSP avanzado',
    pricePerDay: 45,
    availability: 'Disponible',
    imageUri: require('../assets/JBL EON715 1300W.png'),
  },
  {
    id: '9',
    name: 'Shure BLX24/SM58',
    category: 'Sonido',
    subtitle: 'Sistema de micrófono inalámbrico de mano profesional de largo alcance',
    pricePerDay: 35,
    availability: 'Disponible',
    imageUri: require('../assets/Shure BLX24.png'),
  },
  {
    id: '10',
    name: 'Chauvet ShowXpress DMX',
    category: 'Iluminación',
    subtitle: 'Controlador de iluminación USB/DMX con software de programación en vivo',
    pricePerDay: 30,
    availability: 'Disponible',
    imageUri: require('../assets/Chauvet ShowXpress DMX.png'),
  },
];
