# 🎧 Beat & Light Pro — Proyecto Semana 04: Estado Global con Zustand

Aplicación móvil profesional desarrollada en **React Native + TypeScript** para el dominio **DJ / Sonido y luces**. Cuenta con una arquitectura de navegación con **React Navigation 7** (Tab + Stack Navigator anidado) e integración de **Estado Global con Zustand** para gestionar los equipos guardados/favoritos en tiempo real entre pantallas.

---

## 📋 Descripción del Dominio

**Beat & Light Pro** es un sistema de gestión y reserva de equipos profesionales de audio, iluminación y efectos especiales para producciones de eventos.

* **Dominio Asignado**: DJ / Sonido y luces
* **Campos del Item**:
  * `id`: Identificador único (string)
  * `name`: Nombre del equipo / modelo (ej. Pioneer DDJ-FLX6, Kit Line Array EV 3000W)
  * `category`: Categoría (`DJ Gear`, `Sonido`, `Iluminación`, `Efectos FX`)
  * `subtitle`: Descripción técnica resumida
  * `pricePerDay`: Precio diario de alquiler en USD
  * `availability`: Estado de inventario (`Disponible` | `En Alquiler`)
  * `imageUri`: Fotografía del producto
  * `rating`: Calificación del equipo (ej. 4.9 / 5.0)

---

## ✨ Características Implementadas (Semana 04 — Zustand)

1. **Store Global Zustand (`src/stores/savedStore.ts`)**:
   - Creado mediante la función `create<SavedEquipmentStore>()` con TypeScript estricto y cero `any`.
   - Estado `savedItems: Item[]` compartido entre todas las pestañas de la aplicación.
   - Acciones tipadas: `toggleSaveItem`, `removeItem` y `clearSaved`.

2. **Badge Dinámico en Tiempo Real (Tab Bar)**:
   - Configurado en `RootNavigator.tsx` leyendo la cantidad de elementos directamente desde el store con un selector optimizado: `useSavedStore(state => state.savedItems.length)`.
   - Muestra el número exacto de ítems guardados en la pestaña **Favoritos** de forma reactiva (sin *prop drilling*).

3. **Acciones Interactivas en Detalle (`DetailScreen.tsx`)**:
   - Incorpora el botón `"⭐ Guardar en Mis Equipos"` / `"❤️ En Mis Equipos (Quitar)"` conectado al store global.
   - Permite agregar o remover el equipo del estado global en tiempo real.

4. **Gestión de Lista en Segunda Pestaña (`FavoritesScreen.tsx`)**:
   - Consume el store global `savedItems` mediante selectores optimizados.
   - Incluye botón de acción global `"🗑️ Limpiar Todo"` invocando `clearSaved()`.
   - Renderiza un *Empty State* adaptado cuando la lista de producción está vacía.

5. **Guardado Rápido en Tarjeta (`ItemCard.tsx`)**:
   - Ícono flotante de favorito que permite alternar el estado del equipo directamente desde la lista del catálogo.

6. **Cumplimiento de Buenas Prácticas**:
   - Uso obligatorio de **selectores específicos** (`useSavedStore(state => state.property)`) para evitar re-renders innecesarios.
   - TypeScript estricto validado sin errores.

---

## 🗂️ Estructura del Proyecto

```text
bc-reactnative-week-02/
├── App.tsx                    ← NavigationContainer raíz
├── app.json                   ← Configuración de Expo
├── package.json               ← Dependencias (React Navigation 7, Zustand 5.0)
├── tsconfig.json              ← Configuración TypeScript estricta
├── README.md                  ← Documentación actualizada
└── src/
    ├── stores/
    │   └── savedStore.ts      ← Store Zustand (savedItems, toggleSaveItem, clearSaved)
    ├── navigation/
    │   ├── RootNavigator.tsx  ← Tab Navigator con Badge dinámico de Zustand
    │   └── types.ts           ← Tipado estricto de navegación
    ├── screens/
    │   ├── HomeScreen.tsx     ← Catálogo con FlatList y TextInput (HomeList)
    │   ├── DetailScreen.tsx   ← Ficha técnica con botón Guardar/Quitar (HomeDetail)
    │   └── FavoritesScreen.tsx← Pestaña de guardados alimentada por Zustand
    ├── components/
    │   └── ItemCard.tsx       ← Tarjeta reutilizable con botón rápido de favorito
    ├── data/
    │   └── mockData.ts        ← 10 items reales de DJ, Sonido y Luces
    ├── theme/
    │   └── index.ts           ← Sistema de diseño centralizado
    └── types/
        └── index.ts           ← Interfaz e ItemTypes del dominio
```

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar Metro Bundler con Expo CLI
pnpm start

# 3. Seleccionar simulador en la terminal de Expo:
# Presionar 'a' para Android Emulator
# Presionar 'i' para iOS Simulator
# Presionar 'w' para Web
```

---

## 📊 Verificación de Tipos TypeScript

Para validar que el código cumple con TypeScript estricto y no contiene errores de tipos ni `any`:

```bash
npx tsc --noEmit
```
