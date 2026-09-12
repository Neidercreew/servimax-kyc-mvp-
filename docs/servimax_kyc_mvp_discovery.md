# SERVIMAX — MVP KYC PARA TENDEROS
## Documento de descubrimiento, preguntas, decisiones y arquitectura propuesta

> Documento de trabajo previo al desarrollo. Distingue entre requisitos de la prueba técnica y decisiones/ideas propuestas para el MVP.

---

# 1. Contexto del reto

El reto consiste en construir un MVP móvil de onboarding KYC para tenderos: registro → captura del documento → OCR → revisión/corrección → validación externa o mock → resultado/score.

La prueba indica que el MVP no necesita acceso a bases privadas o gubernamentales reales y permite usar una API de validación documentada o un mock. También exige manejo de errores, trazabilidad y seguridad básica.

Fuente: prueba técnica de Servimax.

---

# 2. Cliente final

## ¿Quién usará la aplicación?

El usuario final es el **tendero**, es decir, una persona que busca registrarse como cliente de Servimax.

## Implicación de diseño

La aplicación debe estar pensada para una persona que:

- Puede no tener conocimientos técnicos.
- Puede estar usando la aplicación mientras atiende su negocio.
- Necesita saber siempre en qué paso está.
- Debe recibir instrucciones claras para tomar fotografías.
- No debería tener que escribir información que podamos extraer automáticamente del documento.
- Debe poder corregir información si el OCR se equivoca.
- Debe poder recuperarse de errores sin perder el progreso.

---

# 3. Preguntas que nos hicimos y respuestas

## 3.1 ¿Qué información pedimos inicialmente?

La prueba exige:

- Nombre completo.
- Tipo de documento.
- Número de documento.
- Teléfono.
- Email.
- Ciudad/municipio.

### Decisión de UX

No queremos pedir nombre, número de documento, fecha de nacimiento, etc. mediante múltiples pantallas si esos datos pueden obtenerse del documento mediante OCR.

Por eso el primer formulario se concentrará principalmente en **datos de contacto y ubicación**:

- Teléfono.
- Email.
- Ciudad/municipio.

Los datos que podamos obtener del documento se capturarán posteriormente mediante OCR.

---

## 3.2 ¿Qué documento vamos a recibir?

### Decisión propuesta para el MVP

Soportar inicialmente **Cédula de Ciudadanía colombiana**.

No se recomienda ampliar inicialmente a pasaporte, cédula de extranjería u otros documentos porque aumentaría considerablemente la complejidad del OCR y las reglas de validación.

El tipo de documento puede mantenerse conceptualmente como un campo del sistema, pero el MVP puede limitar la selección a:

> Cédula de ciudadanía.

---

## 3.3 ¿Qué debe hacer el usuario con el documento?

Debe:

1. Preparar el documento.
2. Fotografiar el frente.
3. Fotografiar el reverso.
4. Procesar las imágenes mediante OCR.
5. Revisar los datos extraídos.
6. Corregirlos si es necesario.
7. Confirmarlos.

La aplicación debe explicar visualmente cómo tomar las fotografías para reducir errores.

---

# 4. Flujo de usuario propuesto

```text
BIENVENIDA
    ↓
¿Ya estás registrado?
    ├── SÍ → Login / acceso existente
    │
    └── NO
         ↓
DATOS DE CONTACTO + CIUDAD
         ↓
PREPARAR DOCUMENTO
         ↓
CAPTURAR FRENTE
         ↓
CAPTURAR REVERSO
         ↓
PROCESAMIENTO OCR
         ↓
¿OCR exitoso?
    ├── SÍ → REVISIÓN
    │
    └── NO → REINTENTAR FOTO
              o COMPLETAR INFORMACIÓN MANUALMENTE
         ↓
CONFIRMACIÓN
         ↓
VALIDACIÓN EXTERNA / MOCK KYC
         ↓
SCORE + ESTADO + RAZONES
         ↓
RESULTADO
```

---

# 5. Bienvenida

## Concepto

La primera pantalla debe sentirse como una entrada al ecosistema Servimax.

Propuesta:

**Servimax**

> ¡Bienvenido!

> Registra tu negocio de forma fácil y segura.

Opciones:

- Ya estoy registrado.
- Quiero registrarme.

Si el usuario ya está registrado, el flujo futuro puede llevarlo al inicio de sesión y posteriormente al área de compras.

