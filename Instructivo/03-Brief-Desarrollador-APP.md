# Brief Desarrollador — Aplicación Tu Casa +Cerca

Este documento contiene **todo lo necesario** para implementar la aplicación productiva (portal cliente + backoffice). El objetivo es **minimizar horas de desarrollo** tomando el mockup como fuente de verdad.

---

## 1. Alcance

**Qué entregar:**
- Portal cliente (simulador, solicitud, seguimiento, pagos)
- Backoffice para 4 roles: agente, oficina_admin, red_admin, super_admin
- Sistema de notificaciones (email + in-app)
- ABM dinámico del formulario de crédito
- Integración con storage para documentos
- Deploy productivo con base de datos

**Qué NO incluye:**
- Landing pública (ver `02-Brief-Desarrollador-WEB.md`)
- Integración KYC con MetaMap (queda para fase 2)
- Procesamiento real de pagos / transferencias (esta plataforma NO mueve dinero)

---

## 2. Fuente de verdad

El mockup completo está en **`index.html`** (~5800 líneas). Todo el comportamiento visual, flujos, roles, copy, algoritmos y estructura de datos está ahí implementado con mock data.

**El trabajo del desarrollador es 90% portar el mockup, no diseñar desde cero.**

Referencias adicionales:
- `TCMC-Spec-Desarrollador.md` — Spec técnica completa (15 secciones)
- `APP/TCMC-Workflow-App-Doc-Tecnico-Funcional-MVP.docx` — Doc técnico original (puede servir de referencia)
- `TCMC-supabase-plan.md` — Plan de integración con Supabase (si eligen ese stack)

---

## 3. Stack recomendado

### Opción A — Supabase + Next.js (recomendada, menos horas)
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Storage + Edge Functions + Realtime)
- **Emails:** Resend (barato y simple)
- **Hosting:** Vercel
- **Ventajas:** Setup rápido, auth + storage resueltos, realtime out-of-the-box para notificaciones

### Opción B — Next.js + Prisma + Postgres self-hosted
- **Frontend:** Next.js 14
- **Backend:** Next.js API Routes + Prisma + PostgreSQL
- **Auth:** NextAuth.js con JWT
- **Storage:** AWS S3 o Cloudflare R2
- **Emails:** SendGrid / Resend
- **Hosting:** Vercel + Railway / Supabase solo para Postgres

**Recomendación:** Opción A. Estimación ~60 hs vs ~100 hs.

---

## 4. Estructura de datos (Postgres)

