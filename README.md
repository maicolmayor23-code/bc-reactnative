# 🎧 Beat & Light Pro — Proyecto Semana 02

Aplicación móvil desarrollada en **React Native + TypeScript** para el dominio **DJ / Sonido y luces**. Permite listar, explorar y filtrar en tiempo real el catálogo de equipos para eventos, conciertos y discotecas.

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
  * `rating`: Calificación del equipo

---

## ✨ Características Técnicas e Implementadas

1. **Virtualización de Listas (`FlatList`)**:
   - Reemplazo completo de `ScrollView` por `FlatList` para optimizar el rendimiento y memoria.
   - Uso obligatorio de `keyExtractor={(item) => item.id}` con IDs únicos.
   - `ItemSeparatorComponent` para espaciado visual consistente.

2. **Búsqueda en Tiempo Real (`TextInput`)**:
   - Campo de entrada filtrable por nombre, categoría o especificaciones técnicas.
   - Botón interactivo de limpieza rápida del texto de búsqueda (`✕`).

3. **Optimizaciones de Rendimiento (`useMemo` & `useCallback`)**:
   - `useMemo` para la lógica de filtrado reactivo del catálogo.
   - `useCallback` para la función `renderItem`, `keyExtractor`, `ItemSeparatorComponent` y `ListEmptyComponent`, evitando re-renderizados innecesarios.

4. **Manejo Accesible del Teclado (`KeyboardAvoidingView`)**:
   - Envoltura con `KeyboardAvoidingView` diferenciando comportamiento por plataforma (`behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`).
   - Ocultamiento suave del teclado al presionar fuera de los campos con `TouchableWithoutFeedback` + `Keyboard.dismiss()`.

5. **Estado Vacío Personalizado (`ListEmptyComponent`)**:
   - Mensaje informativo e ilustrativo cuando la búsqueda no coincide con ningún producto.
   - Botón directo "Limpiar búsqueda" para restablecer el catálogo.

6. **Sistema de Theming Centralizado (`src/theme/index.ts`)**:
   - Ausencia total de valores hardcodeados de estilo. Todos los componentes consumen `COLORS`, `TYPOGRAPHY` y `SPACING`.
   - Paleta estética nocturna/cyberpunk acorde al ámbito de luces y discotecas.

7. **TypeScript Estricto**:
   - Cumplimiento 100% de tipado sin uso de `any`.

---

## 🗂️ Estructura del Proyecto

```text
starter/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── types/
    │   └── index.ts        ← Interfaz e ItemTypes del dominio
    ├── theme/
    │   └── index.ts        ← Sistema de diseño (COLORS, TYPOGRAPHY, SPACING)
    ├── data/
    │   └── mockData.ts     ← 10 items reales de DJ, Sonido y Luces
    ├── components/
    │   └── ItemCard.tsx    ← Tarjeta reutilizable estilizada con theme
    └── screens/
        └── HomeScreen.tsx  ← Pantalla principal con FlatList + TextInput
```

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar Metro Bundler
pnpm start

# 3. Ejecutar en Android / iOS
pnpm android # O pnpm ios
```