---

# 6. Registro inicial

## Pantalla: Datos de contacto

No pedir aquí información que el OCR pueda obtener.

Campos principales:

- Teléfono.
- Email.
- Ciudad/municipio.

Opcionalmente, en una futura versión:

- Nombre del negocio.
- Dirección del negocio.
- Barrio/localidad.
- Tipo de negocio.

Estos últimos no forman parte del mínimo obligatorio de la prueba y no deben complicar el MVP.

---

# 7. Preparación del documento

Antes de abrir la cámara:

## Mensaje

**Ahora vamos a verificar tu identidad**

> Toma una foto clara de tu documento. Esto nos permitirá leer automáticamente tu información.

Mostrar una ilustración de una cédula.

Consejos:

- Buena iluminación.
- Documento completo.
- Evitar reflejos.
- No cubrir información.

Botón:

**Comenzar**

---

# 8. Captura del documento

## Frente

Mostrar guía gráfica para posicionar la cédula.

Botón:

**Tomar foto**

También puede existir:

**Subir desde galería**

## Reverso

Repetir el patrón:

**Ahora toma una foto del reverso**

La experiencia debe mostrar feedback inmediato cuando la imagen sea recibida.

---

# 9. OCR

## Objetivo

Convertir las imágenes del documento en información estructurada.

Datos que intentaremos extraer:

- Nombres.
- Apellidos.
- Número de documento.
- Fecha de nacimiento.
- Lugar de nacimiento, si está disponible.
- Lugar de expedición.
- Otros campos que el OCR pueda detectar de manera confiable.

Ejemplo conceptual:

```text
Imagen frente + imagen reverso
             ↓
            OCR
             ↓
{
  nombres,
  apellidos,
  documentNumber,
  birthDate,
  issuePlace
}
```

---

# 10. ¿Qué pasa si el OCR falla?

No debemos obligar al usuario a empezar nuevamente.

Opciones:

### Opción A — Intentar otra fotografía

> No pudimos leer claramente el documento.

**Tomar otra foto**

### Opción B — Completar manualmente

El usuario puede introducir únicamente los campos que no pudieron ser detectados.

Esto evita construir un formulario largo desde el principio.

---

# 11. Revisión de información

Después del OCR:

## Revisar tu información

Mostrar una tarjeta/flashcard con los datos detectados.

Ejemplo:

- Nombre completo: Juan Pérez Gómez.
- Número de documento: 1.023.456.789.
- Fecha de nacimiento: 15/03/1998.
- Lugar de expedición: Bogotá.

Cada campo debe poder editarse.

Opciones:

**Confirmar información**

**Editar**

---

# 12. Comparación de información

Conceptualmente tendremos tres fuentes:

## Fuente 1 — Datos proporcionados por el usuario

Principalmente:

- Teléfono.
- Email.
- Ciudad/municipio.

## Fuente 2 — OCR

- Nombre.
- Documento.
- Fecha de nacimiento.
- Lugar de expedición.
- Otros datos disponibles.

## Fuente 3 — Consulta externa/mock

- Documento válido.
- Coincidencia de nombre.
- Alertas.
- Resultado de validación.

Estas fuentes alimentarán las reglas de decisión.

---

# 13. Consulta externa / Mock KYC

La prueba permite usar una API externa o un mock documentado.

Propuesta de entrada:

```json
{
  "documentType": "CC",
  "documentNumber": "1023456789",
  "fullName": "Juan Pérez Gómez"
}
```

Respuesta conceptual:

```json
{
  "documentValid": true,
  "nameMatch": true,
  "hasAlerts": false,
  "alerts": [],
  "status": "VALIDATED"
}
```

La aplicación debe manejar:

- API disponible.
- Timeout.
- Sin conexión.
- Respuesta incompleta.
- Error inesperado.
- Reintento.

---

# 14. Resultado

Se proponen tres estados:

## 🟢 VALIDATED

Información validada correctamente.

## 🟡 REQUIRES REVIEW

Existe información que requiere revisión adicional.

## 🔴 NOT VALIDATED

La información no pudo ser validada o existe una condición crítica.

El lenguaje visible para el tendero debe ser amigable y no excesivamente técnico.

---

# 15. Score

La prueba permite usar un score de 0–100 con razones visibles.

Propuesta inicial:

