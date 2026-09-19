# 🎧 Beat & Light Pro — Proyecto Semana 07: Persistencia Local

Aplicación móvil profesional desarrollada en **React Native + TypeScript** para el dominio **DJ / Sonido y Luces** (*Beat & Light Pro*). Implementa la arquitectura de **Persistencia Local de la Semana 07** integrando **MMKV** para preferencias en tiempo real, **AsyncStorage** para caché offline con fallback y banner de alerta, y **Expo SecureStore** para la protección cifrada de datos sensibles.

---

## 🧠 Cuestionario Teórico de Conocimiento (Rúbrica — 30 pts)

### Q1. Cuándo usar cada storage en una aplicación (10 pts)

> **Escenario**: En una aplicación necesitas guardar: (a) el tema claro/oscuro que el usuario eligió, (b) el listado de últimas transacciones/equipos para mostrar offline, (c) el token JWT de sesión o código de acceso.

* **(a) Tema claro/oscuro → MMKV (`react-native-mmkv`)**:
  * **Justificación**: Es una preferencia de interfaz de usuario no sensible que se consulta en cada renderizado inicial de las pantallas. MMKV funciona de manera **sincrónica** gracias a C++/JSI sin requerir `await`, garantizando que la UI aplique el tema inmediatamente sin parpadeos (*flashes*) de interfaz.
* **(b) Listado para caché offline → AsyncStorage (`@react-native-async-storage/async-storage`)**:
  * **Justificación**: Es una estructura de datos de lista/JSON de tamaño mediano/grande. AsyncStorage es el estándar asíncrono ideal para guardar colecciones de datos en disco sin saturar el llavero cifrado del sistema operativo.
* **(c) Token JWT de sesión / Clave de acceso → Expo SecureStore (`expo-secure-store`)**:
  * **Justificación**: Es información confidencial y altamente sensible. SecureStore almacena y cifra los datos en las bóvedas de seguridad del hardware del sistema operativo (**iOS Keychain** y **Android Keystore**), evitando ataques de inspección de archivos en texto plano.

---

### Q2. Por qué MMKV requiere Build Nativo y no funciona en Expo Go (10 pts)

* **Explicación Técnica**:  
  Las librerías de almacenamiento tradicionales se comunican mediante el *Bridge* asíncrono de React Native (serializando JSON entre JS y Nativo). En cambio, `react-native-mmkv` utiliza **JSI (JavaScript Interface)** y **Nitro Modules**, exponiendo punteros de memoria C++ directa al motor JavaScript (Hermes/V8).
* **Limitación de Expo Go**:  
  Expo Go es una aplicación precompilada con un conjunto cerrado de módulos nativos. Dado que `react-native-mmkv` requiere compilar código C++ nativo dentro del binario de la aplicación, **no se puede ejecutar en Expo Go sin compilar**.
* **Solución**:  
  Se debe generar un build nativo de desarrollo mediante `expo prebuild` ejecutando `pnpm expo run:android` o `pnpm expo run:ios`.

---

### Q3. AsyncStorage vs `useState` para persistencia (10 pts)

* **`useState` (Memoria RAM Volátil)**:  
  Reside en la memoria RAM del proceso de la aplicación. Al cerrar la aplicación o matar el proceso en segundo plano, la memoria RAM asignada se libera por completo y todos los estados almacenados en `useState` se destruyen e inician en sus valores predeterminados al abrir la app nuevamente.
* **AsyncStorage (Sistema de Archivos en Disco)**:  
  Escribe los datos de forma no volátil en el sistema de archivos permanente del almacenamiento interno del dispositivo. Al cerrar y reabrir la app, los datos persisten intactos en disco y son recuperados mediante promesas asíncronas (`getItem`).

---

## 🎯 Dominio Asignado: Beat & Light Pro

* **Dominio**: DJ / Sonido y Luces
* **Entidad (`Equipment`)**: Modelo de equipos profesionales de sonido, iluminación y DJ Gear (Pioneer CDJ, Kits Line Array, Consolas DMX, Robóticas LED).
* **Manejo de Persistencia**:
  * **Preferencias MMKV**: `sortOrder` (Nombre, Precio, Rating), `compactMode` (Vista reducida de tarjetas), `itemsPerPage` (Cantidad de equipos por lote).
  * **Caché AsyncStorage**: Copia de respaldo automática `@cached_equipments_v1` consumida cuando no hay red o la API de equipos falla.
  * **SecureStore**: Almacenamiento cifrado de `blp_operator_access_token` (Token de Operador DJ / Código de Acceso a Consola).

---

## 🏗️ Arquitectura de Persistencia Local (Semana 07)

```text
Screens (src/screens/)
  ├── HomeScreen.tsx         ← Aplica sortOrder MMKV, compactMode y Banner Offline de AsyncStorage
  ├── SettingsScreen.tsx     ← Configuración en tiempo real (MMKV) + Gestión de Token Cifrado (SecureStore)
  ├── CreateScreen.tsx       ← Formulario de creación (Semana 06)
  ├── EditScreen.tsx         ← Formulario de edición (Semana 06)
  └── FavoritesScreen.tsx    ← UI State de Equipos Guardados (Zustand)
       │
       ├──► Custom Hooks (src/hooks/)
       │     ├── usePreferences.ts   ← Instancia MMKV (useMMKVString, useMMKVBoolean, useMMKVNumber)
       │     └── useEquipments.ts    ← TanStack Query v5 + AsyncStorage fallback (isOffline, isFromCache)
       │
       ├──► Services (src/services/)
       │     ├── secureStoreService.ts ← expo-secure-store (saveOperatorToken, getOperatorToken, deleteOperatorToken)
       │     ├── equipmentService.ts   ← Peticiones Axios
       │     └── api.ts                ← Instancia Axios centralizada
       │
       └──► Storage (src/storage/)
             └── mmkv.ts              ← new MMKV({ id: 'beat-light-pro-storage' })
```

---

## 🚀 Cómo ejecutar el proyecto

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Ejecutar Build Nativo (Requerido por MMKV)**:
   ```bash
   # En Android:
   pnpm expo run:android

   # En iOS:
   pnpm expo run:ios
   ```

---

## 📊 Verificación de Tipos TypeScript

Para comprobar que el proyecto cumple al 100% con TypeScript estricto sin errores de compilación:

```bash
npx tsc --noEmit
```
