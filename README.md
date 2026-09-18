# 🎧 Beat & Light Pro — Proyecto Semana 06: Formularios con React Hook Form + Zod

Aplicación móvil profesional desarrollada en **React Native + TypeScript** para el dominio **DJ / Sonido y Luces** (*Beat & Light Pro*). Implementa la arquitectura oficial de la **Semana 06** integrando **React Hook Form**, esquemas de validación estricta con **Zod**, resolver con **`zodResolver`** y componentes reutilizables (`FormField`), manteniendo **TanStack Query v5** para el estado del servidor (*Server State*) y **Zustand** para el estado de interfaz (*UI State* - Favoritos).

---

## 🧠 Knowledge / Conceptos Teóricos para la Rúbrica

### Q1. Ventaja de `Controller` frente a `register` en React Native

* **¿Por qué `Controller` es indispensable en React Native?**  
  En React web HTML, los elementos `<input>` exponen `ref` nativos directos que `register` de React Hook Form puede enlazar directamente al DOM. En React Native, el componente `<TextInput>` **no expone un `ref` de la misma manera** y sus eventos funcionan de forma distinta (por ejemplo, `onChangeText` entrega directamente la cadena `string` en lugar de un `SyntheticEvent`).  
  El componente `<Controller>` actúa como un adaptador o puente controlado que recibe las props `{ onChange, onBlur, value }` en su render prop y las conecta limpiamente con cualquier componente nativo o personalizado en React Native sin requerir manipular el DOM.

---

### Q2. Validación con Zod y Coerción Numérica (`z.coerce.number()`)

* **¿Por qué se requiere `z.coerce.number()` en React Native?**  
  En React Native, todos los componentes `<TextInput>` gestionan su estado interno en forma de cadenas de texto (`string`), incluso si se especifica `keyboardType="numeric"`. Sin la coerción (`z.coerce`), Zod rechazaría la entrada al esperar un tipo `number` primitivo.  
  `z.coerce.number()` convierte la cadena a número antes de ejecutar las reglas de validación (como `.positive()` o `.min()`), garantizando que la entrada sea parseada y validada correctamente sin fallos de tipo en runtime.

---

### Q3. Inferencia de Tipos (`z.infer<typeof schema>`) vs Interfaces Manuales

* **¿Qué ventajas ofrece `z.infer` frente a escribir una interfaz TypeScript manual?**  
  1. **Principio DRY (Don't Repeat Yourself)**: Evita la duplicación de código al eliminar la necesidad de mantener una interfaz separada que replique los campos y tipos definidos en el esquema.
  2. **Sincronización Automática**: Cualquier cambio o adición de campos en el esquema Zod actualiza automáticamente el tipo de TypeScript en todo el proyecto.
  3. **Garantía en Runtime y Compilación**: Asegura que el tipo de datos verificado durante la ejecución (runtime) y el tipo en tiempo de compilación (TypeScript) estén siempre perfectamente alineados y sincronizados.

---

## 🎯 Dominio Asignado: Beat & Light Pro

* **Dominio**: DJ / Sonido y Luces
* **Modelo de Datos (`Equipment`)**:
  * `name`: `string` — Modelo del equipo (mín. 2 chars, ej. *Pioneer CDJ-3000*, *Kit Line Array 4000W*)
  * `category`: `'DJ Gear' | 'Sonido' | 'Iluminación' | 'Efectos FX'`
  * `subtitle`: `string` — Especificación técnica del equipo (mín. 5 chars)
  * `pricePerDay`: `number` — Tarifa diaria de alquiler en USD (coercionado a número positivo > 0)
  * `availability`: `'Disponible' | 'En Alquiler'`
  * `imageUri`: `string` — URL válida de la fotografía del equipo
  * `rating`: `number` — Calificación del producto (mín. 1.0, máx. 5.0)

---

## 🏗️ Arquitectura de Capas de la Semana 06

```text
Screens (src/screens/)
  ├── HomeScreen.tsx         ← Lista de catálogo consumida con TanStack Query v5
  ├── DetailScreen.tsx       ← Ficha de detalle + Botón de navegación a EditEquipment
  ├── CreateScreen.tsx       ← Formulario de creación (useForm + zodResolver + FormField + useCreateEquipment)
  └── EditScreen.tsx         ← Formulario de edición (useEquipmentById + reset() en useEffect + useUpdateEquipment)
       │
       ▼
Componente Reutilizable (src/components/)
  └── FormField.tsx          ← Componente genérico que encapsula Controller + TextInput + <Text error>
       │
       ▼
Esquemas Zod (src/schemas/)
  └── equipmentSchema.ts    ← z.object con reglas + export type EquipmentFormData = z.infer<typeof equipmentSchema>
       │
       ▼
Custom Hooks (src/hooks/)
  ├── useEquipments.ts       ← Query ['equipments']
  ├── useEquipmentById.ts    ← Query ['equipment', id]
  ├── useCreateEquipment.ts  ← Mutation POST + invalidateQueries(['equipments'])
  └── useUpdateEquipment.ts  ← Mutation PUT + invalidateQueries(['equipments'], ['equipment', id])
       │
       ▼
Service Layer (src/services/)
  ├── api.ts                ← Instancia Axios centralizada con Interceptors y timeout
  └── equipmentService.ts   ← Funciones puras HTTP: fetchEquipments, fetchEquipmentById, createEquipment, updateEquipment
```

---

## 💡 Separación Estricta de Responsabilidades

| Tipo de Estado | Tecnología | Responsabilidad |
| :--- | :--- | :--- |
| **Form State** | **React Hook Form + Zod** | Captura de datos de inputs, validación declarativa, manejo de errores inline y estado `isSubmitting`. |
| **Server State** | **TanStack Query v5** | Peticiones HTTP, reintentos, caché remoto, refetch automático e invalidación en mutaciones (`invalidateQueries`). |
| **UI State** | **Zustand** | Estado global de la interfaz del usuario (`savedItems` en Favoritos). |

---

## 🚀 Cómo ejecutar el proyecto

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Iniciar el servidor de desarrollo Expo**:
   ```bash
   pnpm start
   ```

---

## 📊 Verificación de Tipos TypeScript

Para comprobar que el proyecto cumple al 100% con TypeScript estricto sin errores de compilación:

```bash
npx tsc --noEmit
```

*Resultado obtenido: 0 errores de compilación.*