| Factor | Puntos |
|---|---:|
| Datos completos | 20 |
| OCR exitoso | 20 |
| Documento coincide | 30 |
| Usuario confirma información | 15 |
| Consulta sin alertas | 15 |
| Total | 100 |

Importante:

El score es una **propuesta para el MVP**, no una regla oficial de Servimax.

También se pueden definir condiciones críticas que prevalezcan sobre la suma.

Ejemplo:

```text
Documento inválido
        ↓
NOT VALIDATED
```

Esto evita aprobar a una persona solo porque acumuló puntos en otros factores.

---

# 16. Dashboard del score

La idea propuesta:

- Rueda/círculo de progreso.
- Número en el centro.
- Progreso visual de 0 a 100.
- Verde para resultados positivos.
- Amarillo para revisión.
- Rojo para resultados negativos.
- Debajo: explicación del resultado.

Ejemplo:

```text
        ╭────────╮
      ╱            ╲
     │      94      │
      ╲            ╱
        ╰────────╯

       VALIDATED

✓ Documento validado
✓ Información confirmada
✓ Sin alertas
```

La visualización debe ser atractiva pero sencilla.

---

# 17. Identidad visual

La aplicación existente Servimax Tenderos fue tomada como referencia visual por el equipo.

## Dirección propuesta

Explorar una identidad basada en:

- Blanco.
- Verde como color principal o secundario.
- Logo de Servimax.
- Mucho espacio visual.
- Tarjetas redondeadas.
- Botones grandes.
- Iconografía sencilla.
- Animaciones suaves.
- Ilustraciones explicativas.

### Futurismo

El concepto futurista debe ser moderado:

**Retail moderno + fintech + Servimax**

Evitar:

- Exceso de neón.
- Fondos excesivamente oscuros.
- Animaciones pesadas.
- Interfaces demasiado complejas.

El objetivo es que parezca moderna sin dejar de parecer una aplicación confiable para tenderos.

---

# 18. Principios UX

## Una acción principal por pantalla

Evitar formularios gigantes.

## Progreso visible

Ejemplo:

```text
✓ Contacto
✓ Documento
● Verificación
○ Resultado
```

## Lenguaje humano

Evitar:

- "Ejecutar OCR".
- "Consulta KYC".
- "Score engine".

Usar:

- "Estamos leyendo tu documento."
- "Revisa tu información."
- "Estamos validando tus datos."
- "Tu registro fue validado."

## Feedback

Toda operación debe mostrar qué está ocurriendo.

## Recuperación

Los errores no deben borrar el trabajo.

## Accesibilidad

- Texto suficientemente grande.
- Alto contraste.
- Botones fáciles de tocar.
- Instrucciones visuales.
- Pocas acciones simultáneas.

---

# 19. Funcionalidades futuras: cuenta y contraseña

Esta idea queda fuera del flujo KYC principal y se considera una posible mejora si queda tiempo.

Propuesta:

Después del registro/validación, el usuario podría:

1. Confirmar su email.
2. Crear una contraseña.
3. Tener una cuenta.
4. Iniciar sesión posteriormente.
5. Llegar al ecosistema de compras de Servimax.

Flujo futuro:

```text
REGISTRO KYC
     ↓
VALIDACIÓN
     ↓
CREAR CONTRASEÑA
     ↓
CUENTA SERVIMAX
     ↓
LOGIN
     ↓
ÁREA DE COMPRAS
```

### Prioridad

**No debe afectar el MVP KYC.**

Primero se debe completar y demostrar:

Registro → documento → OCR → revisión → validación → resultado.

Después, si queda tiempo, se implementa autenticación.

---

# 20. Arquitectura propuesta

## Recomendación

Arquitectura de tres capas:

```text
┌─────────────────────────────┐
│       MOBILE APP            │
│ React Native + Expo         │
│ TypeScript                  │
└──────────────┬──────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────┐
│       BACKEND / API         │
│ Node.js + TypeScript        │
│                             │
│ Orquestación KYC            │
│ OCR                         │
│ Validación                  │
│ Score                       │
│ Manejo de errores           │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│ OCR Service │  │ Mock KYC API  │
└─────────────┘  └──────────────┘
```

La prueba sugiere React Native + Expo + TypeScript para móvil y una capa backend/API para orquestación, OCR, KYC y persistencia. También indica que las claves y secretos no deben quedar en el móvil.

