# TCMC — Plan de Migración a Supabase + Resend

**Fecha:** 2026-04-06
**Versión:** 1.0
**Autor:** Pancho Benegas / Claude
**Estado:** Borrador para revisión

---

## 1. Resumen Ejecutivo

Transformar TCMC de una app demo (datos en memoria, auth hardcodeada) a una plataforma transaccional con persistencia real, autenticación por email/password, jerarquía de roles con aislamiento de datos, y módulos de cobranzas/reportes con lógica de gestión.

**Stack elegido:** Supabase (Auth + PostgreSQL + RLS) + Resend (notificaciones email).
**Enfoque:** Lo más simple posible — sigue siendo un mockup funcional, pero con datos persistidos y auth real.

---

## 2. Jerarquía de Roles y Permisos

### 2.1 Estructura organizacional

```
ADMIN (TCMC)
  └── RED (Coldwell Bankers)
        ├── OFICINA A
        │     ├── Agente 1 → [clientes]
        │     └── Agente 2 → [clientes]
        ├── OFICINA B
        │     ├── Agente 3 → [clientes]
        │     └── Agente 4 → [clientes]
        └── OFICINA C
              └── Agente 5 → [clientes]
```

### 2.2 Roles del sistema

| Rol | Código | Scope de datos | Acciones clave |
|-----|--------|---------------|----------------|
| **Super Admin** | `super_admin` | Toda la plataforma | Config global (tasas, plazos), ABM oficinas, ABM redes, ABM usuarios, aprobar registros, reportes globales, cobranzas |
| **Admin Red** | `red_admin` | Todas las oficinas de su red | Ver todos los clientes de la red, reportes de red, gestión de oficinas dentro de su red |
| **Jefe Oficina** | `oficina_admin` | Todos los agentes de su oficina | Ver clientes de todos sus agentes, reportes de oficina |
| **Agente** | `agente` | Solo sus clientes asignados | Pipeline propio, gestión de sus clientes |
| **Cliente** | `cliente` | Solo su propio legajo | Simulador, ver su solicitud, ver sus pagos |

### 2.3 Matriz de permisos

| Recurso | Super Admin | Red Admin | Oficina Admin | Agente | Cliente |
|---------|:-----------:|:---------:|:-------------:|:------:|:-------:|
| Config global (tasas/plazos) | CRUD | R | R | R | — |
| ABM Oficinas | CRUD | CRUD (su red) | R | — | — |
| ABM Agentes | CRUD | CRUD (su red) | CRUD (su oficina) | — | — |
| Aprobar usuarios nuevos | ✓ | — | — | — | — |
| Ver todos los clientes | ✓ | ✓ (su red) | ✓ (su oficina) | ✓ (sus clientes) | ✓ (solo él) |
| Cambiar etapa legajo | ✓ | ✓ | — | — | — |
| Cobranzas (marcar pagos) | ✓ | ✓ | — | — | — |
| Reportes globales | ✓ | ✓ (su red) | ✓ (su oficina) | — | — |
| Carga masiva Excel | ✓ | ✓ (su red) | — | — | — |
| Simulador | ✓ | — | — | — | ✓ |
| Subir comprobante pago | — | — | — | — | ✓ |

---

## 3. Schema de Base de Datos (PostgreSQL / Supabase)

### 3.1 Diagrama de relaciones

```
redes ──< oficinas ──< profiles ──< loans
                                      │
                                      ├──< loan_documents
                                      ├──< loan_observations
                                      └──< loan_payments

config_global (singleton)
user_invitations (workflow de aprobación)
```

### 3.2 Tablas — DDL completo

