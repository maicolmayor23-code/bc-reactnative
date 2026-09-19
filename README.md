# 🎧 Beat & Light Pro — Proyecto Semana 09: Animaciones Básicas

Aplicación móvil profesional desarrollada en **React Native + TypeScript** para el dominio **DJ / Sonido y Luces** (*Beat & Light Pro*). Implementa la suite completa de animaciones fluidas con **`Animated API`** y **`LayoutAnimation`** ejecutadas en el hilo nativo de UI a 60 FPS.

---

## 🧠 Cuestionario Teórico de Conocimiento (Rúbrica — 30 pts)

### Q1. Animated.Value y el Hilo de UI Nativo (`useNativeDriver`) (10 pts)

> **Pregunta**: Explica por qué las animaciones de React Native corren en el hilo nativo de UI y por qué es fundamental usar `useNativeDriver: true` para no bloquear el hilo de JavaScript.

* **Arquitectura de Hilos en React Native**:
  En React Native coexisten dos hilos principales de ejecución:
  1. **JavaScript Thread**: Encargado de la lógica de negocio, manejo de estado (`useState`, `Zustand`), ciclo de vida de React, renderizado y peticiones de red (`Axios`, `Fetch`).
  2. **UI Native Thread (Main/UI Thread)**: Encargado de calcular el diseño de pantalla (Yoga), procesar gestos del usuario y pintar los fotogramas (*frames*) en pantalla a 60/120 FPS.

* **El Problema del Bloqueo en JS**:
  Si una animación calcula sus valores de fotograma dentro del hilo de JavaScript, cualquier operación pesada (como parsear un JSON voluminoso, ejecutar peticiones HTTP o re-renderizar componentes complejos) congelará el hilo de JS, provocando caídas severas de cuadros (*frame drops*) y la sensación de una interfaz "trabada".

* **La Solución: `useNativeDriver: true`**:
  Al configurar `useNativeDriver: true` al definir una animación (`Animated.timing`, `Animated.spring`), React Native **serializa toda la estructura de la animación hacia el hilo nativo** antes de iniciarla. Una vez enviada, el hilo nativo ejecuta la animación en la GPU/CPU nativa (iOS Keychain/CoreAnimation y Android RenderThread) sin depender en absoluto del hilo de JavaScript durante cada fotograma.
  
* **Regla de Uso**:
  * `useNativeDriver: true`: Obligatorio para transformaciones de opacidad (`opacity`) y geometría (`scale`, `translateY`, `translateX`, `rotate`).
  * `useNativeDriver: false`: Requerido únicamente para propiedades no soportadas por el driver nativo (propiedades de layout y color como `width`, `height`, `top`, `left`, `backgroundColor`).

---

### Q2. Distinción de Animaciones: `timing` vs `spring` vs `decay` (10 pts)

> **Pregunta**: Distingue cuándo utilizar cada tipo de animación en el dominio móvil y cuáles son sus parámetros clave de configuración.

| Tipo de Animación | Propósito y Caso de Uso Ideal | Parámetros Clave de Configuración |
| :--- | :--- | :--- |
| **`Animated.timing`** | Animaciones lineales o con curvas de desaceleración controladas por tiempo fijo. Ideal para fade in/out, transiciones de pantalla o deslices con duración precisa. | • `toValue`: Valor objetivo.<br>• `duration`: Tiempo en milisegundos.<br>• `easing`: Curva de aceleración (Bézier, Easing.linear, Easing.ease).<br>• `useNativeDriver: boolean`. |
| **`Animated.spring`** | Animaciones basadas en física de resortes y amortiguación. Ideal para feedback táctil en botones/cards, elementos que rebotan o tarjetas que se comprimen y se expanden. | • `toValue`: Valor objetivo.<br>• `tension`: Rigidez del resorte (mayor valor = movimiento más rápido).<br>• `friction`: Amortiguación (menor valor = mayor rebote).<br>• `bounciness` / `speed`: Control alternativo de rebote y velocidad. |
| **`Animated.decay`** | Animaciones de desaceleración gradual basadas en una velocidad inicial. Ideal para listas con inercia, tiradas de rueda de vinilo DJ o deslizamientos libres. | • `velocity`: Velocidad inicial del movimiento.<br>• `deceleration`: Factor de desaceleración gradual (default 0.997). |

---

### Q3. Interpolación y Control de Rango (`interpolate`) (10 pts)

> **Pregunta**: Explica la función de `interpolate`, los rangos de entrada/salida y el propósito de `extrapolate: 'clamp'`.

* **Función de `interpolate`**:
  `interpolate` mapea un rango de entrada numérico (`inputRange`) a un rango de salida (`outputRange`) que puede contener valores no numéricos, como cadenas con unidades (grados `'0deg' -> '360deg'`, porcentajes `'0%' -> '100%'`) o códigos de color hexadecimales (`'#ef4444' -> '#22c55e'`). Esto permite que un único `Animated.Value` controle múltiples propiedades visuales al mismo tiempo.

* **Propósito de `extrapolate: 'clamp'`**:
  Por defecto, React Native utiliza la extrapolación `'extend'`, lo que significa que si el `Animated.Value` sobrepasa los límites de `inputRange`, el valor de salida continuará creciendo o decreciendo proporcionalmente.
  * `extrapolate: 'clamp'`: **Restringe estrictamente** el valor de salida a los límites establecidos en `outputRange`, impidiendo que los valores se salgan del rango deseado incluso si el valor animado supera los extremos de `inputRange`.

---

## 🎯 Dominio Asignado: Beat & Light Pro

