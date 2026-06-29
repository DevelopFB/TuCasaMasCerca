# Camino 1 — DIY completo (vos hacés todo)

Tutorial paso a paso ultra-detallado. Asume **cero experiencia previa** con Airtable y Softr. Si seguís este documento al pie de la letra, en 30-40 horas tenés la app productiva funcionando.

**Audiencia:** Pancho (o cualquier persona no técnica con paciencia).
**Tiempo:** 4-5 fines de semana (5-8 hs por sesión).
**Costo:** USD 0 desarrollo + USD ~100/mes operación.

---

## ⚙️ Pre-requisitos (30 min)

### Crear cuentas

1. **Airtable** → https://airtable.com/signup
   - Email + Google login (recomendado)
   - Plan: empezás Free, subís a Team (USD 20/mes) en la semana 3

2. **Softr** → https://softr.io/signup
   - Email + Google login
   - Plan: Free para empezar, Pro (USD 49/mes) en la semana 4

3. **Resend** → https://resend.com/signup
   - Para emails transaccionales
   - Free tier: 3.000 emails/mes (suficiente para tu volumen)

4. **Nic.ar** (cuando vayas a comprar dominio) → https://nic.ar
   - Necesitás CUIT/DNI argentino
   - Costo: ARS ~2.700/año (`app.tucasamascerca.com.ar`)

### Herramientas que vas a necesitar abiertas

- Esta carpeta `Opcion-A-Airtable-Softr/` en Finder
- Navegador con 3 pestañas: Airtable, Softr, este documento
- Editor de texto para anotar tus IDs (de tabla, de view, de API keys) — usar Notes / TextEdit / Notion

---

## 🗓 SEMANA 1 — Airtable: tablas y datos

**Objetivo final de la semana:** Tener una base Airtable con 9 tablas, fórmulas funcionando y 5 legajos de prueba cargados.

### Sesión 1A (Sábado mañana, 4 horas) — Crear base y primeras 4 tablas

#### Paso 1: Crear la base (5 min)
1. Ingresá a https://airtable.com
2. Click en **"+ Create a base"**
3. Elegí **"Start from scratch"**
4. Nombre: `TCMC` — Color: azul
5. Workspace: dejá el default (después podés moverla)

#### Paso 2: Tabla 1 — Profiles (40 min)
La tabla por defecto se llama "Table 1". La vamos a renombrar y configurar.

1. Doble click en "Table 1" arriba → renombrar a `Profiles`
2. Borrá las columnas que vienen por default (Name, Notes, Attachments, Status) — click derecho → Delete field
3. Crear los campos uno por uno (botón **"+"** al final):

| Field name | Field type | Configuración |
|------------|-----------|---------------|
| Nombre | Single line text | (default) |
| Apellido | Single line text | (default) |
| Email | Email | (default) |
| Teléfono | Phone number | Formato: International |
| DNI | Single line text | (default) |
| Rol | Single select | Options: `super_admin`, `admin_red`, `jefe_oficina`, `asesor`, `cliente` (colores: rojo, púrpura, ámbar, verde, azul) |
| Estado | Single select | Options: `Activo` (verde), `Pendiente aprobación` (amarillo), `Inactivo` (gris) |
| Fecha registro | Created time | (default) |
| Última actualización | Last modified time | (default) |
| Avatar | Attachment | Opcional |

> **No agregues todavía** los campos "Oficina", "Legajos como cliente", "Legajos como asesor" — esos son Linked Records que crearemos al final cuando existan todas las tablas.

#### Paso 3: Tabla 2 — Oficinas (15 min)
1. Click en **"+"** al lado del nombre "Profiles" arriba → **"Add or import"** → **"Start from scratch"**
2. Nombre: `Oficinas`
3. Crear campos:

| Field name | Field type |
|------------|-----------|
| Nombre | Single line text (primary field, ya está) |
| Código | Single line text |
| Dirección | Single line text |
| Teléfono | Phone number |
| Email contacto | Email |
| Estado | Single select: `Activa` / `Inactiva` |