```sql
-- ============================================================
-- EXTENSIONES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: redes
-- Cada red es un grupo de oficinas (ej: Coldwell Bankers)
-- ============================================================
CREATE TABLE redes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT NOT NULL,
  codigo      TEXT UNIQUE NOT NULL,       -- 'coldwell_bankers'
  activa      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed inicial
INSERT INTO redes (nombre, codigo) VALUES ('Coldwell Bankers', 'coldwell_bankers');

-- ============================================================
-- TABLA: oficinas
-- Cada oficina pertenece a una red
-- ============================================================
CREATE TABLE oficinas (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  red_id      UUID NOT NULL REFERENCES redes(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  codigo      TEXT UNIQUE NOT NULL,       -- 'cb_palermo', 'cb_belgrano'
  direccion   TEXT,
  telefono    TEXT,
  activa      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: profiles
-- Extiende auth.users de Supabase con datos de negocio
-- Un profile se crea al registrarse o al ser invitado
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT UNIQUE NOT NULL,
  nombre          TEXT NOT NULL,
  apellido        TEXT NOT NULL,
  telefono        TEXT,
  rol             TEXT NOT NULL CHECK (rol IN (
                    'super_admin', 'red_admin', 'oficina_admin', 'agente', 'cliente'
                  )),
  red_id          UUID REFERENCES redes(id),         -- NULL para super_admin y cliente
  oficina_id      UUID REFERENCES oficinas(id),       -- NULL para super_admin, red_admin y cliente
  estado          TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN (
                    'pendiente', 'activo', 'suspendido'
                  )),
  aprobado_por    UUID REFERENCES profiles(id),
  aprobado_at     TIMESTAMPTZ,
  avatar_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries frecuentes
CREATE INDEX idx_profiles_rol ON profiles(rol);
CREATE INDEX idx_profiles_oficina ON profiles(oficina_id);
CREATE INDEX idx_profiles_red ON profiles(red_id);
CREATE INDEX idx_profiles_estado ON profiles(estado);

-- ============================================================
-- TABLA: config_global
-- Singleton con la configuración de tasas y plazos
-- Solo super_admin puede modificar
-- ============================================================
CREATE TABLE config_global (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tasas_base      JSONB NOT NULL DEFAULT '{
    "12": 0.105, "24": 0.115, "36": 0.125, "48": 0.135, "60": 0.145
  }'::jsonb,
  max_ltv         NUMERIC(5,4) NOT NULL DEFAULT 0.35,
  max_loan        NUMERIC(12,2) NOT NULL DEFAULT 50000,
  plazos          JSONB NOT NULL DEFAULT '[12, 24, 36, 48, 60]'::jsonb,
  gastos_upfront  NUMERIC(5,4) NOT NULL DEFAULT 0.05,    -- 5%
  iva_gastos      NUMERIC(5,4) NOT NULL DEFAULT 0.21,    -- 21%
  updated_by      UUID REFERENCES profiles(id),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Seed inicial (un solo registro)
INSERT INTO config_global (tasas_base, max_ltv, max_loan)
VALUES ('{"12":0.105,"24":0.115,"36":0.125,"48":0.135,"60":0.145}', 0.35, 50000);

-- ============================================================
-- TABLA: loans (legajos/créditos)
-- Cada loan tiene un cliente y un agente asignado
-- ============================================================
CREATE TABLE loans (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo            TEXT UNIQUE NOT NULL,               -- 'TCMC-0001'
  -- Cliente
  cliente_id        UUID NOT NULL REFERENCES profiles(id),
  -- Agente asignado
  agente_id         UUID REFERENCES profiles(id),
  -- Propiedad
  property_link     TEXT,
  property_code     TEXT,
  property_value    NUMERIC(14,2) NOT NULL DEFAULT 0,
  offered_value     NUMERIC(14,2),
  -- Crédito
  loan_amount       NUMERIC(14,2) NOT NULL DEFAULT 0,
  months            INTEGER NOT NULL DEFAULT 36,
  tasa_aplicada     NUMERIC(6,4),                       -- tasa al momento de aprobación
  -- Ingresos
  ingresos_anuales  NUMERIC(14,2),
  has_codeudor      BOOLEAN DEFAULT FALSE,
  codeudor_nombre   TEXT,
  codeudor_apellido TEXT,
  codeudor_dni      TEXT,
  codeudor_vinculo  TEXT,
  codeudor_ingresos NUMERIC(14,2),
  -- Estado
  stage             TEXT NOT NULL DEFAULT 'Solicitud Inicial' CHECK (stage IN (
                      'Solicitud Inicial', 'Scoring', 'Pre Aprobación',
                      'Escribanía', 'Aprobación', 'Escritura',
                      'Finalizado', 'Rechazado'
                    )),
  status            TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN (
                      'Pendiente', 'En proceso', 'Activo', 'Nueva', 'Rechazado'
                    )),
  fecha_escritura   DATE,
  -- Auditoría
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  created_by        UUID REFERENCES profiles(id)
);

CREATE INDEX idx_loans_cliente ON loans(cliente_id);
CREATE INDEX idx_loans_agente ON loans(agente_id);
CREATE INDEX idx_loans_stage ON loans(stage);
CREATE INDEX idx_loans_status ON loans(status);

-- Trigger para código auto-incremental
CREATE OR REPLACE FUNCTION generate_loan_codigo()
RETURNS TRIGGER AS $$
BEGIN
  NEW.codigo := 'TCMC-' || LPAD(
    (SELECT COALESCE(MAX(CAST(SUBSTRING(codigo FROM 6) AS INTEGER)), 0) + 1
     FROM loans)::TEXT, 4, '0'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_loan_codigo
  BEFORE INSERT ON loans
  FOR EACH ROW
  WHEN (NEW.codigo IS NULL)
  EXECUTE FUNCTION generate_loan_codigo();

-- ============================================================
-- TABLA: loan_documents
-- Documentos requeridos por legajo
-- ============================================================
CREATE TABLE loan_documents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id     UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,                           -- 'DNI Frente'
  status      TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN (
                'Pendiente', 'Enviado', 'Aprobado', 'Observado', 'No aplica'
              )),
  archivo_url TEXT,                                    -- Supabase Storage URL
  fecha       DATE,
  observacion TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_loan_docs_loan ON loan_documents(loan_id);

-- ============================================================
-- TABLA: loan_observations
-- Historial de observaciones del legajo
-- ============================================================
CREATE TABLE loan_observations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id     UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  texto       TEXT NOT NULL,
  autor_id    UUID REFERENCES profiles(id),
  autor_nombre TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_loan_obs_loan ON loan_observations(loan_id);

-- ============================================================
-- TABLA: loan_payments
-- Cronograma de pagos (cuotas)
-- ============================================================
CREATE TABLE loan_payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id         UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  numero_cuota    INTEGER NOT NULL,
  fecha_venc      DATE NOT NULL,
  monto           NUMERIC(12,2) NOT NULL,
  status          TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN (
                    'Pendiente', 'Informado', 'Pagado', 'Vencido'
                  )),
  -- Si el cliente informa pago
  comprobante_url TEXT,
  comprobante_fecha DATE,
  -- Si admin confirma pago
  pago_fecha      DATE,
  pago_monto      NUMERIC(12,2),
  pago_banco      TEXT,
  pago_comprobante TEXT,
  confirmado_por  UUID REFERENCES profiles(id),
  confirmado_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_loan ON loan_payments(loan_id);
CREATE INDEX idx_payments_status ON loan_payments(status);
CREATE INDEX idx_payments_venc ON loan_payments(fecha_venc);

-- ============================================================
-- TABLA: user_invitations
-- Workflow de alta de usuarios (sin validación por email)
-- El admin envía invitación → llega a su panel → aprueba
-- ============================================================
CREATE TABLE user_invitations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  rol         TEXT NOT NULL CHECK (rol IN (
                'red_admin', 'oficina_admin', 'agente', 'cliente'
              )),
  red_id      UUID REFERENCES redes(id),
  oficina_id  UUID REFERENCES oficinas(id),
  estado      TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN (
                'pendiente', 'aprobada', 'rechazada', 'registrada'
              )),
  invitado_por UUID REFERENCES profiles(id),
  procesado_por UUID REFERENCES profiles(id),
  procesado_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invitations_estado ON user_invitations(estado);

-- ============================================================
-- TABLA: audit_log (opcional pero recomendada)
-- Registro de acciones críticas
-- ============================================================
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id),
  accion      TEXT NOT NULL,                           -- 'cambio_etapa', 'pago_registrado', etc.
  entidad     TEXT NOT NULL,                           -- 'loan', 'payment', 'config'
  entidad_id  UUID,
  detalle     JSONB,                                   -- datos del cambio
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Vistas útiles para reportes

```sql
-- ============================================================
-- VISTA: v_cobranzas_matriz
-- Matriz tipo Excel para Admin Cobranzas
-- Columnas: Año, Mes, Cantidad total, Monto total, Pagadas, Informadas, Pendientes
-- ============================================================
CREATE OR REPLACE VIEW v_cobranzas_matriz AS
SELECT
  EXTRACT(YEAR FROM lp.fecha_venc)::INT AS anio,
  EXTRACT(MONTH FROM lp.fecha_venc)::INT AS mes,
  TO_CHAR(lp.fecha_venc, 'YYYY-MM') AS periodo,
  COUNT(*) AS cantidad_total,
  SUM(lp.monto) AS monto_total,
  COUNT(*) FILTER (WHERE lp.status = 'Pagado') AS pagadas,
  SUM(lp.monto) FILTER (WHERE lp.status = 'Pagado') AS monto_pagado,
  COUNT(*) FILTER (WHERE lp.status = 'Informado') AS informadas,
  SUM(lp.monto) FILTER (WHERE lp.status = 'Informado') AS monto_informado,
  COUNT(*) FILTER (WHERE lp.status = 'Pendiente') AS pendientes,
  SUM(lp.monto) FILTER (WHERE lp.status = 'Pendiente') AS monto_pendiente,
  COUNT(*) FILTER (WHERE lp.status = 'Vencido') AS vencidas,
  SUM(lp.monto) FILTER (WHERE lp.status = 'Vencido') AS monto_vencido,
  -- KPIs de gestión
  ROUND(
    COUNT(*) FILTER (WHERE lp.status = 'Pagado')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1
  ) AS pct_cobro,
  ROUND(
    SUM(lp.monto) FILTER (WHERE lp.status = 'Pagado') / NULLIF(SUM(lp.monto), 0) * 100, 1
  ) AS pct_monto_cobrado
