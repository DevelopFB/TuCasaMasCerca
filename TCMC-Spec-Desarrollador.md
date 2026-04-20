# Tu Casa +Cerca (TCMC) - Especificacion Tecnica para Desarrollo
**Version:** 2.0 — Abril 2026
**Ultima actualizacion:** 2026-04-10

---

## 1. Resumen del Producto

Plataforma fintech de micro-hipotecas para originacion, gestion de legajos y seguimiento de cobranzas. **No transaccional** (no realiza cobros, pagos ni transferencias reales).

**Mockup funcional:** `index.html` — React 18 SPA con todos los flujos, roles, paneles y logica financiera implementados como prototipo interactivo.

**Objetivo:** El desarrollador debe convertir este mockup en una aplicacion productiva con backend real, manteniendo la UX/UI y logica de negocio tal como estan implementadas.

---

## 2. Stack Recomendado (ver tambien Doc Tecnico MVP original)

| Capa | Tecnologia | Notas |
|------|-----------|-------|
| Frontend | Next.js (App Router) o React + Vite | Replicar componentes del mockup |
| Backend | Next.js API Routes o Node/Express | REST API |
| Base de datos | PostgreSQL via Prisma | SQLite para dev local |
| Autenticacion | JWT + cookie HttpOnly | bcrypt para passwords |
| Storage | S3/Supabase Storage | Documentos, comprobantes |
| Emails | SendGrid o Resend | Ver seccion 10 (Triggers) |
| Hosting | Vercel / Railway / Supabase | |

---

## 3. Roles y Permisos (RBAC)

| Rol | Codigo | Acceso |
|-----|--------|--------|
| Super Admin | `super_admin` | Todo: usuarios, oficinas, legajos, pipeline, cobranzas, **legajos finalizados**, reportes, config |
| Admin Red | `red_admin` | Legajos, pipeline, cobranzas, **legajos finalizados**, reportes (filtrado por red) |
| Jefe Oficina | `oficina_admin` | Dashboard, clientes, pipeline, reportes (filtrado por oficina) |
| Agente | `agente` | Dashboard, mis clientes, pipeline (solo sus clientes) |
| Cliente | `cliente` | Simulador, nueva solicitud, mi solicitud, mis pagos, soporte |

### Jerarquia de datos
```
Red (ej: Coldwell Bankers)
  └── Oficina (ej: CB Palermo)
       └── Agente (ej: Maria Rodriguez)
            └── Cliente/Legajo
```

Cada rol ve solo los datos de su nivel jerarquico hacia abajo.

---

## 4. Modelo de Datos

### 4.1 Entidades principales

**User / Profile**
```
id, email, passwordHash, nombre, apellido, rol, redId, oficinaId, estado (activo|pendiente), createdAt
```

**Red**
```
id, nombre, estado
```

**Oficina**
```
id, nombre, redId, direccion, estado
```

**Application (Legajo/Prestamo)**
```
id, nombre, apellido, email, phone, dni
propertyLink, propertyAddress, propertyCode, propertyValue, offeredValue
loanAmount, months, status, stage, createdAt, lastUpdate
advisor, agenteId, oficinaId
fechaEscritura (date, se completa al finalizar)
escrituraDoc (nullable — carga post-finalizacion)
hipotecaDoc (nullable — carga post-finalizacion)
ingresosAnuales, hasCodeudor, codeudorNombre, codeudorApellido, codeudorDni, codeudorVinculo, codeudorIngresosAnuales
documents[], observations[], payments[]
rejectionMessage, rejectionDate (si rechazado)
```

**Document (dentro del legajo)**
```
name, status (Pendiente|Aprobado|Observado|No aplica), date, storagePath
```

**Observation**
```
date, text, by (quien la agrego)
```

**Payment (Cuota)**
```
number, dueDate, amount, status (Pendiente|Pagado|Informado|Vencido)
pagoInfo: { fecha, monto, banco, comprobante }
comprobante, comprobanteDate
```

**Notification**
```
id, type (new_request|stage_change|info_request|payment_due)
title, message, loanId
destinatarios[] (profileIds o roles)
channel (popup|email|both)
createdAt, read (boolean)
```

**SimulatorConfig**
```
tasasBase: { 12: 0.105, 24: 0.115, 36: 0.125, 48: 0.135, 60: 0.145 }
maxLTV: 0.35 (35%)
maxLoan: 50000 (USD)
isActive, createdAt
```