4. **Cargar datos iniciales** (3 oficinas):
   - CB Palermo / ofi001 / Av. Santa Fe 3200 / +54 11 4444-0001 / palermo@coldwell.com / Activa
   - CB Belgrano / ofi002 / Av. Cabildo 1500 / +54 11 4444-0002 / belgrano@coldwell.com / Activa
   - CB Recoleta / ofi003 / Av. Las Heras 2100 / +54 11 4444-0003 / recoleta@coldwell.com / Activa

#### Paso 4: Tabla 3 — Legajos (90 min) — LA MÁS COMPLEJA
Esta es la tabla central. Tomate tu tiempo.

1. Crear tabla `Legajos` (igual que las anteriores)
2. Borrar columnas default
3. Crear campos por bloques:

**Bloque "ID y cliente":**

| Field name | Field type | Configuración |
|------------|-----------|---------------|
| Número legajo | Autonumber | (Airtable lo numera solo) |
| ID público | Formula | Fórmula: `"TCMC-" & RIGHT("0000" & {Número legajo}, 4)` |

**Bloque "Datos del crédito":**

| Field name | Field type | Configuración |
|------------|-----------|---------------|
| Monto solicitado (USD) | Number | Format: Integer, no decimals |
| Valor propiedad (USD) | Number | Format: Integer |
| Valor ofertado (USD) | Number | Format: Integer |
| Plazo (meses) | Single select | 12 / 24 / 36 / 48 / 60 |
| Tasa anual aplicada | Number | Decimal, 4 decimales |
| Monto bruto (USD) | Formula | `{Monto solicitado (USD)} + ({Monto solicitado (USD)} * 0.05 * 1.21)` |
| LTV % | Formula | `IF({Valor ofertado (USD)}>0, ROUND({Monto solicitado (USD)}/{Valor ofertado (USD)}*100, 1), 0)` |

**Bloque "Cuota PMT" (la más complicada):**

| Field name | Field type | Configuración |
|------------|-----------|---------------|
| Cuota mensual estimada | Formula | (ver fórmula abajo) |

Fórmula completa de Cuota:
```
IF(
  AND({Monto bruto (USD)}>0, VALUE({Plazo (meses)})>0, {Tasa anual aplicada}>0),
  ROUND(
    {Monto bruto (USD)} *
    (({Tasa anual aplicada}/12) * POWER(1 + {Tasa anual aplicada}/12, VALUE({Plazo (meses)}))) /
    (POWER(1 + {Tasa anual aplicada}/12, VALUE({Plazo (meses)})) - 1),
    2
  ),
  0
)
```

> **Tip:** Pegá la fórmula completa de una vez. Si te tira error, revisá que los nombres de campo entre `{}` coincidan exacto con los que creaste (case-sensitive).

**Bloque "Propiedad":**

| Field name | Field type |
|------------|-----------|
| Link propiedad CB | URL |
| Código CB | Single line text |
| Dirección inmueble | Long text |

**Bloque "Workflow":**

| Field name | Field type | Configuración |
|------------|-----------|---------------|
| Etapa | Single select | Options: `Solicitud Inicial` / `Scoring` / `Pre Aprobación` / `Escribanía` / `Aprobación` / `Escritura` / `Finalizado` / `Rechazado` (colores: slate, ámbar, azul, púrpura, índigo, cyan, verde, rojo) |
| Estado | Single select | `En proceso` / `Activo` / `Finalizado` / `Rechazado` |
| Fecha solicitud | Created time | (default) |
| Fecha última actualización | Last modified time | (default) |
| Fecha escritura | Date | Solo se completa al pasar a Finalizado |
| Motivo rechazo | Long text | |

**Bloque "Codeudor":**

| Field name | Field type |
|------------|-----------|
| Tiene codeudor | Checkbox |
| Codeudor nombre | Single line text |
| Codeudor apellido | Single line text |
| Codeudor DNI | Single line text |
| Codeudor vínculo | Single select: Cónyuge / Padre/Madre / Hermano/a / Hijo/a / Otro |
| Codeudor ingresos anuales | Number (decimal) |

**Bloque "Docs post-finalización":**

| Field name | Field type |
|------------|-----------|
| Escritura | Attachment |
| Hipoteca | Attachment |

