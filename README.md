# 🎧 Beat & Light Pro — Proyecto Semana 03: React Navigation 7

Aplicación móvil profesional desarrollada en **React Native + TypeScript** para el dominio **DJ / Sonido y luces**. Cuenta con una arquitectura de navegación completa usando **React Navigation 7** con **Tab Navigator** y **Stack Navigator anidado**, permitiendo explorar, filtrar, ver el detalle técnico y gestionar equipos favoritos para eventos y producciones espectaculares.

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

## ✨ Características Implementadas (Semana 03 — React Navigation 7)

1. **Tab Navigator Raíz (`RootNavigator.tsx`)**:
   - Barra de navegación inferior con dos pestañas principales: **Inicio** (`HomeTab`) y **Favoritos** (`FavoritesTab`).
   - Íconos vectoriales dinámicos usando `@expo/vector-icons` (`Ionicons`: `disc` / `disc-outline` para Inicio, `heart` / `heart-outline` para Favoritos).
   - Estilizado de pestañas activas con la propiedad `tabBarActiveTintColor: '#61DAFB'` (según especificación).

2. **Stack Navigator Anidado (`HomeStackNavigator`)**:
   - Pila de pantallas dentro de la pestaña principal que gestiona el flujo de **Lista (`HomeList`) → Detalle (`HomeDetail`)**.
   - Encabezado nativo personalizado con colores acordes al tema nocturno/cyberpunk (`#161b22`).
   - Botón automático de retroceso (`goBack`) y títulos dinámicos con el nombre del equipo seleccionado.

3. **Paso y Recepción de Parámetros Tipados**:
   - Navegación estricta desde `HomeScreen` enviando los parámetros `{ id: item.id, name: item.name }`.
   - Lectura de parámetros en `DetailScreen` mediante `useRoute<RouteProp<HomeStackParamList, 'HomeDetail'>>()`.
   - Cero uso de `any`, 100% compliant con TypeScript estricto.

4. **Pantalla de Detalle (`DetailScreen.tsx`)**:
   - Muestra la ficha técnica completa del equipo (fotografía en alta resolución, badges de categoría y disponibilidad, valoración en estrellas, precio diario de alquiler).
   - Desglose de especificaciones técnicas (SKU, uso recomendado, cableado y transporte incluido).
   - Botón interactivo de solicitud de reserva según el estado de inventario.

5. **Pantalla de Favoritos (`FavoritesScreen.tsx`)**:
   - Renderiza un `FlatList` con los equipos destacados / favoritos del catálogo (rating >= 4.9).
   - Permite navegar directamente al detalle de cualquier equipo favorito.

6. **Herencia de Optimizaciones (Semana 02)**:
   - Virtualización con `FlatList` (`keyExtractor`, `ItemSeparatorComponent`, `ListEmptyComponent`).
   - Filtrado reactivo en tiempo real con `useMemo` y `useCallback`.
   - Envoltura con `KeyboardAvoidingView` y descarte accesible del teclado.
   - Sistema de Theming centralizado (`src/theme/index.ts`).

---

## 🗂️ Estructura del Proyecto

```text
bc-reactnative-week-02/
├── App.tsx                    ← NavigationContainer raíz
├── app.json                   ← Configuración de Expo
├── package.json               ← Dependencias exactas (React Navigation 7, @expo/vector-icons)
├── tsconfig.json              ← Configuración TypeScript estricta
├── README.md                  ← Documentación del proyecto
└── src/
    ├── navigation/
    │   ├── RootNavigator.tsx  ← Tab Navigator + Stack Navigator anidado
    │   └── types.ts           ← RootTabParamList y HomeStackParamList (sin any)
    ├── screens/
    │   ├── HomeScreen.tsx     ← Lista de equipos con FlatList + TextInput (HomeList)
    │   ├── DetailScreen.tsx   ← Ficha técnica con params del Stack (HomeDetail)
    │   └── FavoritesScreen.tsx← Segunda pestaña con ítems favoritos (FavoritesTab)
    ├── components/
    │   └── ItemCard.tsx       ← Tarjeta reutilizable estilizada con theme
    ├── data/
    │   └── mockData.ts        ← 10 items reales de DJ, Sonido y Luces
    ├── theme/
    │   └── index.ts           ← Sistema de diseño (COLORS, TYPOGRAPHY, SPACING)
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

Para validar que todo el código cumple con TypeScript estricto y no contiene errores de tipos ni `any`:

```bash
npx tsc --noEmit
```