FROM loan_payments lp
JOIN loans l ON l.id = lp.loan_id
WHERE l.stage = 'Finalizado'
GROUP BY anio, mes, periodo
ORDER BY anio, mes;

-- ============================================================
-- VISTA: v_reportes_pipeline
-- Reporte de pipeline para toma de decisiones
-- ============================================================
CREATE OR REPLACE VIEW v_reportes_pipeline AS
SELECT
  l.stage,
  COUNT(*) AS cantidad,
  SUM(l.loan_amount) AS volumen_total,
  AVG(l.loan_amount) AS ticket_promedio,
  MIN(l.created_at) AS legajo_mas_antiguo,
  AVG(EXTRACT(EPOCH FROM (NOW() - l.created_at)) / 86400)::INT AS dias_promedio_en_stage,
  COUNT(*) FILTER (WHERE l.created_at > NOW() - INTERVAL '30 days') AS ingresados_30d,
  COUNT(*) FILTER (WHERE l.created_at > NOW() - INTERVAL '7 days') AS ingresados_7d
FROM loans l
WHERE l.stage NOT IN ('Rechazado')
GROUP BY l.stage
ORDER BY ARRAY_POSITION(
  ARRAY['Solicitud Inicial','Scoring','Pre Aprobación','Escribanía','Aprobación','Escritura','Finalizado'],
  l.stage
);