> Por ahora no agregues "Cliente" ni "Asesor asignado" — son Linked Records. Los hacemos en la sesión 1B.

#### Paso 5: Tabla 4 — Documentos (20 min)

| Field name | Field type | Configuración |
|------------|-----------|---------------|
| Nombre documento | Single line text (primary) | |
| Tipo | Single select | `DNI Frente` / `DNI Dorso` / `Comprobante domicilio` / `Declaración ingresos` / `Reserva crédito` / `Otro` |
| Archivo | Attachment | |
| Estado | Single select | `Pendiente` / `Aprobado` / `Observado` |
| Fecha subida | Created time | |
| Fecha revisión | Date | |
| Comentario revisor | Long text | |

### Sesión 1B (Sábado tarde o domingo, 4 horas) — Tablas 5-9 + relaciones

#### Paso 6: Tablas 5, 6, 7, 8, 9 (60 min)
Crear las tablas restantes con la estructura del `02-Airtable-Schema.md`. Te resumo:

- **Observaciones** (5 campos): Texto, Tipo, Fecha, Visible al cliente
- **Cuotas** (5 campos): Número cuota, Vencimiento, Monto USD, Estado, Días atraso (formula)
- **Pagos** (6 campos): Fecha pago, Monto, Banco origen, Comprobante, Estado, Fecha confirmación
- **Leads** (15 campos): Datos del simulador + UTM tracking
- **Notificaciones** (8 campos): Log de emails enviados

> Si querés sobre algún campo más detalle: abrí `02-Airtable-Schema.md` y copiá exacto.

#### Paso 7: Crear todas las Linked Records (45 min)
Ahora que existen todas las tablas, conectalas:

1. **En Profiles**:
   - Field: `Oficina` → Link to another record → Oficinas
2. **En Legajos**:
   - Field: `Cliente` → Link to Profiles (filter: Rol = cliente, lo configurás después en Views)
   - Field: `Asesor asignado` → Link to Profiles
   - Field: `Oficina` → Lookup → Asesor asignado.Oficina
   - Field: `Documentos` → Link to Documentos
   - Field: `Observaciones` → Link to Observaciones
   - Field: `Cuotas` → Link to Cuotas
3. **En Documentos**:
   - Field: `Legajo` → Link to Legajos
   - Field: `Subido por` → Link to Profiles
4. **En Observaciones**:
   - Field: `Legajo` → Link to Legajos
   - Field: `Creado por` → Link to Profiles
5. **En Cuotas**:
   - Field: `Legajo` → Link to Legajos
   - Field: `Pago` → Link to Pagos
6. **En Pagos**:
   - Field: `Cuota` → Link to Cuotas
7. **En Leads**:
   - Field: `Asesor asignado` → Link to Profiles
   - Field: `Legajo creado` → Link to Legajos
8. **En Notificaciones**:
   - Field: `Legajo` → Link to Legajos
   - Field: `Destinatario` → Link to Profiles

#### Paso 8: Lookups y Rollups (30 min)
Después de las relaciones, agregar los campos calculados que dependen de ellas:

**En Legajos**:
- `Nombre cliente` = Lookup → Cliente.Nombre
- `Email cliente` = Lookup → Cliente.Email
- `Total cuotas pendientes` = Count of Cuotas where Estado = Pendiente (Rollup)
- `Días máximo atraso` = MAX(Cuotas.Días atraso) (Rollup)
- `Estado de pago` = Formula:
```
IF({Días máximo atraso} = 0, "Al día",
  IF({Días máximo atraso} <= 5, "Atraso <5d", "Atraso >5d"))
```

**En Cuotas**:
- `Días atraso` = Formula:
```
IF(AND({Estado}!="Pagada", IS_BEFORE({Vencimiento}, TODAY())),
   DATETIME_DIFF(TODAY(), {Vencimiento}, 'days'), 0)
```

#### Paso 9: Crear Vistas (Views) en cada tabla (45 min)
Las vistas son filtros guardados — fundamentales para el frontend.