---

# 21. ¿Por qué backend?

Aunque el MVP podría intentar hacer muchas cosas directamente desde el móvil, separar el backend tiene ventajas:

- Las API keys no quedan expuestas.
- La lógica del score está centralizada.
- La lógica de validación queda separada de la UI.
- Podemos cambiar el proveedor de OCR.
- Podemos cambiar el mock KYC por una API real posteriormente.
- Es más fácil explicar la arquitectura en la entrevista.
- Facilita auditoría y trazabilidad.

---

# 22. Arquitectura lógica del backend

Propuesta:

```text
Mobile
  ↓
POST /applications
  ↓
Application Service
  ↓
Document Service
  ↓
OCR Service
  ↓
Verification Service
  ↓
KYC Service
  ↓
Decision / Score Service
  ↓
Result
```

Posibles endpoints:

```text
POST /applications
POST /applications/:id/documents
POST /applications/:id/ocr
PUT  /applications/:id/verification
POST /applications/:id/validate
GET  /applications/:id/result
```

No es necesario implementar todos inmediatamente. Son una propuesta arquitectónica.

---

# 23. Persistencia

Para el MVP se debe mantener al mínimo.

Podemos guardar conceptualmente:

- ID de solicitud.
- Datos de contacto.
- Datos OCR.
- Datos confirmados.
- Resultado KYC.
- Score.
- Razones.
- Timestamp.
- Estado del proceso.

Las imágenes de documentos deberían evitarse o almacenarse solo si realmente son necesarias y con una política clara de retención.

---

# 24. Seguridad

Requisitos importantes:

- No poner API keys en React Native.
- Usar variables de entorno.
- Crear `.env.example`.
- No subir secretos a GitHub.
- No imprimir datos sensibles en logs.
- Evitar almacenar documentos innecesariamente.
- Documentar tratamiento/retención de datos.
- Usar HTTPS en una implementación real.
- Separar credenciales de desarrollo y producción.

---

# 25. Trazabilidad

Cada solicitud debería poder responder:

> ¿Qué ocurrió con este usuario?

Debemos poder reconstruir:

```text
Usuario
 ↓
Datos iniciales
 ↓
Documento recibido
 ↓
OCR
 ↓
Datos extraídos
 ↓
Correcciones
 ↓
Confirmación
 ↓
Consulta externa
 ↓
Alertas
 ↓
Score
 ↓
Resultado
```

Esto también conecta directamente con el requerimiento de resultado explicable/auditable de la prueba.

---

# 26. Requisitos funcionales principales

| ID | Requisito |
|---|---|
| RF01 | Mostrar bienvenida |
| RF02 | Permitir identificar si el usuario ya está registrado |
| RF03 | Registrar teléfono |
| RF04 | Registrar email |
| RF05 | Registrar ciudad/municipio |
| RF06 | Seleccionar/soportar tipo de documento |
| RF07 | Capturar frente |
| RF08 | Capturar reverso |
| RF09 | Permitir subir imágenes |
| RF10 | Procesar OCR |
| RF11 | Mostrar datos extraídos |
| RF12 | Permitir editar datos |
| RF13 | Confirmar información |
| RF14 | Ejecutar validación externa/mock |
| RF15 | Manejar errores de validación |
| RF16 | Calcular score |
| RF17 | Determinar estado |
| RF18 | Mostrar razones |
| RF19 | Permitir reintentos |
| RF20 | Mantener progreso |

---

# 27. Requisitos no funcionales

| ID | Requisito |
|---|---|
| RNF01 | Interfaz fácil de entender |
| RNF02 | Diseño consistente con Servimax |
| RNF03 | Interfaz usable para usuarios no técnicos |
| RNF04 | Alto contraste |
| RNF05 | Botones grandes |
| RNF06 | Feedback visual |
| RNF07 | Manejo de errores sin pérdida de progreso |
| RNF08 | Separación frontend/backend |
| RNF09 | Protección de secretos |
| RNF10 | Código modular |
| RNF11 | Documentación clara |
| RNF12 | Trazabilidad del proceso |

---

# 28. Priorización del MVP

## MUST HAVE