---

## 5. Workflow de Solicitud

### Etapas (configurables por Admin)
```
Solicitud Inicial → Scoring → Pre Aprobacion → Escribania → Aprobacion → Escritura → Finalizado
                                                                                    → Rechazado (desde cualquier etapa)
```

### Acciones por etapa
- **Cualquier etapa:** Admin puede agregar observaciones, cambiar etapa, rechazar con motivo
- **Finalizado:** Requiere fecha de escritura. Genera automaticamente cronograma de pagos (ver seccion 7)
- **Rechazado:** Requiere motivo de rechazo (texto obligatorio)

### Registro de cambios
Cada cambio de etapa se registra en `ApplicationStageHistory`:
```
stageId, changedAt, changedById
```

---

## 6. Flujo del Cliente

1. **Simulador** — Calcula cuota, monto bruto, LTV, costo implicito
2. **Nueva Solicitud** — Wizard de 4 pasos:
   - Step 1: Verificacion identidad (DNI frente/dorso, domicilio, comprobante)
   - Step 2: Datos del credito (link propiedad CB, **direccion del inmueble**, valores, monto, plazo, asesor)
   - Step 3: Ingresos y codeudor (opcional)
   - Step 4: Aceptacion de terminos
3. **Mi Solicitud** — Ver estado actual, etapa, documentos, timeline
4. **Mis Pagos** — Ver cronograma, subir comprobantes de pago
5. **Soporte** — Formulario de contacto

---

## 7. Logica Financiera (Algoritmos)

### Monto bruto
```javascript
upfront = prestamo * 0.05
iva = upfront * 0.21
bruto = prestamo + upfront + iva
```

### Cuota mensual (PMT)
```javascript
tm = tasaAnual / 12
cuota = bruto * (tm * (1 + tm)^n) / ((1 + tm)^n - 1)
```

### Costo implicito anual (TIR aproximado)
```javascript
td = (cuota * meses) / prestamo - 1
costo = (1 + td)^(12/meses) - 1
```

### Generacion de cronograma de pagos
Al finalizar un legajo (stage = Finalizado + fechaEscritura):
```javascript
generatePaymentSchedule(loanAmount, months, fechaEscritura, tasaAnual)
// Genera array de cuotas: { number, dueDate, amount, status: 'Pendiente' }
// Primera cuota: mes siguiente a fechaEscritura
// Cada cuota vence el mismo dia del mes
```

### Maximo permitido
```javascript
maxAllow = min(maxLoan, floor(propertyValue * maxLTV))
```

---

## 8. Paneles de Administracion

### 8.1 Dashboard
- Total clientes, volumen total, aprobados (incluye Escritura + Finalizado), en proceso
- Distribucion por etapa (grilla visual)

### 8.2 Gestion de Usuarios (super_admin)
- Tabla con busqueda y filtros por rol/estado
- Aprobar/rechazar usuarios pendientes
- Cambio de rol y asignacion de oficina
- Bulk import de agentes via CSV

### 8.3 Gestion de Oficinas (super_admin)
- CRUD de oficinas: crear, editar, activar/desactivar
- Asociar a red

### 8.4 Gestion de Legajos (red_admin + super_admin)
- Tabla con filtros por nombre, apellido, stage
- Columnas: Nombre, Inmueble, V. Publicado, V. Ofertado, Monto Solicitado, Etapa (con **colores diferenciados por stage**), Asesor, Fecha Inicio
- Click en fila abre modal detallado (max-w-5xl) con:
  - Datos del cliente y propiedad (incluye **direccion del inmueble**)
  - Informacion financiera y codeudor
  - Documentos con estados
  - Cambio de etapa (con campos condicionales: fecha escritura para Finalizado, motivo para Rechazado)
  - Observaciones (agregar + historial)

**Colores por stage:**
| Stage | Color |
|-------|-------|
| Solicitud Inicial | slate |
| Scoring | amber |
| Pre Aprobacion | blue |
| Escribania | purple |
| Aprobacion | indigo |
| Escritura | cyan |
| Finalizado | green |
| Rechazado | red |

### 8.5 Pipeline (todos los admin)
- Vista tipo kanban/funnel por etapa