**En Legajos**, crear estas vistas (botón **"+ Create..." → Grid view**):
- **Pipeline** — Group by Etapa
- **Por asesor** — Group by Asesor asignado
- **Por oficina** — Group by Oficina
- **Solo finalizados** — Filter: Etapa = Finalizado
- **Cobranzas** — Filter: Etapa = Finalizado AND Total cuotas pendientes > 0
- **Con atrasos +5 días** — Filter: Días máximo atraso > 5
- **Rechazados** — Filter: Etapa = Rechazado

**En Profiles**:
- **Solo clientes** — Filter: Rol = cliente
- **Solo asesores** — Filter: Rol = asesor
- **Pendientes aprobación** — Filter: Estado = Pendiente aprobación
- **Equipo interno** — Filter: Rol ≠ cliente

**En Cuotas**:
- **Vencidas** — Filter: Estado = Vencida
- **Próximas a vencer** — Filter: Vencimiento entre TODAY() y TODAY()+7 AND Estado = Pendiente

#### Paso 10: Cargar 5 legajos de prueba (30 min)
Para poder testear todo después.

Crear 5 clientes en Profiles (Rol: cliente), 2-3 asesores (Rol: asesor) asociados a Oficinas, y 5 legajos:
- 1 en Solicitud Inicial
- 1 en Scoring
- 1 en Pre Aprobación
- 1 en Finalizado (con fecha escritura — para poder generar cuotas)
- 1 Rechazado

**Verificación:** abrí la vista "Pipeline" → tenés que ver los 5 legajos agrupados por su Etapa.

### Sesión 1C (Entre semana, 1-2 horas) — Automatizaciones básicas

#### Paso 11: Automation 1 — Nueva solicitud (30 min)
1. En la base TCMC, click en **Automations** (arriba a la derecha)
2. Click **"+ Create automation"**
3. Nombre: `Notificar nuevo legajo`
4. Trigger: **When record is created** → Table: Legajos
5. Action 1: **Send email**
   - To: tu email (`panchobenegas@gmail.com`) por ahora — después cambiamos a `{Asesor asignado.Email}`
   - Subject: `Nuevo legajo creado: {Nombre cliente} {Apellido cliente}`
   - Body: HTML con datos del legajo
6. **Test** → Run con el último registro creado → verificá que llega el email
7. **Turn on** ✅

#### Paso 12: Automation 2 — Cambio de etapa (20 min)
1. Nueva automation: `Notificar cambio etapa`
2. Trigger: **When record matches conditions** → Table: Legajos → Condition: Etapa = changes
3. Action: Send email al cliente

#### Paso 13: Conectar Resend (15 min)
Para emails con dominio propio (en vez de gmail genérico):
1. En Resend dashboard → Domains → Add domain → `tucasamascerca.com.ar`
2. Te da 3 DNS records (SPF, DKIM, MX) → cargarlos en Nic.ar (cuando compres el dominio) o en tu DNS actual
3. Una vez verificado: en Airtable Automations, cambiá "Send email" por "Run script" con código de Resend API (te lo paso si lo necesitás)

> Por ahora dejá Airtable Email Action default. Migrás a Resend en Semana 4.

**✅ Fin Semana 1.** Tenés Airtable funcional con datos y emails básicos.

---

## 🗓 SEMANA 2 — Softr: portal cliente y asesor

### Sesión 2A (Sábado, 5 horas) — Setup Softr

#### Paso 14: Crear app en Softr (15 min)
1. https://studio.softr.io/ → **"+ New application"**
2. Elegí **"Start from scratch"** (template "Blank")
3. Nombre: `TCMC App`
4. Click "Create"

