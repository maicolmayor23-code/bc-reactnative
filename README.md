# 🎧 Beat & Light Pro — Proyecto Semana 08: Autenticación Completa

Aplicación móvil profesional desarrollada en **React Native + TypeScript** para el dominio **DJ / Sonido y Luces** (*Beat & Light Pro*). Implementa una arquitectura de **Autenticación JWT Completa**, estado global con **Zustand + Persist**, persistencia cifrada en hardware mediante **Expo SecureStore**, interceptores HTTP de Axios para **Renovación Automática 401 (Auto-Refresh)** y flujo **OAuth 2.0 con PKCE (Expo AuthSession)**.

---

## 🧠 Cuestionario Teórico de Conocimiento (Rúbrica — 30 pts)

### Q1. Estructura de un JSON Web Token (JWT) (10 pts)

> **Pregunta**: Explica las tres partes de un JWT, su codificación, los claims estándar y por qué una firma digital verifica la integridad pero no cifra la información.

* **Estructura Técnica (Las 3 Partes)**:
  Un JWT es una cadena compuesta por tres partes codificadas en Base64URL separadas por puntos (`.`):
  1. **Header**: Contiene los metadatos del token, especificando el tipo de token (`"typ": "JWT"`) y el algoritmo de firma utilizado (`"alg": "HS256"` o `"RS256"`).
  2. **Payload**: Contiene las declaraciones o *claims* (datos del usuario y de la sesión). Los claims estándar incluyen:
     * `sub` (*Subject*): Identificador único del usuario (ej. ID de base de datos).
     * `exp` (*Expiration Time*): Timestamp Unix de fecha/hora de expiración.
     * `iat` (*Issued At*): Timestamp Unix de emisión del token.
     * Claims personalizados (ej. `email`, `username`, `role`).
  3. **Signature**: Firma digital generada mediante el algoritmo especificado (ej. HMAC-SHA256), aplicando una clave secreta del servidor sobre la concatenación codificada del Header y Payload (`Base64URL(Header) + "." + Base64URL(Payload)`).

* **Diferencia entre Firma y Cifrado (Seguridad Critical)**:
  * **El Payload NO está cifrado**: Cualquier persona o cliente que intercepte un JWT puede decodificar las dos primeras partes utilizando funciones estándar como `atob()` o la librería `jwt-decode`.
  * **La Firma garantiza INTEGRIDAD, no confidencialidad**: La firma evita que un atacante altere el contenido del payload (como cambiar su ID o rol a administrador). Si un atacante modifica un solo carácter del payload en cliente, la firma dejará de coincidir al ser validada en el servidor con la clave secreta. **Por esta razón, NUNCA se deben almacenar contraseñas o secretos en el payload de un JWT.**

---

### Q2. Access Tokens vs. Refresh Tokens (10 pts)

> **Pregunta**: Justifica la estrategia de dual token (duraciones, mitigar robo de sesión), el lugar correcto de almacenamiento y el flujo de renovación automática ante un error 401.

* **Estrategia Dual Token y Duración**:
  * **Access Token (Corta Duración: 15 min – 1h)**: Se envía en el encabezado HTTP `Authorization: Bearer <token>` de cada petición protegida. Al tener un ciclo de vida tan corto, si un token es interceptado en tránsito, el margen de explotación por un atacante es mínimo.
  * **Refresh Token (Larga Duración: 7 – 30 días)**: Token especial utilizado únicamente para comunicarse con el endpoint de renovación (`/auth/refresh`) y obtener un nuevo `accessToken` cuando el anterior vence. Permite mantener al usuario autenticado sin requerir que ingrese sus credenciales constantemente (excelente UX).

* **Estrategia de Almacenamiento Seguro (SecureStore)**:
  * **Prohibido AsyncStorage y MMKV sin cifrar**: `AsyncStorage` y `MMKV` almacenan datos en archivos de texto plano dentro del disco del dispositivo, vulnerables a inspecciones o dispositivos enraizados (*rooted/jailbroken*).
  * **Expo SecureStore (Obligatorio)**: Persiste ambos tokens cifrados utilizando las bóvedas de seguridad del hardware del dispositivo (**iOS Keychain** y **Android Keystore**).

* **Flujo de Renovación Automática (Interceptor 401)**:
  ```text
  Petición API con Bearer <accessToken>
  ↓
  ¿Respuesta 401 Unauthorized?
  ├─ NO ──► Retornar respuesta exitosa
  └─ SÍ ──► Capturar error en Interceptor de Respuesta (Axios)
            ↓
            Obtener refreshToken desde SecureStore
            ↓
            Llamada HTTP POST /auth/refresh
            ├─ Éxito ──► Guardar nuevo accessToken en SecureStore
            │            Reintentar petición original con el nuevo token
            └─ Fallo ──► Limpiar SecureStore (clearTokens)
                         Establecer isAuthenticated = false
                         Redirigir a LoginScreen
  ```

---

