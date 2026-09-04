# 🎧 Beat & Light Pro — Proyecto Semana 05: Networking y TanStack Query v5

Aplicación móvil profesional desarrollada en **React Native + TypeScript** para el dominio **DJ / Sonido y Luces**. Implementa la arquitectura oficial de la **Semana 05** combinando **Axios** e **TanStack Query v5** para la gestión del estado del servidor (*Server State*), junto con **Zustand** exclusivamente para el estado de la interfaz (*UI State* - Favoritos/Guardados).

---

## 🧠 Knowledge / Conceptos Teóricos para la Rúbrica

### Q1. Axios vs Fetch Nativo

* **¿Por qué Axios con `baseURL` evita repetir la URL base?**  
  Con `fetch` nativo, se debe concatenar manualmente la URL completa (`https://api.dominio.com/equipments`) en cada llamada. Axios permite crear una instancia centralizada (`apiClient`) donde se define `baseURL`. De esta manera, cada llamada solo requiere la ruta relativa (`/equipments`), centralizando los cambios de entorno (desarrollo, staging, producción) en una sola variable (`process.env.EXPO_PUBLIC_API_URL`).

* **¿Para qué sirven los Interceptores?**  
  Los interceptores son funciones middleware que se ejecutan automáticamente antes de enviar una solicitud (*Request Interceptor*) o inmediatamente al recibir una respuesta (*Response Interceptor*). Se utilizan principalmente para:
  1. **Adjuntar tokens de autenticación**: Inyectar encabezados `Authorization: Bearer <token>` dinámicamente en cada request.
  2. **Manejar errores HTTP de forma global**: Capturar errores 401 (sesión expirada para redirigir a login), 500 (errores de servidor), y garantizar que la `Promise` sea rechazada correctamente para que TanStack Query capture el estado de error (`isError`).

* **¿Cuándo un `fetch` simple sería suficiente?**  
  Un `fetch` simple es suficiente en scripts aislados de una sola llamada, prototipos de concepto (PoC), o mini-aplicaciones que consumen una única API pública donde no se requiera configuración de `baseURL`, interceptores, manejo global de sesiones ni cancelación por `timeout`.

---

### Q2. `useQuery` en TanStack Query v5

* **¿Qué representa `queryKey`?**  
  La `queryKey` es un identificador único en forma de **arreglo** (ej. `['equipments']` o `['equipment', id]`) que utiliza TanStack Query para gestionar, almacenar en memoria y serializar el caché de la consulta. Permite invalidar, refrescar o compartir datos entre múltiples componentes de forma reactiva.

* **¿Qué función cumple `queryFn`?**  
  Es la función responsable de obtener los datos de la fuente remota. Debe retornar obligatoriamente una **Promise** que resuelva los datos tipados (por ejemplo, llamando a la función pura `fetchEquipments()` del servicio de Axios).

* **Uso de `data`, `isLoading` e `isError`:**  
  - `data`: Contiene el resultado resuelto por la `queryFn` (o `undefined` mientras carga).
  - `isLoading`: Booleano en `true` únicamente durante la carga inicial cuando **no existen datos en caché**.
  - `isError`: Booleano en `true` si la promesa del `queryFn` fue rechazada (ej. error 4xx o 5xx de red), permitiendo renderizar vistas de fallback.

---

### Q3. Invalidación de Caché (`invalidateQueries` vs `setQueryData`)

* **¿Por qué se usa `invalidateQueries` en `onSuccess`?**  
  Tras crear o modificar un recurso mediante `useMutation` (ej. `POST /equipments`), los datos guardados previamente en caché han quedado desactualizados. Al llamar a `queryClient.invalidateQueries({ queryKey: ['equipments'] })` dentro de `onSuccess`, se marca la query como **obsoleta (`stale`)**, lo cual desencadena automáticamente un **refetch en segundo plano** para refrescar la interfaz con los datos reales del servidor sin reiniciar la app.

* **Diferencia clara entre `invalidateQueries` y `setQueryData`:**
  - **`invalidateQueries`**: Invalida la marca de frescura del caché y provoca que TanStack Query realice una nueva petición HTTP GET al servidor para obtener el estado remoto actualizado.
  - **`setQueryData`**: Modifica de manera **síncrona y directa** el contenido del caché local de TanStack Query en el cliente, sin realizar inmediatamente una petición al servidor (utilizado en actualizaciones optimistas).

---

## 🎯 Dominio Asignado
* **Dominio**: DJ / Sonido y luces (Beat & Light Pro)
* **Modelo de Datos (`Equipment`)**:
  * `id`: string — Identificador único del equipo
  * `name`: string — Modelo del equipo (ej. Pioneer CDJ-3000, Kit Line Array 3000W)
  * `category`: `'DJ Gear' | 'Sonido' | 'Iluminación' | 'Efectos FX'`
  * `subtitle`: string — Descripción técnica del equipo
  * `pricePerDay`: number — Tarifa diaria de alquiler en USD
  * `availability`: `'Disponible' | 'En Alquiler'`
  * `imageUri`: string — Fotografía del producto
  * `rating`: number — Calificación (ej. 4.9)

---

## 🏗️ Arquitectura de Capas

```text
Screens (src/screens/)
  ├── HomeScreen.tsx         ← Consume useEquipments() (Lista, Loading, Error, Empty, Pull-to-refresh)
  ├── DetailScreen.tsx       ← Consume useEquipmentById(id) + Zustand (Ficha técnica + Favoritos)
  └── CreateScreen.tsx       ← Formulario con useCreateEquipment() e isPending
       │
       ▼
Custom Hooks (src/hooks/)
  ├── useEquipments.ts       ← Encapsula useQuery (queryKey: ['equipments'])
  ├── useEquipmentById.ts    ← Encapsula useQuery (queryKey: ['equipment', id])
  └── useCreateEquipment.ts  ← Encapsula useMutation e invalidateQueries(['equipments'])
       │
       ▼
TanStack Query v5 (App.tsx)
  └── QueryClientProvider configurado en la raíz con staleTime: 5 min y retry: 2
       │
       ▼
Service Layer (src/services/)
  ├── api.ts                ← Instancia Axios centralizada con timeout: 10s e Interceptors
  └── equipmentService.ts   ← Funciones puras: fetchEquipments, fetchEquipmentById, createEquipment
       │
       ▼
REST API (process.env.EXPO_PUBLIC_API_URL)
  └── GET /equipments, GET /equipments/:id, POST /equipments
```

---

## 💡 Separación Estricta de Estados (Server State vs UI State)

| Tipo de Estado | Tecnología | Responsabilidad |
| :--- | :--- | :--- |
| **Server State** | **TanStack Query v5** | Peticiones HTTP, caché remoto, estado de carga (`isLoading`), refetch (`isFetching`), reintentos e invalidación de caché. |
| **UI State** | **Zustand** | Gestión local de equipos favoritos/guardados por el usuario (`savedItems`, `toggleSaveItem`, `clearSaved`). |

---

## 📊 Verificación de Tipos TypeScript

Para validar que el proyecto cumple con TypeScript estricto sin errores ni uso de `any`:

```bash
npx tsc --noEmit
```

*Resultado esperado: 0 errores de compilación.*