#### Paso 15: Conectar Airtable (10 min)
1. En el editor de Softr → sidebar izquierda → **"Data Sources"**
2. Click **"+ Add data source"** → Airtable
3. Authenticate con Personal Access Token (lo generás en https://airtable.com/create/tokens)
   - Scopes: data.records:read, data.records:write, schema.bases:read
   - Bases: TCMC
4. Una vez conectado, Softr lee todas tus tablas

#### Paso 16: Branding base (30 min)
1. Settings → **Site settings**:
   - Site name: `Tu Casa +Cerca`
   - Favicon: subir el de TCMC
   - OG image: la del brandbook
2. Settings → **Style**:
   - Primary color: `#1A4394`
   - Accent color: `#0D00FF`
3. Settings → **Typography**:
   - Heading font: **Outfit** (Google Fonts)
   - Body font: **Outfit**
4. Settings → **Custom Code** → Header:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

#### Paso 17: Configurar User Groups (20 min)
1. Settings → **Users** → User Groups
2. Crear 3 grupos:
   - **Clientes** — condition: Rol = cliente
   - **Asesores** — condition: Rol = asesor
   - **Admins** — condition: Rol IN [super_admin, admin_red, jefe_oficina]
3. Settings → **Users** → Sign-In Settings:
   - Method: Email + Password
   - Data Source: Airtable Profiles
   - Email field: Email
   - Password: Softr maneja (campo extra que crea automático)

#### Paso 18: Login + Signup pages (40 min)
Softr trae estas dos páginas por default. Solo customizarlas:

**Login:**
1. Click en "Sign In" en el sidebar de páginas
2. Block "Sign In Form" → customizar:
   - Title: "Bienvenido a Tu Casa +Cerca"
   - Color del botón: brand primary
   - Logo arriba: subir el del TCMC
3. **Logged in redirect** (settings de la página):
   - If Rol = cliente → `/cliente/dashboard`
   - If Rol = asesor → `/asesor/dashboard`
   - If Rol IN admins → `/admin/dashboard`

**Signup:**
1. Block "Sign Up Form"
2. Fields: Nombre, Apellido, Email, Teléfono, DNI, Password
3. **Submit action**: Create record in Profiles con Rol="cliente", Estado="Pendiente aprobación"
4. Success message: "¡Gracias por registrarte! Un administrador revisará tu cuenta y te notificará por email."

### Sesión 2B (Domingo, 5 horas) — Portal Cliente completo

#### Paso 19: Página `/cliente/dashboard` (60 min)
1. Sidebar → **"+ Add page"** → URL: `cliente/dashboard`
2. Settings de la página → Visibility → Only visible to: **Clientes** group
3. Agregar bloques:

**Block 1: Hero**
- Tipo: "Hero" simple
- Title: `Hola, {{logged_in_user.firstname}}`
- Subtitle: `Este es el estado de tu solicitud`

**Block 2: Single record detail**
- Connect to: Legajos
- Filter: `Cliente.Email IS {logged_in_user.email}`
- Layout: Card grande
- Fields a mostrar: ID público, Etapa (con badge), Monto solicitado, Plazo, Cuota estimada, Asesor asignado, Fecha solicitud
- Hide if no record: "Aún no tenés una solicitud iniciada"

**Block 3: Stats**
- 4 cards: Total documentos, Aprobados, Pendientes, Observados (datos de Legajos.Documentos)

**Block 4: List**
- Connect to: Observaciones
- Filter: `Legajo.Cliente.Email IS {logged_in_user.email}` AND `Visible al cliente IS TRUE`
- Mostrar últimas 3

**Block 5: CTA buttons**
- "Subir documentos" → link a `/cliente/documentos`
- "Ver mis pagos" → link a `/cliente/pagos`

#### Paso 20: Página `/cliente/documentos` (45 min)
- Block 1: List de Documentos filtrados por `Legajo.Cliente.Email = {logged_in_user.email}`
- Block 2: Form de upload (Create record en Documentos)

#### Paso 21: Páginas `/cliente/pagos`, `/perfil`, `/soporte` (60 min)
Similar a las anteriores, siguiendo `03-Softr-Layout.md`.

#### Paso 22: Test cliente (15 min)
1. Logout
2. Loguearte como uno de tus clientes de prueba (creá password manualmente desde Profiles si no se hizo en signup)
3. Verificá que solo ves TU legajo, no los de otros
4. Subí un documento → verificá que aparece en Airtable

### Sesión 2C (Entre semana, 2 horas) — Portal Asesor

#### Paso 23: Páginas `/asesor/*` (90 min)
Seguir `03-Softr-Layout.md` sección "PORTAL ASESOR":
- Dashboard con tabla filtrada
- Pipeline (Kanban block de Softr)
- Detalle de legajo con tabs

#### Paso 24: Test asesor (15 min)
- Login como asesor → ver solo legajos asignados

**✅ Fin Semana 2.** Cliente y asesor funcionando.

---

## 🗓 SEMANA 3 — Backoffice Admin + Automatizaciones

### Sesión 3A (Sábado, 5 horas) — Backoffice Admin completo

Las 10 páginas de `/admin/*` siguiendo `03-Softr-Layout.md`.

> **Tip:** muchas páginas del admin son similares (lista filtrada + acciones). Una vez que armás `/admin/legajos`, las demás son rápido.

### Sesión 3B (Domingo, 3 horas) — Automatizaciones avanzadas

#### Paso 25: Automation 3 — Generar cuotas al finalizar (60 min)
La más compleja. Requiere "Run script" de Airtable.

1. Nueva Automation: `Generar cronograma cuotas`
2. Trigger: When record matches conditions → Etapa = Finalizado AND Fecha escritura IS NOT empty
3. Action: **Run a script**:

```javascript
let inputConfig = input.config();
let legajoId = inputConfig.recordId;
let legajos = base.getTable("Legajos");
let cuotas = base.getTable("Cuotas");

let legajo = await legajos.selectRecordAsync(legajoId, {
  fields: ["Plazo (meses)", "Cuota mensual estimada", "Fecha escritura"]
});

let plazo = parseInt(legajo.getCellValue("Plazo (meses)").name);
let cuotaMonto = legajo.getCellValue("Cuota mensual estimada");
let fechaEscritura = new Date(legajo.getCellValue("Fecha escritura"));

let recordsToCreate = [];
for (let i = 1; i <= plazo; i++) {
  let venc = new Date(fechaEscritura);
  venc.setMonth(venc.getMonth() + i);
  recordsToCreate.push({
    fields: {
      "Número cuota": i,
      "Vencimiento": venc.toISOString().split('T')[0],
      "Monto USD": cuotaMonto,
      "Estado": { name: "Pendiente" },
      "Legajo": [{ id: legajoId }]
    }
  });
}

while (recordsToCreate.length > 0) {
  await cuotas.createRecordsAsync(recordsToCreate.slice(0, 50));
  recordsToCreate = recordsToCreate.slice(50);
}
```

4. Test con un legajo en Finalizado → verificá que se crean N cuotas.

#### Paso 26: Automation 4 — Cuota próxima a vencer (45 min)
1. Trigger: **Scheduled** → Daily at 9am
2. Find records in Cuotas where Estado=Pendiente AND Vencimiento between TODAY and TODAY+7
3. For each: Send email al cliente

#### Paso 27: Automation 5 — Doc subido notifica asesor (15 min)
1. Trigger: When record created in Documentos
2. Send email to: `{Legajo.Asesor asignado.Email}`

### Sesión 3C (Entre semana, 1 hora) — Templates email branded

#### Paso 28: HTML templates en Resend (60 min)
Crear 3 templates con branding (logo, colores, font Outfit):
- `welcome.html`
- `stage-change.html`
- `payment-due.html`

> Si te trabás con HTML, usá un editor visual como https://stripo.email/ (free)

**✅ Fin Semana 3.** App completa funcional.

---

## 🗓 SEMANA 4 — Testing, dominio, go-live

### Sesión 4A (Sábado, 3 horas) — Testing end-to-end

Simulá el flujo completo con 1 cliente, 1 asesor, 1 admin. Anotá bugs.

### Sesión 4B (Domingo, 3 horas) — Pulido y branding

- Custom CSS final
- Ajustes responsive en celular (revisar página por página)
- Subir todos los assets

### Sesión 4C (Lunes, 1 hora) — Dominio
1. Comprar `app.tucasamascerca.com.ar` en Nic.ar
2. En Softr: Settings → Custom Domain → seguir DNS
3. Esperar SSL (5-10 min)

### Sesión 4D (Martes, 1 hora) — Upgrade a Pro
1. Softr → Billing → Pro plan (USD 49/mes, mejor anual)
2. Quitar watermark "Made with Softr"

### Sesión 4E (Miércoles, 1 hora) — Onboarding equipo
- Crear cuentas reales de asesores
- Sesiones de 30 min para mostrar la app

**✅ Fin Semana 4.** En producción.

---

## 🆘 Si te trabás

### Errores comunes en Airtable

| Problema | Solución |
|----------|----------|
| La fórmula PMT da #ERROR! | Verificá que Plazo sea VALUE() porque es Single select (texto). |
| Los Lookups muestran vacío | Verificá que el campo Linked Record esté cargado en ese registro. |
| Automation no envía email | Test manual, ver Run history. Verificá que tenés crédito en Airtable. |
| La vista Filter no funciona | Las fórmulas booleanas: usá `IS NOT empty` en vez de `!= NULL`. |

### Errores comunes en Softr

| Problema | Solución |
|----------|----------|
| Cliente ve legajos de otros | Verificá el Filter: `Cliente.Email IS {logged_in_user.email}` (case sensitive). |
| No puedo loguearme | El usuario tiene que existir en Profiles con Email válido + password seteado. |
| El form de upload no guarda en Airtable | Permission del Personal Access Token: debe tener `data.records:write`. |
| Custom CSS no se aplica | Hay que publicar el sitio para que tome efecto (no se ve en preview). |

### Recursos

- **Airtable Universe** — plantillas y ejemplos: https://airtable.com/universe
- **Airtable Community** — preguntás y responden: https://community.airtable.com
- **Softr Help Center** — https://help.softr.io
- **Softr Community** — https://community.softr.io (muy activa, en inglés)
- **YouTube canal "Airtable"** — tutoriales oficiales gratis

### Si después de 1 hora no resolvés algo
- **No te frustres.** Contratá 1-2 horas de un freelance en Workana o Upwork → "Airtable expert" o "Softr expert". USD 30-60 te destraban el problema puntual.

---

## ⏱ Tiempo total estimado

| Semana | Horas | Acumulado |
|--------|-------|-----------|
| 1 — Airtable | 11 hs | 11 hs |
| 2 — Softr portal cliente + asesor | 12 hs | 23 hs |
| 3 — Backoffice + automations | 9 hs | 32 hs |
| 4 — Testing y go-live | 5 hs | 37 hs |
| **TOTAL** | | **~37 horas** |

A razón de 8-10 hs/semana (fines de semana), llegás al go-live en **4-5 semanas calendario**.

---

## ✅ Checklist final pre-go-live

(El mismo del `04-Plan-Operativo-Semanal.md`, replicado acá para tenerlo a mano)

- [ ] 9 tablas Airtable con todos los campos y fórmulas
- [ ] 5 automations activas y testeadas
- [ ] Softr conectado a Airtable
- [ ] 3 User Groups creados
- [ ] Login + Signup funcionando
- [ ] Cliente solo ve su legajo
- [ ] Asesor solo ve sus legajos
- [ ] Admin ve todo
- [ ] Form de upload de docs funciona
- [ ] Export CSV/Excel funciona
- [ ] Branding aplicado (logo, colores, font Outfit)
- [ ] Plan Pro de Softr
- [ ] Dominio custom apuntado
- [ ] SSL activo
- [ ] Emails enviándose con dominio propio (Resend)
- [ ] Templates HTML con branding
- [ ] 3 asesores reales cargados
- [ ] Backup mensual configurado (Make.com)
- [ ] Onboarding equipo realizado

---

## 🎯 Próximos pasos post go-live

1. **Mes 2:** Cargar primeros 10-20 leads reales del simulador
2. **Mes 3:** Procesar primeros 5-10 legajos hasta Finalizado para validar todo el flujo
3. **Mes 6:** Revisar costos y volumen. Si superás 30 leads/mes activos, evaluar si Airtable plan Team alcanza o subir a Business.
4. **Año 2:** Si superás 300 legajos/año o entran inversores, evaluar migración a Supabase + Next.js (lo que cotizó Espin).

¡Éxitos! Esto es 100% factible si le dedicás los fines de semana. 💪