-- ============================================================
-- VISTA: v_reportes_agentes
-- Performance por agente
-- ============================================================
CREATE OR REPLACE VIEW v_reportes_agentes AS
SELECT
  p.id AS agente_id,
  p.nombre || ' ' || p.apellido AS agente,
  o.nombre AS oficina,
  COUNT(l.id) AS total_legajos,
  SUM(l.loan_amount) AS volumen_total,
  COUNT(*) FILTER (WHERE l.stage = 'Finalizado') AS finalizados,
  COUNT(*) FILTER (WHERE l.stage = 'Rechazado') AS rechazados,
  ROUND(
    COUNT(*) FILTER (WHERE l.stage = 'Finalizado')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1
  ) AS tasa_conversion
FROM profiles p
LEFT JOIN loans l ON l.agente_id = p.id
LEFT JOIN oficinas o ON p.oficina_id = o.id
WHERE p.rol = 'agente'
GROUP BY p.id, p.nombre, p.apellido, o.nombre;
```

---

## 4. Row Level Security (RLS) — Aislamiento de datos

### 4.1 Principio general

Cada tabla tiene RLS habilitado. Las policies filtran datos según el rol del usuario autenticado, consultando `profiles` para determinar su `rol`, `oficina_id` y `red_id`.

```sql
-- Helper function: obtener perfil del usuario actual
CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS profiles AS $$
  SELECT * FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: obtener rol
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT rol FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: obtener oficina_id
CREATE OR REPLACE FUNCTION get_my_oficina()
RETURNS UUID AS $$
  SELECT oficina_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: obtener red_id
CREATE OR REPLACE FUNCTION get_my_red()
RETURNS UUID AS $$
  SELECT red_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### 4.2 RLS para tabla `loans`