### 8.6 Cobranzas (red_admin + super_admin)
- Matriz agrupada por ano-mes
- Columnas: Ano, Mes, Cant. Total, Monto Total, Pagadas, Monto Pagado, Informadas, Pendientes, Vencidas, % Cobro
- Filtro por ano
- Drill-down: click en fila expande cuotas individuales con opcion de registrar pago
- Registro de pago: fecha, monto, banco, comprobante
- Export CSV y Excel

### 8.7 Legajos Finalizados (red_admin + super_admin) — NUEVO

**Panel estilo Cobranzas** con tabla de legajos finalizados y sus estados de pago.

**Columnas:**
| Columna | Descripcion | Alineacion |
|---------|-------------|------------|
| Tomador | Nombre completo del cliente | izq |
| Dir. Inmueble | Direccion de la propiedad | izq |
| Monto Tomado | Monto del prestamo (USD) | der |
| Valor de Compra | Valor ofertado/compra (USD) | der |
| Total Cuotas (Q) | Cantidad total de cuotas | der |
| Total Cuotas (USD) | Suma total en USD | der |
| Cuotas Pend. (Q) | Cantidad de cuotas no pagadas | der |
| Cuotas Pend. (USD) | Suma de cuotas pendientes | der |
| Estado | Al dia / Atraso <=5d / Atraso >5d | centro |

**Funcionalidades:**
- **Sort:** Click en cualquier header de columna alterna asc/desc
- **Filtro texto:** Busca por nombre del tomador o direccion del inmueble
- **Filtro estado:** Dropdown (Todos / Al dia / Atraso <=5 dias / Atraso >5 dias)
- **Export:** CSV y Excel (.xlsx)
- **Click en fila:** Abre modal CRM completo (ver 8.8)

**Logica de estado:**
```javascript
// Cuotas vencidas = cuotas no pagadas cuya fecha de vencimiento ya paso
vencidas = payments.filter(p => p.status !== 'Pagado' && new Date(p.dueDate) < today)
if (vencidas.length === 0) → "Al dia" (verde)
if (maxDiasAtraso <= 5) → "Atraso Xd" (amber)
if (maxDiasAtraso > 5) → "Atraso Xd" (rojo)
```

### 8.8 Modal CRM del Legajo (desde Legajos Finalizados) — NUEVO

Modal amplio (max-w-5xl) con 6 secciones:

**Seccion 1: Datos del Cliente**
- Nombre completo, DNI, Email, Telefono, Asesor, Fecha de inicio

**Seccion 2: Datos del Inmueble**
- Direccion, Valor de compra, Valor publicado, LTV calculado, Link propiedad

**Seccion 3: Datos del Prestamo**
- Monto tomado, Plazo, Cuota mensual, Tasa anual, Fecha de escritura, Monto bruto

**Seccion 4: Documentos + Post-Finalizacion**
- Lista de documentos del legajo con estados
- **Carga de Escritura:** Boton para subir documento de escritura (puede ser dias despues de finalizar)
- **Carga de Hipoteca:** Boton para subir documento de hipoteca (puede ser dias despues de finalizar)
- Ambos muestran estado "Cargada" con fecha cuando ya estan subidos

**Seccion 5: Historial de Pagos**
- Tabla: Cuota# | Vencimiento | Monto | Estado | Info de pago
- Estados con colores: Pagado (verde), Informado (azul), Vencido (rojo), Pendiente (gris)

**Seccion 6: Observaciones**
- Textarea para agregar nuevas observaciones
- Historial de observaciones anteriores

### 8.9 Reportes (todos los admin)
- Pipeline por etapa: cantidad, volumen, ticket promedio, dias promedio
- Performance agentes: oficina, clientes, volumen, finalizados, rechazados, tasa conversion
- Resumen financiero: volumen total, cobranza, morosidad
- Export a Excel

### 8.10 ABM Formulario de Credito (super_admin) — NUEVO

Editor tipo "Google Forms" para configurar el formulario que completan los clientes sin tocar codigo.

**Funcionalidad:**
- CRUD de **pasos** (agregar, eliminar, reordenar, renombrar, ocultar)
- CRUD de **preguntas** dentro de cada paso
- Cada pregunta tiene:
  - `id` (interno, usado por el backend)
  - `label` (texto visible)
  - `type` (text, textarea, number, url, date, select, checkbox, boolean, file, info)
  - `required` (booleano)
  - `hidden` (booleano — oculta sin eliminar)
  - `placeholder` / `helpText`
  - `options` (array, solo para type=select)
  - `dependsOn` (id de otra pregunta boolean — se muestra solo si aquella es true)