### 4.1 Tabla `profiles` (usuarios)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,  -- bcrypt (o manejarlo Supabase Auth)
  nombre VARCHAR NOT NULL,
  apellido VARCHAR NOT NULL,
  rol VARCHAR NOT NULL CHECK (rol IN ('super_admin', 'red_admin', 'oficina_admin', 'agente', 'cliente')),
  red_id UUID REFERENCES redes(id),
  oficina_id UUID REFERENCES oficinas(id),
  estado VARCHAR DEFAULT 'pendiente' CHECK (estado IN ('activo', 'pendiente', 'inactivo')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.2 Tabla `redes`
```sql
CREATE TABLE redes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  codigo VARCHAR UNIQUE NOT NULL,
  activa BOOLEAN DEFAULT true
);
```

### 4.3 Tabla `oficinas`
```sql
CREATE TABLE oficinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  red_id UUID REFERENCES redes(id) NOT NULL,
  direccion VARCHAR,
  estado VARCHAR DEFAULT 'activa'
);
```

### 4.4 Tabla `applications` (legajos)
```sql
CREATE TABLE applications (
  id VARCHAR PRIMARY KEY,  -- Formato: TCMC-0001
  client_id UUID REFERENCES profiles(id),
  agente_id UUID REFERENCES profiles(id),
  oficina_id UUID REFERENCES oficinas(id),
  nombre VARCHAR, apellido VARCHAR, email VARCHAR, phone VARCHAR, dni VARCHAR,
  property_link VARCHAR, property_code VARCHAR, property_address VARCHAR,
  property_value NUMERIC, offered_value NUMERIC,
  loan_amount NUMERIC NOT NULL, months INT NOT NULL,
  stage VARCHAR NOT NULL DEFAULT 'Solicitud Inicial',
  status VARCHAR NOT NULL DEFAULT 'En Proceso',
  ingresos_anuales NUMERIC,
  has_codeudor BOOLEAN DEFAULT false,
  codeudor_nombre VARCHAR, codeudor_apellido VARCHAR, codeudor_dni VARCHAR,
  codeudor_vinculo VARCHAR, codeudor_ingresos_anuales NUMERIC,
  fecha_escritura DATE,
  escritura_doc JSONB,   -- { name, date, storage_path }
  hipoteca_doc JSONB,    -- { name, date, storage_path }
  rejection_message TEXT, rejection_date DATE,
  form_config_version INT,  -- versión del FormConfig con que se creó
  created_at TIMESTAMPTZ DEFAULT now(),
  last_update TIMESTAMPTZ DEFAULT now()
);
```

### 4.5 Tabla `documents`
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id VARCHAR REFERENCES applications(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  doc_type VARCHAR,  -- dni_front, dni_back, income, escritura, hipoteca, etc.
  storage_path VARCHAR,
  status VARCHAR DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Aprobado', 'Observado', 'No aplica')),
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewer_id UUID REFERENCES profiles(id)
);
```

### 4.6 Tabla `observations`
```sql
CREATE TABLE observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id VARCHAR REFERENCES applications(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.7 Tabla `payments` (cuotas)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id VARCHAR REFERENCES applications(id) ON DELETE CASCADE,
  number INT NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  status VARCHAR DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Pagado', 'Informado', 'Vencido')),
  pago_info JSONB,  -- { fecha, monto, banco, comprobante }
  comprobante VARCHAR,
  comprobante_date DATE
);
```

### 4.8 Tabla `stage_history`
```sql
CREATE TABLE stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id VARCHAR REFERENCES applications(id) ON DELETE CASCADE,
  from_stage VARCHAR,
  to_stage VARCHAR NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.9 Tabla `notifications`
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  type VARCHAR NOT NULL CHECK (type IN ('new_request', 'stage_change', 'info_request', 'payment_due')),
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  application_id VARCHAR REFERENCES applications(id),
  channel VARCHAR DEFAULT 'both',  -- popup, email, both
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.10 Tabla `form_config`
```sql
CREATE TABLE form_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version INT NOT NULL,
  config JSONB NOT NULL,  -- estructura completa de pasos y preguntas
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX idx_form_config_active ON form_config (is_active) WHERE is_active = true;
```

### 4.11 Tabla `simulator_config`
```sql
CREATE TABLE simulator_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version INT NOT NULL,
  tasas_base JSONB NOT NULL,  -- { "12": 0.105, "24": 0.115, ... }
  max_ltv NUMERIC NOT NULL DEFAULT 0.35,
  max_loan NUMERIC NOT NULL DEFAULT 50000,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Roles y permisos (Row Level Security)

### 5.1 Matriz de acceso

| Rol | Ve | Edita |
|-----|----|----|
| `cliente` | Solo sus propias solicitudes | Sube docs, registra pagos |
| `agente` | Legajos de sus clientes | Observaciones |
| `oficina_admin` | Legajos de agentes de su oficina | Observaciones + algunos cambios |
| `red_admin` | Legajos de su red | Cambia etapa, aprueba/rechaza |
| `super_admin` | Todo | Todo + config sistema + ABM formulario |

### 5.2 Si van con Supabase, usar RLS policies
```sql
-- Ejemplo: cliente solo ve sus applications
CREATE POLICY "cliente_own_applications" ON applications
  FOR SELECT USING (
    (SELECT rol FROM profiles WHERE id = auth.uid()) = 'cliente'
    AND client_id = auth.uid()
  );
```

---

## 6. API Endpoints (REST)

Lista completa está en `TCMC-Spec-Desarrollador.md` sección 11. Resumen:

```
/api/auth/login          POST
/api/auth/logout         POST
/api/auth/me             GET
/api/auth/register       POST

/api/applications        GET, POST
/api/applications/:id    GET, PATCH
/api/applications/:id/stage           POST
/api/applications/:id/notes           POST
/api/applications/:id/request-info    POST

/api/documents/upload    POST (FormData)
/api/documents/:id/status PATCH

/api/payments/:loanId             GET
/api/payments/:loanId/:number     PATCH (registrar pago)

/api/notifications           GET
/api/notifications/:id/read  PATCH
/api/notifications/read-all  PATCH

/api/users          GET
/api/users/:id      PATCH
/api/users/bulk-import POST

/api/oficinas           GET, POST
/api/oficinas/:id       PATCH

/api/form-config        GET, PUT   (solo super_admin)
/api/form-config/active GET        (público — frontend cliente lo usa)

/api/simulator-config   GET, PUT
/api/simulator-config/public GET

/api/leads              POST (público — viene de la landing)

/api/reports/pipeline   GET
/api/reports/agents     GET
/api/reports/financial  GET

/api/export/csv         GET
/api/export/excel       GET
```

---

## 7. Algoritmos críticos (ya implementados en el mockup)

### 7.1 Cálculo financiero
```javascript
// Monto bruto (con 5% upfront + IVA 21%)
function calcularBruto(prestamo) {
  return prestamo + (prestamo * 0.05) + (prestamo * 0.05 * 0.21);
}

// Cuota mensual (PMT)
function calcularCuota(tasaAnual, meses, bruto) {
  const tm = tasaAnual / 12;
  return bruto * (tm * Math.pow(1 + tm, meses)) / (Math.pow(1 + tm, meses) - 1);
}

// Cronograma de pagos
function generatePaymentSchedule(loanAmount, months, fechaEscritura, tasaAnual) {
  const bruto = calcularBruto(loanAmount);
  const cuota = calcularCuota(tasaAnual, months, bruto);
  const startDate = new Date(fechaEscritura);
  return Array.from({ length: months }, (_, i) => {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    return {
      number: i + 1,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: Math.round(cuota * 100) / 100,
      status: 'Pendiente'
    };
  });
}
```

### 7.2 Detección de estado de pago (para panel Legajos Finalizados)
```javascript
function getEstadoLoan(loan) {
  const today = new Date();
  const vencidas = loan.payments.filter(p =>
    p.status !== 'Pagado' && new Date(p.dueDate) < today
  );
  if (vencidas.length === 0) return { label: 'Al día', color: 'green' };
  const maxDiasAtraso = Math.max(...vencidas.map(p =>
    Math.floor((today - new Date(p.dueDate)) / 86400000)
  ));
  if (maxDiasAtraso <= 5) return { label: `Atraso ${maxDiasAtraso}d`, color: 'amber' };
  return { label: `Atraso ${maxDiasAtraso}d`, color: 'red' };
}
```

---

## 8. Sistema de notificaciones (4 triggers)

### Trigger A — Nueva solicitud
- **Evento:** `POST /api/applications` (cliente crea nueva solicitud)
- **Destinatarios:** super_admin (back office), agente asignado, oficina del agente, el propio cliente
- **Canal:** Email + Pop-up in-app
- **Template:** `{nombre} {apellido} solicitó {formatCurrency(monto)} a {meses} meses para inmueble en {direccion}`

### Trigger B — Cambio de estado
- **Evento:** `POST /api/applications/:id/stage`
- **Destinatarios:** agente asignado, oficina, cliente (**NO** back office)
- **Canal:** Email + Pop-up
- **Template:** `Legajo {nombre}: {stageAnterior} → {stageNuevo}`

### Trigger C — Nueva observación
- **Evento:** `POST /api/applications/:id/notes`
- **Destinatarios:** agente, oficina, cliente (**NO** back office)
- **Canal:** Email + Pop-up
- **Template:** `Nueva observación en legajo {nombre}: "{texto}"`

### Trigger D — Cuota por vencer (7 días antes)
- **Evento:** Cron job diario
- **Destinatarios:** solo el cliente
- **Canal:** Email + Pop-up
- **Template:** `Su cuota #{n} por {formatCurrency(monto)} vence el {fecha}`
- **Implementación (Supabase pg_cron):**

```sql
SELECT cron.schedule('check-due-payments', '0 9 * * *', $$
  INSERT INTO notifications (profile_id, type, title, message, application_id, channel)
  SELECT
    p.client_id, 'payment_due',
    'Cuota próxima a vencer',
    CONCAT('Su cuota #', pay.number, ' por USD ', pay.amount, ' vence el ', pay.due_date),
    a.id, 'both'
  FROM payments pay
  JOIN applications a ON pay.application_id = a.id
  JOIN profiles p ON a.client_id = p.id
  WHERE pay.status = 'Pendiente'
    AND pay.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND NOT EXISTS (
      SELECT 1 FROM notifications n
      WHERE n.type = 'payment_due'
        AND n.application_id = a.id
        AND n.message LIKE CONCAT('%#', pay.number, '%')
    );
$$);
```

### Template de email base (Resend/SendGrid)
```html
<div style="font-family: Poppins, Arial; max-width: 600px; margin: auto;">
  <img src="https://tucasamascerca.com/logo.png" alt="Tu Casa +Cerca" width="180" />
  <h2>{{title}}</h2>
  <p>Hola {{nombre}},</p>
  <p>{{message}}</p>
  <a href="https://app.tucasamascerca.com/legajo/{{applicationId}}"
     style="display:inline-block; padding:12px 24px; background:#2563eb; color:white; text-decoration:none; border-radius:8px;">
    Ver en la plataforma
  </a>
  <hr />
  <p style="color:#999; font-size:12px;">Tu Casa +Cerca — Plataforma de Créditos Hipotecarios</p>
</div>
```

---

## 9. Storage de documentos

Cada documento subido va a storage externo. Estructura de paths:

```
tcmc-documents/
  {application_id}/
    dni_front_{timestamp}.jpg
    dni_back_{timestamp}.jpg
    comprobante_domicilio_{timestamp}.pdf
    reserva_credito_{timestamp}.pdf
    declaracion_ingresos_{timestamp}.pdf
    escritura_{timestamp}.pdf     (post-finalización)
    hipoteca_{timestamp}.pdf       (post-finalización)
    codeudor/
      codeudor_dni_front_{timestamp}.jpg
      ...
```

- **Privado por default:** nadie accede sin estar autenticado
- **Signed URLs** para que el frontend pueda mostrarlos (validez 1 hora)
- **Max file size:** 10 MB por documento
- **Formatos permitidos:** PDF, JPG, PNG

---

## 10. ABM Formulario de Crédito

Ver detalles en `Instructivo/01-Instructivo-Formulario.md`.

**Punto crítico para el desarrollador:** el formulario del cliente (`ClientNewRequest` en el mockup) está hardcodeado actualmente. En producción debe ser **dinámico** y consumir `GET /api/form-config/active`.

### 10.1 Renderizado dinámico
```jsx
function ClientNewRequest({ formConfig, onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const currentStep = formConfig.steps.filter(s => !s.hidden)[step - 1];

  const visibleQuestions = currentStep.questions.filter(q => {
    if (q.hidden) return false;
    if (q.dependsOn && !formData[q.dependsOn]) return false;
    return true;
  });

  return (
    <form>
      <h2>{currentStep.titulo}</h2>
      {visibleQuestions.map(q => renderQuestion(q, formData, setFormData))}
      <button onClick={() => setStep(step + 1)}>Siguiente</button>
    </form>
  );
}

function renderQuestion(q, formData, setFormData) {
  switch (q.type) {
    case 'text': return <input type="text" ... />;
    case 'number': return <input type="number" ... />;
    case 'file': return <input type="file" ... />;
    case 'select': return <select>{q.options.map(...)}</select>;
    case 'boolean': return <Switch checked={...} />;
    case 'checkbox': return <input type="checkbox" ... />;
    case 'info': return <p>{q.helpText}</p>;
    // ...
  }
}
```

### 10.2 Versionado
- Cuando el super_admin guarda una nueva versión de `form_config`, se crea un nuevo registro con `version = max(version) + 1` y `is_active = true`, y la anterior pasa a `is_active = false`.
- Las solicitudes ya creadas guardan `form_config_version` para poder reconstruir el formulario original si es necesario auditar.

---

## 11. Integración con Coldwell Banker

**Estado:** CB Argentina NO tiene API pública. Ver sección 13 de `TCMC-Spec-Desarrollador.md`.

**Acciones:**
1. En la landing el filtro `suitable_for_credit=1` ya está. Coordinar con CB que lo implementen.
2. En el formulario de solicitud, el cliente pega el link o código CB. Por ahora solo parseo de URL para extraer código.
3. **Antes del launch productivo:** negociar acceso API con CB para auto-completar datos de la propiedad.

---

## 12. Deploy

### 12.1 Variables de entorno
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
JWT_SECRET=...
STORAGE_BUCKET=tcmc-documents
APP_URL=https://app.tucasamascerca.com
LANDING_URL=https://tucasamascerca.com
```

### 12.2 Seed inicial
Necesario antes del primer login:
- 1 super_admin (pancho): `panchobenegas@gmail.com` / hash de `Admin123!`
- 1 red Coldwell Bankers
- 3 oficinas (Palermo, Belgrano, Recoleta)
- FormConfig default (el que tiene el mockup)
- SimulatorConfig default

El seed script está implícito en el mockup (`MOCK_PROFILES`, `MOCK_OFICINAS`, `MOCK_REDES`, `DEFAULT_FORM_CONFIG`).

### 12.3 Dominio
- `app.tucasamascerca.com` → la app
- `tucasamascerca.com` → la landing
- SSL automático con Vercel

---

## 13. Checklist de entrega

### Backend
- [ ] Postgres con todas las tablas + RLS
- [ ] API REST todos los endpoints
- [ ] Auth con JWT / Supabase Auth
- [ ] Storage configurado con signed URLs
- [ ] Cron job de notificaciones de cuotas por vencer
- [ ] Emails con Resend/SendGrid y templates
- [ ] Seed de datos iniciales

### Frontend
- [ ] Login + registro (aprobación pendiente para nuevos usuarios)
- [ ] Dashboard por rol
- [ ] Portal cliente: simulador, nueva solicitud (dinámica desde FormConfig), mi solicitud, mis pagos, soporte
- [ ] Panel Gestión de Legajos con Pipeline integrado arriba
- [ ] Modal detallado de legajo con cambios de stage, observaciones
- [ ] Panel Cobranzas (matriz mes-año con drill-down)
- [ ] Panel Legajos Finalizados con modal CRM + carga escritura/hipoteca
- [ ] Panel Reportes (3 tabs)
- [ ] Panel Usuarios (aprobación, bulk import)
- [ ] Panel Oficinas (CRUD)
- [ ] Panel ABM Formulario (estilo Google Forms)
- [ ] Panel Configuración (tasas, LTV, máximo)
- [ ] Notificaciones en tiempo real (Supabase Realtime)
- [ ] Campana con dropdown de notificaciones

### Operación
- [ ] Testing manual exhaustivo por rol
- [ ] Responsive desktop + tablet (mobile opcional para backoffice)
- [ ] Deploy productivo con dominio + SSL
- [ ] Backups automáticos de Postgres
- [ ] Monitoring básico (Sentry + uptime)
- [ ] Documentación básica para el cliente (admin)

---

## 14. Estimación de horas

### Con Opción A (Supabase + Next.js)

| Tarea | Horas |
|-------|-------|
| Setup proyecto + Supabase + schema + RLS | 6 |
| Auth (login, registro, aprobación) | 4 |
| Dashboard común + sidebar + layout | 4 |
| Portal cliente: simulador + 5 vistas | 8 |
| Formulario dinámico (FormConfig → UI) | 6 |
| Panel Legajos + Pipeline integrado + modal | 8 |
| Panel Cobranzas con matriz y drill-down | 6 |
| Panel Legajos Finalizados + modal CRM | 6 |
| Panel Reportes (3 tabs) | 5 |
| Panel ABM Formulario | 5 |
| Panel Usuarios + Oficinas + Config | 5 |
| Storage + upload de documentos | 3 |
| Sistema notificaciones + emails + cron | 6 |
| Testing + ajustes responsive | 6 |
| Deploy + seed + docs | 3 |
| **TOTAL MVP** | **~80 hs** |

### Con Opción B (Self-hosted) sumar ~25 hs adicionales

---

## 15. Preguntas al cliente antes de arrancar

1. ¿Preferís Opción A (Supabase) u Opción B (self-hosted)?
2. ¿Dominio confirmado? (`app.tucasamascerca.com`)
3. ¿Tenés cuenta Resend / SendGrid o hay que crearla?
4. ¿CB confirmó el flag `suitable_for_credit` en su URL? ¿Hay chance de API privada?
5. ¿Usuarios nuevos necesitan aprobación del admin siempre, o solo ciertos roles?
6. ¿Querés KYC con MetaMap en MVP o queda para fase 2?
7. ¿Mobile para backoffice es requerido o solo desktop?
8. ¿Ya existe un logo profesional o hay que crear uno?

---

## 16. Archivos de referencia a leer antes de arrancar

| Archivo | Por qué leerlo |
|---------|----------------|
| `index.html` | Es el mockup completo. Abrir en navegador y recorrer cada rol. |
| `TCMC-Spec-Desarrollador.md` | Spec técnica completa (16 secciones). |
| `APP/TCMC-Workflow-App-Doc-Tecnico-Funcional-MVP.docx` | Doc técnico original con enfoque Next.js/Prisma. |
| `TCMC-supabase-plan.md` | Plan detallado de integración con Supabase. |
| `Instructivo/01-Instructivo-Formulario.md` | Cómo funciona el ABM del formulario. |

---

## 17. Contacto

Dueño del proyecto: **Francisco Benegas (Pancho)**
Email: `panchobenegas@gmail.com`
Repo: https://github.com/DevelopFB/TuCasaMasCerca

Para dudas técnicas puntuales, dejá issues en GitHub con label `dev-question`.