### Q3. PKCE en OAuth 2.0 para Aplicaciones Móviles (10 pts)

> **Pregunta**: Explica qué es PKCE (Proof Key for Code Exchange), por qué las apps móviles lo requieren obligatoriamente y la función de `code_verifier` y `code_challenge`.

* **Vulnerabilidad de las Apps Móviles**:
  En el flujo tradicional de OAuth 2.0 (Authorization Code), el servidor espera recibir un `client_secret`. Las aplicaciones web pueden ocultar el `client_secret` en su backend de forma segura. Las aplicaciones móviles **no pueden guardar un `client_secret` de forma segura**, ya que el código binario de la app puede ser descompilado mediante ingeniería inversa.

* **¿Qué es PKCE y cómo funciona?**:
  **PKCE (Proof Key for Code Exchange)** extiende OAuth 2.0 reemplazando el `client_secret` estático con un secreto dinámico generado por cada intento de autenticación en el dispositivo cliente.

* **Componentes del Flujo PKCE**:
  1. `code_verifier`: Una cadena aleatoria criptográficamente segura de alta entropía (generada en la app móvil con `expo-crypto`).
  2. `code_challenge`: El valor derivado aplicando un hash SHA-256 codificado en Base64URL sobre el `code_verifier` (`code_challenge = Base64URL(SHA256(code_verifier))`).

* **Flujo PKCE en 5 Pasos (Expo AuthSession)**:
  1. La app genera el `code_verifier` y calcula su `code_challenge`.
  2. La app abre un navegador seguro (`WebBrowser`) enviando el `code_challenge` al proveedor OAuth.
  3. El usuario autoriza y el proveedor devuelve un `authorization_code` a la URI de redirección (`beatlightpro://`).
  4. La app envía el `authorization_code` junto con el `code_verifier` original al servidor.
  5. El servidor calcula `SHA256(code_verifier)` y verifica que coincida con el `code_challenge` enviado en el paso 1. Si coincide, emite los tokens de acceso.

---

## 🎯 Dominio Asignado: Beat & Light Pro

* **Dominio**: DJ / Sonido y Luces
* **Entidad (`Equipment`)**: Consolas Pioneer CDJ 3000, Sistemas Line Array, Controladoras DMX, Cabezas Robóticas LED.
* **Roles del Dominio**: `Operador DJ`, `Técnico de Iluminación`, `Ingeniero de Sonido`.
* **Manejo de Autenticación & Persistencia**:
  * **Tokens (Cifrado SecureStore)**: `blp_auth_access_token` y `blp_auth_refresh_token`.
  * **Zustand Auth Store (`authStore.ts`)**: Persiste metadatos de usuario (`user`, `isAuthenticated`) mediante `partialize` en disco no volátil. Omite estrictamente los tokens.
  * **Interceptors Axios (`api.ts`)**: Inyecta tokens en cabecera `Authorization: Bearer` y renueva sesión en error 401.

---

## 🗂️ Estructura del Proyecto

```text
bc-reactnative-week-04/
├── app.json                  ← Configuración con scheme: "beatlightpro"
├── package.json              ← jwt-decode, expo-auth-session, expo-crypto
├── App.tsx                   ← Entrypoint con QueryClientProvider y RootNavigator
└── src/
    ├── components/
    │   └── FormField.tsx     ← Componente reusable de input RHF + Zod + Toggle Eye
    ├── navigation/
    │   ├── types.ts          ← Tipado estricto de AuthStackParamList y AppTabParamList
    │   ├── AuthNavigator.tsx ← Stack para LoginScreen y RegisterScreen
    │   ├── AppNavigator.tsx  ← Tab Navigator para área protegida (Home, Ejercicios, Profile)
    │   └── RootNavigator.tsx ← Swtich reactivo (isAuthenticated/isLoading) sin parpadeo
    ├── schemas/
    │   └── authSchema.ts     ← Esquemas Zod (loginSchema, registerSchema con roles)
    ├── screens/
    │   ├── LoginScreen.tsx   ← Formulario RHF + Zod + Credenciales prueba emilys
    │   ├── RegisterScreen.tsx← Registro con RHF + Zod + Selector de roles técnicos
    │   ├── Ejercicio01Screen.tsx ← Demo JWT Auth, SecureStore y /auth/me
    │   ├── Ejercicio02Screen.tsx ← Demo OAuth PKCE con Expo AuthSession
    │   ├── HomeScreen.tsx    ← Catálogo de equipos del dominio
    │   ├── ProfileScreen.tsx ← Perfil del usuario, métricas del dominio y Logout
    │   └── SettingsScreen.tsx← Ajustes MMKV y gestión de sesión
    ├── services/
    │   ├── api.ts            ← Axios centralizado + Interceptor 401 Auto-Refresh
    │   ├── authService.ts    ← Llamadas HTTP a dummyjson.com/auth (login, refresh, me)
    │   └── tokenService.ts   ← Wrapper exclusivo de expo-secure-store
    └── stores/
        └── authStore.ts      ← Zustand Auth Store con persist y partialize
```