* **Dominio**: DJ / Sonido y Luces
* **Entidades Animadas**: Consolas Pioneer CDJ 3000, Sistemas Line Array, Controladoras DMX, Cabezas Robóticas LED, Vinilos DJ, Vúmetros de Señal Audio RMS.

---

## 🗂️ Requisitos Funcionales Implementados (Semana 09)

1. **Animación de entrada en `DetailScreen`** (`src/screens/DetailScreen.tsx`):
   * Al navegar a la pantalla de detalle, el contenido aparece suavemente con `Animated.parallel`.
   * `opacity`: 0 → 1
   * `translateY`: 30 → 0
   * Duración: 500ms, `useNativeDriver: true`.

2. **Feedback táctil en `AnimatedCard`** (`src/components/AnimatedCard.tsx` / `EquipmentCard.tsx`):
   * Cada tarjeta de la lista de equipos se comprime al presionar con `Animated.spring` para un efecto natural con rebote.
   * `scale`: 1 → 0.95 (`onPressIn`)
   * `scale`: 0.95 → 1 con rebote (`onPressOut`)

3. **Barra de progreso en `ProgressBar`** (`src/components/ProgressBar.tsx`):
   * Muestra el porcentaje de equipos disponibles en inventario de forma animada con `interpolate`.
   * `width`: `'0%'` → `'100%'`
   * `backgroundColor`: `#ef4444` (Rojo) → `#facc15` (Amarillo) → `#22c55e` (Verde)
   * Usa `useNativeDriver: false` para propiedades de layout y color.

4. **Entrada en cascada en `HomeScreen`** (`src/screens/HomeScreen.tsx`):
   * Los elementos de la lista principal de equipos aparecen en cascada al cargar usando `Animated.stagger(80, [...])`.

5. **LayoutAnimation al agregar / eliminar items** (`src/screens/HomeScreen.tsx`):
   * Al simular la adición o eliminación de un equipo, el cambio en la lista se anima suavemente con `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)`.
   * Incluye la habilitación explícita para Android `UIManager.setLayoutAnimationEnabledExperimental?.(true)` fuera del componente.

---

## 🚀 Cómo ejecutar el proyecto

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Ejecutar servidor de desarrollo / Web**:
   ```bash
   pnpm start # o pnpm web
   ```

3. **Verificación de Tipos TypeScript**:
   ```bash
   npx tsc --noEmit
   ```

---

## 📌 Matriz de Trazabilidad 1:1 con la Rúbrica de Evaluación

| Criterio de Rúbrica | Implementación Concreta | Archivo Responsable | Prueba Manual Verificable |
| :--- | :--- | :--- | :--- |
| **🧠 Criterio 1: Hilo UI** | Respuesta teórica Q1 sobre `Animated.Value` y `useNativeDriver`. | `README.md` | Lectura de respuesta Q1 |
| **🧠 Criterio 2: timing/spring** | Respuesta teórica Q2 sobre `timing`, `spring`, `decay` y parámetros. | `README.md` | Lectura de respuesta Q2 |
| **🧠 Criterio 3: interpolate** | Respuesta teórica Q3 sobre `inputRange`, `outputRange` y `clamp`. | `README.md` | Lectura de respuesta Q3 |
| **💪 Ejercicio 01: timing/spring** | Fade in/out (`opacity` 0→1→0) y tap spring en botón CUE. | `src/exercises/Ejercicio01.tsx` | Pestaña Ejercicios -> Ejercicio 01 Botones 1 y 2 |
| **💪 Ejercicio 01: parallel/sequence**| Animación simultánea (fade+slide) y secuencia FX en ráfaga. | `src/exercises/Ejercicio01.tsx` | Pestaña Ejercicios -> Ejercicio 01 Botones 3 y 4 |
| **💪 Ejercicio 02: Rotación** | Rotación animada de vinilo DJ con `interpolate` (0°→360°). | `src/exercises/Ejercicio02.tsx` | Pestaña Ejercicios -> Ejercicio 02 Botón 1 Vinilo |
| **💪 Ejercicio 02: Color & Progress**| Progress bar animada con color interpolado (verde → amarillo → rojo). | `src/exercises/Ejercicio02.tsx` | Pestaña Ejercicios -> Ejercicio 02 Botón 2 Potencia |
| **💪 Ejercicio 02: Stagger** | Entrada en cascada de canales DMX con `Animated.stagger(80, ...)`. | `src/exercises/Ejercicio02.tsx` | Pestaña Ejercicios -> Ejercicio 02 Botón 3 Cascada |
| **📦 Producto: Entrada HomeScreen** | Carga en cascada stagger al montar la lista principal. | `src/screens/HomeScreen.tsx` | Abrir HomeScreen -> Animación de entrada |
| **📦 Producto: Feedback Tap Cards** | `AnimatedCard` / `EquipmentCard` con escala spring en tap. | `src/components/EquipmentCard.tsx` | Presionar cualquier tarjeta de equipo |
| **📦 Producto: ProgressBar** | Barra de progreso animada con el % de disponibilidad del stock. | `src/components/ProgressBar.tsx` | Ver cabecera de HomeScreen |
| **📦 Producto: LayoutAnimation** | Animación suave al agregar o eliminar equipos de la lista. | `src/screens/HomeScreen.tsx` | Presionar "Agregar" o "Eliminar" en HomeScreen |
| **📦 Producto: Entrada DetailScreen** | `Animated.parallel` (fade in + slide up en 500ms) al navegar. | `src/screens/DetailScreen.tsx` | Presionar un equipo -> Entrada en DetailScreen |
| **📦 Producto: Compilación** | Verificación estricta de TypeScript sin errores. | `package.json` | Ejecución exitosa de `npx tsc --noEmit` |