```sql
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Super admin: ve todo
CREATE POLICY loans_super_admin ON loans
  FOR ALL USING (get_my_role() = 'super_admin');

-- Red admin: ve loans de agentes de su red
CREATE POLICY loans_red_admin ON loans
  FOR SELECT USING (
    get_my_role() = 'red_admin'
    AND agente_id IN (
      SELECT id FROM profiles WHERE red_id = get_my_red()
    )
  );

-- Oficina admin: ve loans de agentes de su oficina
CREATE POLICY loans_oficina_admin ON loans
  FOR SELECT USING (
    get_my_role() = 'oficina_admin'
    AND agente_id IN (
      SELECT id FROM profiles WHERE oficina_id = get_my_oficina()
    )
  );

-- Agente: solo sus clientes asignados
CREATE POLICY loans_agente ON loans
  FOR ALL USING (
    get_my_role() = 'agente'
    AND agente_id = auth.uid()
  );

-- Cliente: solo su propio legajo
CREATE POLICY loans_cliente ON loans
  FOR SELECT USING (
    get_my_role() = 'cliente'
    AND cliente_id = auth.uid()
  );
```

### 4.3 RLS para `loan_payments` (hereda del loan)

```sql
ALTER TABLE loan_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY payments_access ON loan_payments
  FOR ALL USING (
    loan_id IN (SELECT id FROM loans)  -- hereda las policies de loans
  );
```

### 4.4 RLS para `config_global`

```sql
ALTER TABLE config_global ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer
CREATE POLICY config_read ON config_global
  FOR SELECT USING (TRUE);

-- Solo super_admin puede modificar
CREATE POLICY config_write ON config_global
  FOR UPDATE USING (get_my_role() = 'super_admin');
```

---

## 5. Autenticación y Workflow de Usuarios

### 5.1 Flujo de registro (simple, sin validación de email)

```
1. Usuario se registra con email + password → Supabase Auth crea usuario
2. Trigger on auth.users INSERT → crea profile con estado = 'pendiente'
3. Super admin ve en su panel "Usuarios pendientes de aprobación"
4. Super admin asigna rol, red, oficina → cambia estado a 'activo'
5. Hasta que no esté activo, el usuario ve pantalla "Esperando aprobación"
```

**Supuesto:** La opción gratuita de Resend no permite enviar emails de validación a cualquier dirección. Por lo tanto, el flujo de aprobación es manual por parte del admin.

### 5.2 Trigger de auto-creación de profile

```sql
-- Trigger que crea profile automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, nombre, apellido, rol, estado)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'cliente'),
    CASE
      WHEN NEW.email = 'panchobenegas@gmail.com' THEN 'activo'
      ELSE 'pendiente'
    END
  );

  -- Si es Pancho, asignar super_admin automáticamente
  IF NEW.email = 'panchobenegas@gmail.com' THEN
    UPDATE profiles SET rol = 'super_admin' WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 5.3 Carga masiva desde Excel

**Formato esperado del Excel:**

| Nombre | Apellido | Email | Oficina (código) | Rol |
|--------|----------|-------|-------------------|-----|
| María | Rodríguez | maria@cb.com | cb_palermo | agente |
| Carlos | Mendoza | carlos@cb.com | cb_belgrano | agente |

**Flujo en el front-end:**

```
1. Admin sube archivo .xlsx
2. Front parsea con SheetJS (ya disponible como dependencia)
3. Valida: emails únicos, oficinas existentes, roles válidos
4. Muestra preview con errores marcados en rojo
5. Admin confirma → bulk insert a user_invitations
6. Para cada invitación, se crea el usuario via Supabase Admin API
   (o queda como invitación pendiente si no se quiere crear sin que el usuario se registre)
```

**Función Supabase Edge (o RPC):**

```sql
-- Función para carga masiva de agentes
CREATE OR REPLACE FUNCTION bulk_create_agents(
  agents JSONB  -- [{nombre, apellido, email, oficina_codigo}]
)
RETURNS TABLE(email TEXT, status TEXT, message TEXT)
AS $$
DECLARE
  agent JSONB;
  oficina_row oficinas%ROWTYPE;
BEGIN
  FOR agent IN SELECT * FROM jsonb_array_elements(agents)
  LOOP
    -- Validar oficina
    SELECT * INTO oficina_row FROM oficinas
    WHERE codigo = agent->>'oficina_codigo' AND activa = TRUE;

    IF oficina_row IS NULL THEN
      email := agent->>'email';
      status := 'error';
      message := 'Oficina no encontrada: ' || agent->>'oficina_codigo';
      RETURN NEXT;
      CONTINUE;
    END IF;

    -- Crear invitación
    INSERT INTO user_invitations (email, nombre, apellido, rol, red_id, oficina_id, invitado_por)
    VALUES (
      agent->>'email',
      agent->>'nombre',
      agent->>'apellido',
      'agente',
      oficina_row.red_id,
      oficina_row.id,
      auth.uid()
    )
    ON CONFLICT DO NOTHING;

    email := agent->>'email';
    status := 'ok';
    message := 'Invitación creada';
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 6. Resend — Integración de Email