- Vista previa en tiempo real de lo que ve el cliente
- Boton "Restaurar por defecto" para volver a la config base

**Modelo de datos (`FormConfig`):**
```json
{
  "titulo": "Nueva Solicitud de Credito",
  "steps": [
    {
      "id": "step1",
      "titulo": "Verificacion de Identidad",
      "hidden": false,
      "questions": [
        {
          "id": "dniFrente",
          "label": "DNI Frente",
          "type": "file",
          "required": true,
          "hidden": false,
          "helpText": "Click para subir imagen"
        }
      ]
    }
  ]
}
```

**Persistencia backend:**
- Tabla `form_config` con campos: `id`, `version`, `config` (JSONB), `is_active`, `created_at`
- PUT `/api/form-config` crea nueva version y desactiva anterior (versionado)
- GET `/api/form-config/active` devuelve la config activa al frontend del cliente
- El formulario del cliente (`ClientNewRequest`) debe consumir esta config y renderizar dinamicamente

**IMPORTANTE:** En el mockup actual, el formulario del cliente aun esta hardcodeado. El desarrollador debe refactorizarlo para que consuma `formConfig` desde el state (y del backend en produccion).

### 8.11 Configuracion (super_admin)
- LTV Maximo (%)
- Monto Maximo (USD)
- Tasas base por plazo (12, 24, 36, 48, 60 meses)
- Restaurar defaults / Guardar (versionado: desactiva config anterior, crea nueva)

---

## 9. Sistema de Autenticacion

### Quick Login (Demo)
| Rol | Email | Password |
|-----|-------|----------|
| Super Admin | panchobenegas@gmail.com | Admin123! |
| Red Admin | director@coldwell.com | Red123! |
| Oficina Admin | jefe.palermo@coldwell.com | Oficina123! |
| Agente | maria@coldwell.com | Agente123! |
| Cliente | client@tcmc.local | Client123! |

### Produccion
- JWT firmado con JWT_SECRET, cookie HttpOnly (`tcmc_token`)
- Passwords hasheados con bcrypt
- Usuarios nuevos quedan en estado "pendiente" hasta aprobacion del admin
- Validacion de request bodies con Zod

---

## 10. Sistema de Notificaciones y Triggers

### 10.1 Infraestructura
- **In-app:** Icono de campana en barra superior con badge de conteo, dropdown con lista de notificaciones
- **Email:** Integrar con SendGrid/Resend via Edge Functions
- **Persistencia:** Tabla `notifications` en base de datos
- **Real-time (futuro):** Supabase Realtime o WebSockets para push de pop-ups

### 10.2 Triggers

| # | Trigger | Evento Disparador | Destinatarios | Canal | Timing |
|---|---------|-------------------|---------------|-------|--------|
| A | **Solicitud Nueva** | Se crea un nuevo legajo (handleNewLoanSubmit) | Back office (super_admin), ejecutivo asignado, oficina, cliente | Email + Pop-up | Inmediato |
| B | **Cambio de Estado** | Se cambia el stage de un legajo | Ejecutivo, oficina, cliente (**NO back office**) | Email + Pop-up | Inmediato |
| C | **Pedido de Informacion** | Se agrega una observacion al legajo | Ejecutivo, oficina, cliente (**NO back office**) | Email + Pop-up | Inmediato |
| D | **Cuota por Vencer** | Cuota pendiente a 7 dias de vencimiento | Solo el cliente | Email + Pop-up | Verificacion diaria (pg_cron) |

### 10.3 Templates de Email

**Base:**
```
Subject: [Tu Casa +Cerca] {title}
Body:
  [Logo TCMC]
  Hola {destinatarioNombre},
  {message}
  [Ver en plataforma] → link al legajo en la app
  ---
  Tu Casa +Cerca — Plataforma de Creditos Hipotecarios
```

**Trigger A — Solicitud Nueva:**
```
Subject: [Tu Casa +Cerca] Nueva Solicitud de Credito
Body: {nombre} {apellido} solicito USD {loanAmount} a {months} meses para inmueble en {propertyAddress}
```

**Trigger B — Cambio de Estado:**
```
Subject: [Tu Casa +Cerca] Cambio de Etapa
Body: El legajo de {nombre} {apellido} cambio de {stageAnterior} a {stageNuevo}
```

