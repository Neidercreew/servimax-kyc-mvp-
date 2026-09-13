# Servimax KYC - MVP Onboarding para tenderos

Este es mi MVP para la prueba técnica de Servimax. Es una app móvil que permite a un tendero registrarse, tomar foto de su cédula, y pasar por un proceso de validación de identidad (KYC) que termina mostrando un resultado con un score.

## Tecnologías que usé

- **Mobile:** React Native + Expo (SDK 57) + TypeScript + React Navigation
- **Backend:** Node.js + Express + TypeScript + Prisma
- **Base de datos:** MySQL

## Arquitectura

Decidí separar todo en mobile + backend en vez de hacer todo desde el celular, principalmente porque:
- No quiero que las credenciales de la base de datos anden expuestas en el código del celular
- Toda la lógica de score y validación queda en un solo lugar
- Si más adelante quiero cambiar el OCR simulado por uno real, solo toco el backend

Mobile (React Native + Expo)
│ HTTPS
▼
Backend (Node.js + Express + TypeScript)
│
├── Prisma ──▶ MySQL
├── Multer (subida de fotos)
├── OCR (simulado)
└── Validación KYC (simulada)


## Estructura de carpetas

servimax-kyc-mvp-/
├── mobile/
│ └── src/
│ ├── screens/ -> cada pantalla del flujo
│ ├── components/ -> ProgressSteps, BackButton, ErrorState
│ ├── navigation/ -> configuración de las rutas
│ └── theme/ -> colores de la marca
├── backend/
│ ├── src/
│ │ ├── config/ -> cliente de prisma
│ │ └── index.ts -> todas las rutas del servidor
│ └── prisma/
│ └── schema.prisma
└── docs/


## Cómo correrlo

### Necesitas tener instalado
- Node.js y npm
- MySQL corriendo en tu máquina
- Expo Go en tu celular (para probarlo en el teléfono)

### 1. Backend

```bash
cd backend
npm install
```

Crea un `.env` (mira `.env.example` para la estructura) con tu conexión a MySQL:

DATABASE_URL="mysql://usuario:contraseña@localhost:3306/servimax_kyc"


Ojo: si tu contraseña tiene algún caracter especial (`?`, `@`, etc.) hay que codificarlo para que la URL no se rompa (por ejemplo `?` se escribe como `%3F`).

Crea la base y corre las migraciones:
```bash
mysql -u root -p -e "CREATE DATABASE servimax_kyc;"
npx prisma migrate dev
```

Y prende el server:
```bash
npm run dev
```
Debería quedar corriendo en `http://localhost:3000`.

### 2. Mobile

```bash
cd mobile
npm install
```

Una cosa importante: el mobile no puede usar `localhost` para hablar con el backend porque cuando lo pruebas en un celular físico, `localhost` apunta al celular mismo, no a tu compu. Por eso toca buscar tu IP local (con `ipconfig` en Windows) y reemplazarla donde aparezca `192.168.1.6` en estos archivos:
- `src/screens/ContactDataScreen.tsx`
- `src/screens/DocumentCaptureScreen.tsx`
- `src/screens/DocumentReviewScreen.tsx`
- `src/screens/ResultScreen.tsx`

Después corre:
```bash
npx expo start
```

Y escaneas el QR con la cámara del celular (tiene que estar en la misma red WiFi que tu compu).

## El flujo de la app

Bienvenida
↓
Datos de contacto (teléfono, email, ciudad)
↓
Captura de documento (frente y reverso, cámara en vivo o desde galería)
↓
OCR simulado (saca nombres, apellidos, número de documento, fecha nacimiento)
↓
Revisión (el usuario puede corregir lo que el OCR "leyó")
↓
Validación KYC simulada (calcula el score)
↓
Resultado (score de 0-100, estado, y las razones)


## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/health` | Chequea que el server esté vivo |
| POST | `/applications` | Crea el registro con los datos de contacto |
| POST | `/applications/:id/documents` | Sube las fotos del documento |
| POST | `/applications/:id/ocr` | Simula la lectura del documento |
| POST | `/applications/:id/validate` | Simula la validación y calcula el score |
| GET | `/applications/:id` | Trae toda la info de una solicitud |

## Qué es real y qué es simulado

La prueba deja explícito que se puede usar un mock en vez de servicios externos reales, así que decidí simular estas dos partes:

**OCR:** no estoy leyendo la imagen de verdad. El endpoint devuelve datos de ejemplo (elegidos al azar de unas opciones que dejé hardcodeadas), con un delay de 2 segundos para que se sienta como que está "procesando". No metí un OCR real porque integrar algo como Tesseract implica bastante trabajo de preprocesar la imagen y armar reglas para extraer cada campo, y no me alcanzaba el tiempo para hacerlo bien.

**Validación KYC:** tampoco consulta ninguna base real. Tiene una probabilidad de 85% de que el "documento" salga válido, y con eso calcula el score.

Todo lo demás (la cámara, la subida de archivos, la base de datos, el cálculo del score) es real y funciona de verdad.

## Cómo calculo el score

| Factor | Puntos |
|---|---:|
| Datos completos | 20 |
| OCR exitoso | 20 |
| Documento válido | 30 |
| Usuario confirma | 15 |
| Sin alertas | 15 |
| **Total** | **100** |

Si el documento sale inválido, el resultado va directo a NOT VALIDATED sin importar los demás puntos (no quería que alguien pudiera "salvarse" solo acumulando puntos en otros lados).

Estados:
- 🟢 VALIDATED
- 🟡 REQUIRES REVIEW
- 🔴 NOT VALIDATED

## Una decisión que tomé y que se sale un poco del enunciado

El enunciado pide nombre y número de documento en el registro inicial, pero decidí no pedirlos ahí porque el OCR ya los va a sacar de la foto un par de pantallas después — no tenía sentido para mí hacer que el usuario escriba algo que el sistema puede leer solo. El formulario inicial solo pide teléfono, email y ciudad.

## Manejo de errores

Las 3 pantallas que dependen de la red (captura/subida de fotos, OCR/revisión, y resultado) muestran una pantalla de error con botón de reintentar si algo falla, y no se pierde lo que el usuario ya había hecho (las fotos, los datos escritos, etc.).

## Seguridad

- Las credenciales de la base de datos solo viven en `backend/.env`, nunca en el mobile
- `.env` está en `.gitignore`
- Dejé un `.env.example` con la estructura, sin valores reales

## Qué haría diferente para producción

- Meter un OCR real
- Conectar un proveedor de KYC real
- Agregar login/autenticación real
- HTTPS y variables de entorno separadas por ambiente
- Definir cuánto tiempo se guardan las fotos de documentos
- Escribir tests

## Video

[link al video]