### 6.1 Limitaciones del plan gratuito

| Límite | Valor |
|--------|-------|
| Emails/día | 100 |
| Dominio | Solo desde dominio verificado o onboarding@resend.dev |
| Destinatarios en free | Solo tu email verificado |

**Implicancia:** En el plan gratuito, Resend solo puede enviar emails a la dirección verificada del owner (panchobenegas@gmail.com). No se pueden enviar emails de validación a usuarios arbitrarios.

### 6.2 Uso recomendado (fase mockup)

| Evento | Email a Pancho | Contenido |
|--------|:--------------:|-----------|
| Nuevo usuario registrado | ✓ | "Juan García (juan@email.com) se registró. Aprobar/Rechazar en el panel." |
| Nuevo legajo creado | ✓ | "Nuevo legajo TCMC-0005 de María López — USD 45.000 — Asesor: Carlos M." |
| Pago informado por cliente | ✓ | "Juan García informó pago de cuota 3 — USD 1,234.56 — Verificar comprobante." |
| Cambio de etapa | ✓ | "Legajo TCMC-0003 pasó de Scoring a Pre Aprobación." |

### 6.3 Implementación

```javascript
// Supabase Edge Function: send-notification
// Se invoca desde triggers de DB o desde el front

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = 'panchobenegas@gmail.com';

async function sendNotification(subject, htmlBody) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'TCMC <onboarding@resend.dev>',  // free tier
      to: [ADMIN_EMAIL],
      subject: `[TCMC] ${subject}`,
      html: htmlBody,
    }),
  });
  return res.json();
}
```

---

## 7. Módulo Cobranzas — Rediseño como Matriz Excel

### 7.1 Vista actual vs. propuesta

| Aspecto | Actual | Propuesto |
|---------|--------|-----------|
| Layout | Cards con drill-down (mes → día → cuota) | Tabla/grilla tipo spreadsheet |
| Exportación | No tiene | CSV y Excel (.xlsx) |
| Agrupación | Por mes → por día | Tabla plana con columnas Año, Mes |
| Filtros | No tiene | Por año, por estado, por oficina |

### 7.2 Estructura de la tabla en pantalla

La vista `v_cobranzas_matriz` alimenta directamente esta grilla:

| Año | Mes | Cant. Total | Monto Total | Pagadas | Monto Pagado | Informadas | Pendientes | Vencidas | % Cobro |
|-----|-----|:-----------:|:-----------:|:-------:|:------------:|:----------:|:----------:|:--------:|:-------:|
| 2026 | Ene | 4 | USD 5,236 | 2 | USD 2,618 | 1 | 1 | 0 | 50.0% |
| 2026 | Feb | 4 | USD 5,236 | 1 | USD 1,309 | 0 | 3 | 0 | 25.0% |
| ... | | | | | | | | | |
| **TOTAL** | | **48** | **USD 62,832** | **12** | **USD 15,708** | **3** | **33** | **0** | **25.0%** |

**Acciones en la grilla:**
- Click en fila → expande detalle de cuotas de ese mes
- Botón "Exportar CSV" → descarga la grilla completa
- Botón "Exportar Excel" → descarga con formato y totales
- Filtros: año, oficina, agente

### 7.3 Export CSV/Excel desde el front

```javascript
// CSV export (nativo, sin dependencias)
function exportToCSV(data, filename) {
  const headers = ['Año','Mes','Cantidad Total','Monto Total','Pagadas','Informadas','Pendientes','Vencidas','% Cobro'];
  const rows = data.map(r => [r.anio, r.mes, r.cantidad_total, r.monto_total, r.pagadas, r.informadas, r.pendientes, r.vencidas, r.pct_cobro]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
}

// Excel export (SheetJS ya está disponible como CDN)
function exportToExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Cobranzas');
  XLSX.utils.sheet_add_aoa(ws, [['Año','Mes','Cant. Total','Monto Total','Pagadas','Informadas','Pendientes','Vencidas','% Cobro']], {origin: 'A1'});
  XLSX.writeFile(wb, filename);
}
```

---

## 8. Módulo Reportes — Rediseño con lógica de gestión

### 8.1 Reportes propuestos

**Reporte 1: Pipeline por Etapa (gestión de embudo)**