**Trigger C — Pedido de Informacion:**
```
Subject: [Tu Casa +Cerca] Nueva Observacion en su Legajo
Body: Se agrego una observacion al legajo de {nombre} {apellido}: "{textoObservacion}"
```

**Trigger D — Cuota por Vencer:**
```
Subject: [Tu Casa +Cerca] Cuota Proxima a Vencer
Body: Recordatorio: Su cuota #{numero} por USD {monto} vence el {fecha}. Tiene 7 dias para realizar el pago.
```

### 10.4 Implementacion Backend

Para el trigger D (cuota por vencer), usar un job diario:
```
-- pg_cron o Supabase cron
SELECT * FROM payments p
JOIN applications a ON p.application_id = a.id
WHERE p.status = 'Pendiente'
  AND p.due_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.loan_id = a.id AND n.type = 'payment_due' AND n.extra->>'cuota_number' = p.number::text)
```

---

## 11. API Endpoints Requeridos

| Endpoint | Metodos | Descripcion |
|----------|---------|-------------|
| /api/auth/login | POST | Login con email/password |
| /api/auth/logout | POST | Cerrar sesion |
| /api/auth/me | GET | Usuario actual |
| /api/auth/register | POST | Registro nuevo usuario |
| /api/applications | GET, POST | Listar/crear legajos |
| /api/applications/[id] | GET, PATCH | Detalle/actualizar legajo |
| /api/applications/[id]/stage | POST | Cambiar etapa |
| /api/applications/[id]/notes | POST | Agregar observacion |
| /api/applications/[id]/request-info | POST | Pedir info extra |
| /api/applications/[id]/documents | POST | Subir escritura/hipoteca post-finalizacion |
| /api/documents/upload | POST | Upload de documento (FormData) |
| /api/documents/[id]/status | PATCH | Aprobar/observar documento |
| /api/payments/[loanId] | GET | Cronograma de pagos |
| /api/payments/[loanId]/[number] | PATCH | Registrar pago |
| /api/notifications | GET | Listar notificaciones del usuario |
| /api/notifications/[id]/read | PATCH | Marcar como leida |
| /api/notifications/read-all | PATCH | Marcar todas como leidas |
| /api/users | GET | Listar usuarios (admin) |
| /api/users/[id] | PATCH | Aprobar/cambiar rol |
| /api/users/bulk-import | POST | Import CSV de agentes |
| /api/oficinas | GET, POST | CRUD oficinas |
| /api/oficinas/[id] | PATCH | Editar oficina |
| /api/stages | GET, POST | Listar/crear etapas |
| /api/stages/[id] | PUT | Editar etapa |
| /api/config | GET, PUT | Config simulador (versionado) |
| /api/config/public | GET | Config publica para simulador |
| /api/leads | POST | Captura lead desde simulador |
| /api/reports/pipeline | GET | Datos para reporte pipeline |
| /api/reports/agents | GET | Performance de agentes |
| /api/reports/financial | GET | Resumen financiero |
| /api/export/csv | GET | Export generico a CSV |
| /api/export/excel | GET | Export generico a Excel |

---

## 12. Documentos Requeridos por Etapa

### docTypes sugeridos
```
DNI_FRONT, DNI_BACK, ADDRESS_PROOF, RESERVATION,
INCOME_DECLARATION, PAYSLIPS_3M,
CODEBTOR_DNI_FRONT, CODEBTOR_DNI_BACK,
ESCRITURA (post-finalizacion),
HIPOTECA (post-finalizacion)
```

### Estados de documento
| Estado | Significado | Quien lo setea |
|--------|-------------|----------------|
| Pendiente | No subido aun | Sistema |
| Aprobado | Documento aprobado | Admin |
| Observado | Requiere correccion | Admin |
| No aplica | No requerido | Sistema |

---

## 13. Integracion con Coldwell Banker (Propiedades)

### 13.1 Estado actual
- En la landing (`buscarEnCB()`) se construye una URL de busqueda con parametros y se redirige a `https://www.coldwellbanker.com.ar/propiedades` con filtro `suitable_for_credit=1` por defecto (solo propiedades aptas para credito Tu Casa +Cerca).
- En el formulario de nueva solicitud (paso 2) el cliente pega el link CB o el codigo de propiedad. Se extrae el codigo via regex del link.