1. Bienvenida.
2. Datos de contacto.
3. Ciudad/municipio.
4. Captura/subida de documento.
5. Frente y reverso.
6. OCR.
7. Revisión/corrección.
8. Mock/API de validación.
9. Estados.
10. Score.
11. Razones.
12. Manejo de errores.
13. GitHub.
14. README.
15. `.env.example`.
16. Video de demostración.

## SHOULD HAVE

- Animaciones.
- Ilustraciones.
- Persistencia del progreso.
- Excelente experiencia visual.
- Mock KYC más realista.

## COULD HAVE

- Crear contraseña.
- Login.
- PDF/JSON/CSV.
- Dashboard de métricas.
- Tests.
- Swagger.
- Docker.
- CI/CD.

## WON'T HAVE inicialmente

- Sistema completo de compras.
- Integración real con bases gubernamentales.
- Sistema productivo de autenticación.
- Arquitectura empresarial completa.
- Múltiples tipos de documento.

---

# 29. Sprint único

## Sprint Goal

> Construir un MVP móvil de onboarding KYC para tenderos que permita registrar datos de contacto, capturar y procesar una cédula, revisar la información obtenida, ejecutar una validación y mostrar un resultado explicable.

## Sprint Backlog

### US01 — Bienvenida
Como tendero quiero identificar si ya estoy registrado para continuar por el flujo correspondiente.

### US02 — Datos de contacto
Como tendero quiero registrar mi teléfono, email y ciudad para iniciar el proceso.

### US03 — Captura de documento
Como tendero quiero recibir instrucciones y capturar el frente y reverso de mi cédula.

### US04 — OCR
Como tendero quiero que la aplicación lea automáticamente la información de mi documento.

### US05 — Revisión
Como tendero quiero revisar y corregir los datos detectados antes de confirmarlos.

### US06 — Validación
Como sistema quiero consultar un servicio externo/mock para validar la información.

### US07 — Resultado
Como tendero quiero conocer el resultado, score y razones de la validación.

### US08 — Recuperación
Como tendero quiero poder reintentar operaciones que fallaron sin perder mis datos.

---

# 30. Definition of Done

El sprint se considera terminado cuando:

- El flujo completo funciona.
- El usuario puede registrarse.
- Puede capturar/subir documento.
- Se procesa OCR.
- Puede revisar/corregir información.
- Se ejecuta una validación.
- Se calcula/muestra score.
- Se muestra estado y razones.
- Los errores principales tienen recuperación.
- No existen secretos en el repositorio.
- Existe `.env.example`.
- El README explica instalación, arquitectura y ejecución.
- Existe evidencia/video del flujo.

---

# 31. Preguntas pendientes antes de programar

Estas son las decisiones que todavía debemos cerrar:

1. ¿Cuál proveedor de OCR vamos a utilizar?
2. ¿El OCR será real o simulado para el MVP?
3. ¿Qué backend exacto utilizaremos?
4. ¿Qué base de datos utilizaremos, si realmente necesitamos una?
5. ¿Cómo será exactamente el mock KYC?
6. ¿Qué reglas definitivas tendrá el score?
7. ¿Qué condiciones serán bloqueantes?
8. ¿Qué información exacta devolverá el OCR?
9. ¿Cómo vamos a manejar imágenes sin almacenar documentos innecesariamente?
10. ¿Qué pantallas exactas tendrá la app?
11. ¿Qué componentes visuales reutilizables vamos a crear?
12. ¿Cómo implementaremos el login si queda tiempo?
13. ¿Qué parte de la experiencia será real y qué parte será mock?

---

# 32. Principio general del proyecto

La decisión central del diseño es:

> **No hacer que el tendero haga trabajo que el sistema puede hacer automáticamente.**

El usuario aporta:

**Contacto + ubicación + documento.**

El sistema hace:

**OCR + extracción + comparación + validación + score.**

El usuario solamente interviene cuando necesita:

**revisar, corregir y confirmar.**

Esto reduce fricción, aprovecha el OCR y mantiene el flujo alineado con el objetivo del reto.

---

# 33. Próximo paso recomendado

Antes de escribir código:

1. Definir las pantallas definitivas.
2. Definir qué contiene cada pantalla.
3. Definir el modelo de datos.
4. Definir las reglas del score.
5. Elegir OCR.
6. Elegir backend.
7. Elegir persistencia.
8. Definir estructura de carpetas.
9. Crear el proyecto.
10. Empezar el Sprint Backlog técnicamente.