| Etapa | Legajos | Volumen USD | Ticket Prom. | Días Prom. | Ingreso 30d | Semáforo |
|-------|:-------:|:-----------:|:------------:|:----------:|:-----------:|:--------:|
| Solicitud Inicial | 12 | 480K | 40K | 5 | 8 | 🟢 |
| Scoring | 8 | 320K | 40K | 12 | 3 | 🟡 |
| Pre Aprobación | 5 | 225K | 45K | 18 | 2 | 🟡 |
| Escribanía | 3 | 135K | 45K | 25 | 1 | 🔴 |
| Aprobación | 2 | 90K | 45K | 8 | 1 | 🟢 |
| Escritura | 1 | 45K | 45K | 3 | 1 | 🟢 |
| **Finalizado** | **4** | **180K** | **45K** | — | **1** | — |

**Semáforo:** Basado en días promedio en stage vs. benchmark configurable.

**Reporte 2: Performance por Agente**

| Agente | Oficina | Legajos | Volumen | Finalizados | Rechazados | Conversión |
|--------|---------|:-------:|:-------:|:-----------:|:----------:|:----------:|
| María Rodríguez | Palermo | 15 | 600K | 8 | 2 | 53% |
| Carlos Mendoza | Belgrano | 10 | 400K | 4 | 3 | 40% |

**Reporte 3: Resumen Financiero**

| Métrica | Valor |
|---------|-------|
| Cartera total originada | USD 1.2M |
| Cartera activa (finalizados) | USD 450K |
| Cuotas cobradas (acumulado) | USD 125K |
| Cuotas pendientes (próximos 90d) | USD 45K |
| Morosidad (vencidas / total) | 2.3% |
| Tasa de conversión global | 42% |
| Ticket promedio | USD 42K |

Todos estos reportes son exportables a CSV/Excel.

---

## 9. Plan de Implementación por Fases

### Fase 1: Infraestructura (1-2 días)

| # | Tarea | Detalle |
|---|-------|---------|
| 1.1 | Crear proyecto Supabase | Dashboard → New project → anotar URL + anon key |
| 1.2 | Ejecutar migraciones SQL | Copiar DDL de sección 3.2 en SQL Editor |
| 1.3 | Crear vistas SQL | Copiar vistas de sección 3.3 |
| 1.4 | Configurar RLS | Copiar policies de sección 4 |
| 1.5 | Seed data: red, oficinas, tu usuario | INSERT redes, oficinas; registrar panchobenegas@gmail.com |
| 1.6 | Obtener API key de Resend | resend.com → API Keys → crear key |

### Fase 2: Auth y Gestión de Usuarios (2-3 días)

| # | Tarea | Detalle |
|---|-------|---------|
| 2.1 | Integrar Supabase JS client en index.html | CDN: `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">` |
| 2.2 | Reescribir LoginPage | Auth con supabase.auth.signInWithPassword() |
| 2.3 | Pantalla "Pendiente de aprobación" | Si profile.estado ≠ 'activo', mostrar mensaje |
| 2.4 | Panel admin: Usuarios pendientes | Lista con botón Aprobar/Rechazar + asignar rol/oficina |
| 2.5 | Panel admin: ABM Oficinas | CRUD de oficinas dentro de la red |
| 2.6 | Panel admin: Carga masiva Excel | Upload + parse + preview + bulk insert |
| 2.7 | Sidebar dinámico por rol real | navItems según profile.rol de Supabase |

### Fase 3: Persistencia de Loans (2-3 días)

| # | Tarea | Detalle |
|---|-------|---------|
| 3.1 | Reemplazar MOCK_CLIENTS por query a Supabase | `supabase.from('loans').select('*')` con filtros por rol |
| 3.2 | ClientNewRequest → INSERT en loans | + INSERT documentos iniciales |
| 3.3 | AdminLegajos → UPDATE loans | Cambiar etapa, agregar observaciones |
| 3.4 | AdminConfig → UPDATE config_global | Persistir tasas/plazos en Supabase |
| 3.5 | ClientSimulator → leer config_global | Tasas y plazos dinámicos desde DB |
| 3.6 | Generar cronograma de pagos | Al pasar a "Finalizado", INSERT payments |

### Fase 4: Cobranzas y Reportes (2-3 días)