---

## 🚀 Cómo ejecutar el proyecto

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Ejecutar servidor de desarrollo / Web**:
   ```bash
   pnpm web
   ```

3. **Ejecutar Build Nativo (Requerido por MMKV / SecureStore)**:
   ```bash
   npx expo prebuild
   pnpm expo run:android # o pnpm expo run:ios
   ```

---

## 📊 Verificación de Tipos TypeScript

```bash
npx tsc --noEmit
```

---

## 📌 Matriz de Trazabilidad 1:1 con la Rúbrica de Evaluación

| Criterio de Rúbrica | Implementación Concreta | Archivo Responsable | Prueba Manual Verificable |
| :--- | :--- | :--- | :--- |
| **🧠 Criterio 1: JWT** | Cuestionario teórico sobre Header, Payload, Signature, claims e integridad. | `README.md` | Lectura de respuestas Q1 en README |
| **🧠 Criterio 2: Access vs Refresh** | Explicación de duraciones, mitigar robos, SecureStore e interceptor 401. | `README.md` | Lectura de respuestas Q2 en README |
| **🧠 Criterio 3: PKCE OAuth** | Explicación de PKCE en móviles, `code_verifier`, `code_challenge` y `expo-crypto`. | `README.md` | Lectura de respuestas Q3 en README |
| **💪 Ejercicio 01: Login JWT** | Login con credenciales `emilys`/`emilyspass` llamando a `dummyjson.com`. | `src/screens/Ejercicio01Screen.tsx` | Pantalla Ejercicio 01 -> Botón 1 Login |
| **💪 Ejercicio 01: SecureStore** | Almacenamiento con `SecureStore.setItemAsync` sin texto plano visible. | `src/services/tokenService.ts` | Indicadores de almacenamiento cifrado en Ejercicio 01 |
| **💪 Ejercicio 01: /auth/me** | Petición `GET /auth/me` con encabezado `Authorization: Bearer <accessToken>`. | `src/services/authService.ts` | Pantalla Ejercicio 01 -> Botón 2 Obtener Perfil |
| **💪 Ejercicio 01: Logout** | Limpieza de tokens con `SecureStore.deleteItemAsync` y reseteo de estado. | `src/screens/Ejercicio01Screen.tsx` | Pantalla Ejercicio 01 -> Botón 3 Logout |
| **💪 Ejercicio 02: Redirect URI** | `makeRedirectUri({ scheme: 'beatlightpro' })` sincronizado con `app.json`. | `src/screens/Ejercicio02Screen.tsx` | Pantalla Ejercicio 02 -> Scheme "beatlightpro" |
| **💪 Ejercicio 02: PKCE Request** | `useAuthRequest` con `usePKCE: true` y scopes del proveedor. | `src/screens/Ejercicio02Screen.tsx` | Pantalla Ejercicio 02 -> Configuración PKCE |
| **💪 Ejercicio 02: promptAsync** | Disparo del navegador web e interceptación del callback de respuesta. | `src/screens/Ejercicio02Screen.tsx` | Pantalla Ejercicio 02 -> Botón Iniciar Sesión OAuth |
| **💪 Ejercicio 02: Cancel/Error** | Manejo explícito de `response.type` ('success', 'cancel', 'error') con feedback. | `src/screens/Ejercicio02Screen.tsx` | Pantalla Ejercicio 02 -> Tarjeta de Feedback PKCE |
| **📦 Producto: useAuthStore** | Store Zustand con `user`, `isAuthenticated`, `login()`, `logout()`, `refreshTokens()`. | `src/stores/authStore.ts` | Login y navegación fluida entre stacks |
| **📦 Producto: Login Screen** | Formulario RHF + Zod (`loginSchema`) con validaciones y manejo de errores. | `src/screens/LoginScreen.tsx` | Formulario de Login con botón rápido "emilys" |
| **📦 Producto: Navegación** | Switch dinámico en `RootNavigator` entre `AuthNavigator` y `AppNavigator`. | `src/navigation/RootNavigator.tsx` | Transición sin parpadeos visuales al cambiar de estado |
| **📦 Producto: Persistencia** | `initializeAuth()` restaura la sesión desde `SecureStore` al reiniciar. | `src/stores/authStore.ts` | Cerrar y reabrir app conservando sesión activa |
| **📦 Producto: Compilación** | Verificación estricta de tipos TypeScript y build nativo. | `package.json` | Ejecución exitosa de `npx tsc --noEmit` |
| **⚠️ Penalización: Storage** | Prohibido guardar tokens en AsyncStorage o MMKV. | `src/services/tokenService.ts` | Verificación de código en `tokenService.ts` |
| **⚠️ Penalización: Texto Plano** | Prohibido mostrar tokens completos en texto plano en la interfaz de usuario. | `src/screens/` | Confirmación en pantallas (se muestran solo estados) |