### 13.2 Integracion real con datos de CB

**CB Argentina NO tiene una API publica** al momento de esta spec. Opciones para obtener datos reales:

| Opcion | Viabilidad | Notas |
|--------|-----------|-------|
| **Partnership formal CB + API privada** | Mejor opcion | Requiere acuerdo comercial con CB Argentina para acceso a su API interna / feed XML de propiedades. Lo ideal es negociar un endpoint tipo `GET /api/property/{code}` que devuelva JSON con titulo, direccion, valor, fotos, m2, ambientes, apto credito (boolean). |
| **Scraping del sitio publico** | No recomendada | Fragil, contra TOS, alto riesgo de bloqueo. Solo como fallback temporal. |
| **Feed XML / RSS publico** | Si existe | Verificar con CB si tienen feed de propiedades (MLS, portales usan XML). Parsear y cachear localmente. |
| **Parseo del codigo desde URL (actual)** | Basico funcional | Solo da el codigo, no los datos. Se usa para prellenar el campo. |

### 13.3 Recomendacion de arquitectura

1. **Negociar acceso API con CB** (critico antes del launch productivo)
2. Crear un servicio `CBIntegrationService` en el backend con metodos:
   - `getPropertyByCode(code)` → devuelve datos completos
   - `searchProperties(filters)` → listado con filtro `suitable_for_credit`
3. Cache de propiedades en Redis (TTL 1 hora) para reducir llamadas
4. En frontend, cuando el cliente pega un link o codigo, llamar al backend para auto-completar precio, direccion, fotos, etc.

### 13.4 Filtro `suitable_for_credit=1`
Este parametro es convencion interna: las propiedades aptas para credito Tu Casa +Cerca deben cumplir:
- Valor <= monto maximo configurado (default USD 50.000 / LTV 35%)
- Situacion dominial saneada (titulo limpio)
- Apto hipoteca
- Ubicadas en zonas cubiertas por el FCICC

Se sugiere que CB exponga un flag booleano `suitable_for_credit` en su API que nosotros definamos conjuntamente.

---

## 14. Notas para Produccion

1. **Base de datos:** Migrar de SQLite a PostgreSQL
2. **Storage:** Reemplazar uploads locales por S3/Supabase Storage con presigned URLs
3. **KYC:** Integrar MetaMap para verificacion de identidad (fuera del MVP)
4. **Pagos:** El sistema NO maneja dinero real, solo registro de pagos
5. **Emails:** Configurar dominio verificado en SendGrid/Resend
6. **Seguridad:** Rate limiting, CORS, validacion Zod en todos los endpoints
7. **Monitoreo:** Agregar Sentry o similar para errores en produccion
8. **Cuotas vencidas:** Implementar job diario para marcar cuotas pasadas como "Vencido"

---

## 15. Archivos del Proyecto

| Archivo | Proposito |
|---------|-----------|
| `index.html` | **Mockup funcional completo** — Landing + App React con todos los flujos |
| `TCMC-Spec-Desarrollador.md` | **Este documento** — Spec tecnica completa |
| `APP/TCMC-Workflow-App-Doc-Tecnico-Funcional-MVP.docx` | Doc tecnico original (Next.js/Prisma) |
| `APP/TCMC solicitud de appilicacion integrada en web.docx` | Requisitos iniciales de negocio |
| `APP/tcmc-webapp.html` | Version standalone anterior de la app |
| `APP/tcmc-webapp.jsx` | Codigo fuente React original |
| `TCMC-supabase-plan.md` | Plan de integracion con Supabase |
| `TCMC-Presentacion.pdf` | Presentacion comercial |
| Imagenes (`bg-houses.png`, `couple.png`, `caso-*.png`) | Assets visuales de la landing |

---

## 16. Como Usar el Mockup

1. Abrir `index.html` en un navegador moderno
2. Click en "Ingresar" en la landing page
3. Usar las credenciales de la seccion 9 para probar cada rol
4. **Super Admin** tiene acceso a todas las funcionalidades
5. El panel "Leg. Finalizados" muestra el nuevo panel con CRM
6. La campanita en la barra superior muestra las notificaciones
7. Todos los datos son mock — al recargar se reinician

---

*Documento generado automaticamente. Referencia cruzada con el mockup index.html para detalles de implementacion visual.*