| # | Tarea | Detalle |
|---|-------|---------|
| 4.1 | Rediseñar AdminCobranzas | Grilla tipo Excel con v_cobranzas_matriz |
| 4.2 | Agregar export CSV/Excel | Botones con SheetJS |
| 4.3 | Rediseñar AdminReports | 3 sub-reportes con vistas SQL |
| 4.4 | Agregar filtros por oficina/agente/periodo | Dropdowns que filtran queries |

### Fase 5: Notificaciones (1 día)

| # | Tarea | Detalle |
|---|-------|---------|
| 5.1 | Crear Edge Function en Supabase | send-notification con Resend |
| 5.2 | Conectar eventos → notificación | Registro, nuevo legajo, pago informado, cambio etapa |

### Fase 6: QA y Polish (1-2 días)

| # | Tarea | Detalle |
|---|-------|---------|
| 6.1 | Probar flujo completo por cada rol | Admin, red, oficina, agente, cliente |
| 6.2 | Verificar aislamiento RLS | Cada rol ve solo lo que debe |
| 6.3 | Probar carga masiva con Excel real | 50+ registros |
| 6.4 | Probar exports CSV/Excel | Validar formato y datos |

---

## 10. Cambios en el index.html — Mapa de impacto

| Componente actual | Cambio requerido | Impacto |
|-------------------|-----------------|---------|
| `LoginPage` | Reescribir con Supabase Auth | Alto |
| `App` (estado) | Reemplazar `useState(MOCK_CLIENTS)` por fetch a Supabase | Alto |
| `Sidebar` | Eliminar role-switcher demo, usar rol real | Medio |
| `ClientSimulator` | Leer config desde Supabase | Bajo |
| `ClientNewRequest` | INSERT a Supabase en vez de setState local | Medio |
| `AdminConfig` | UPDATE config_global en Supabase | Bajo |
| `AdminLegajos` | UPDATE loans via Supabase | Medio |
| `AdminCobranzas` | Reescribir como grilla + export | Alto |
| `AdminReports` | Reescribir con 3 sub-reportes + export | Alto |
| **Nuevo:** `AdminUsuarios` | Componente nuevo: pendientes + ABM + carga masiva | Alto |
| **Nuevo:** `AdminOficinas` | Componente nuevo: ABM oficinas | Medio |
| **Nuevo:** `PendingApproval` | Pantalla para usuarios no aprobados | Bajo |

---

## 11. Setup de Supabase — Paso a paso

### Prerequisitos
1. Cuenta en [supabase.com](https://supabase.com) (free tier)
2. Cuenta en [resend.com](https://resend.com) (free tier)

### Pasos

```
1. supabase.com → Dashboard → New Project
   - Name: tcmc-prod
   - Region: South America (São Paulo) — más cerca de Argentina
   - Password: [generar y guardar]

2. Project Settings → API
   - Copiar: Project URL → SUPABASE_URL
   - Copiar: anon/public key → SUPABASE_ANON_KEY

3. SQL Editor → ejecutar:
   - DDL de tablas (sección 3.2)
   - Vistas (sección 3.3)
   - RLS policies (sección 4)
   - Trigger handle_new_user (sección 5.2)

4. Authentication → Settings → Email:
   - Desactivar "Confirm email" (para simplificar el mockup)
   - O mantenerlo activo y aprobar manualmente

5. Registrar tu usuario:
   - supabase.auth.signUp({ email: 'panchobenegas@gmail.com', password: '...' })
   - El trigger automáticamente crea tu profile como super_admin

6. resend.com → API Keys → Create key → copiar RESEND_API_KEY
```

### Variables a configurar en el index.html

```javascript
// Al inicio del <script type="text/babel">
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## 12. Consideraciones y Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|:----------:|:------:|-----------|
| RLS mal configurado expone datos | Media | Alto | Testear con cada rol antes de producción |
| Free tier Supabase: 500MB storage, 50K auth users | Baja (mockup) | Bajo | Suficiente para MVP |
| Resend free tier: solo envía a tu email | Alta | Bajo | Diseñado así — notificaciones al admin |
| Latencia en queries con JOINs complejos | Baja | Medio | Vistas materialized si escala |
| index.html se hace demasiado grande (>5000 líneas) | Alta | Medio | Considerar split en archivos separados post-MVP |

---

## 13. Próximos Pasos

1. **Revisar este plan** — ¿falta algún caso de uso o regla de negocio?
2. **Crear proyecto Supabase** — necesito la URL y anon key para arrancar
3. **Elegir por qué fase empezar** — recomiendo Fase 1 + 2 juntas
4. **Implementar** — ediciones quirúrgicas sobre el index.html actual
