# Softr Layout — Tu Casa +Cerca

Diseño completo del frontend (portal cliente + backoffice) en Softr, conectado a la base Airtable.

> **Cómo usarlo:** Después de tener la base Airtable lista (ver `02-Airtable-Schema.md`), crear cuenta en Softr, conectar la base, y armar las páginas siguiendo este layout.

---

## Páginas del sitio (estructura)

```
softr.app/
├── /                        Home redirige a /login si no logueado
├── /login                   Login email/password (Softr nativo)
├── /signup                  Registro (queda como "pendiente aprobación")
├── /reset-password          Recuperar contraseña
│
├── /cliente/                Portal Cliente (solo Rol=cliente)
│   ├── /dashboard           Mi solicitud (vista resumen)
│   ├── /documentos          Subir y ver mis documentos
│   ├── /pagos               Mi cronograma + registrar pago
│   ├── /perfil              Editar mis datos
│   └── /soporte             Formulario de contacto
│
├── /asesor/                 Portal Asesor (Rol=asesor)
│   ├── /dashboard           Mis legajos asignados
│   ├── /pipeline            Vista kanban por etapa
│   ├── /legajo/{id}         Detalle de legajo (CRM)
│   ├── /clientes            Mis clientes
│   └── /perfil              Editar mis datos
│
└── /admin/                  Backoffice (Roles: jefe_oficina, admin_red, super_admin)
    ├── /dashboard           KPIs generales (legajos por etapa, volumen, cobranzas)
    ├── /legajos             Todos los legajos (tabla)
    ├── /legajos-finalizados Tabla con cuotas pendientes (estilo Cobranzas)
    ├── /pipeline            Kanban global
    ├── /cobranzas           Matriz mensual de cobranzas
    ├── /usuarios            ABM usuarios (aprobar/rechazar/cambiar rol)
    ├── /oficinas            ABM oficinas
    ├── /leads               Tabla de leads del simulador
    ├── /reportes            Vistas con filtros + export CSV
    ├── /config              Tasas, LTV, monto máximo
    └── /perfil              Editar mis datos
```

---

## Permisos por rol (User Groups en Softr)

Softr permite crear "User Groups" que controlan qué páginas y bloques ve cada rol.

### Setup en Softr:
1. Settings → User Groups → Create group
2. Crear 3 grupos:
   - **Clientes** — accede a `/cliente/*`
   - **Asesores** — accede a `/asesor/*` y `/cliente/{su-id}` (solo lectura)
   - **Admins** — accede a `/admin/*` y `/asesor/*` (todo)
3. Para cada bloque/página: Settings → Visibility → restringir a User Group

### Permisos a nivel registro (Row-Level Security)
Softr hace esto vía "Filters" en cada bloque conectado a Airtable:

| Página | Filtro Airtable |
|--------|-----------------|
| Cliente ve "Mi solicitud" | `Legajos.Cliente.Email = {logged_in_user.email}` |
| Asesor ve "Mis legajos" | `Legajos.Asesor asignado.Email = {logged_in_user.email}` |
| Admin ve todo | sin filtro |

Estos filtros usan la variable mágica de Softr `{logged_in_user.email}`.

---

## Página por página — Layout y bloques

### 🔐 LOGIN (default de Softr)

Softr trae login nativo con email + password. Solo configurás:
- Color del botón: `#1A4394` (brand primary)
- Logo: subir el de TCMC
- Texto bienvenida: "Bienvenido a Tu Casa +Cerca"
- Redirección post-login según rol (Softr lo hace con "Logged-in user redirect by Role")

### 📝 REGISTRO

Cualquiera puede registrarse. Se crea un registro en Profiles con Estado="Pendiente aprobación" y Rol="cliente".

- Campos del form: Nombre, Apellido, Email, Teléfono, DNI, Password
- Acción al enviar: Create record in Profiles + Trigger email a admin "Nuevo usuario registrado, aprobá en /admin/usuarios"

---

### 👤 PORTAL CLIENTE

#### `/cliente/dashboard` — Mi solicitud

**Bloques:**
1. **Hero block** con saludo personalizado: "Hola {firstname}, este es el estado de tu solicitud"
2. **Detail block** conectado a Legajos, filtrado por `Cliente.Email = {logged_in_user.email}`
   - Muestra: Número legajo, Etapa actual (badge con color), Monto solicitado, Plazo, Asesor asignado, Fecha solicitud
3. **Progress bar** con las 6 etapas (Solicitud → Scoring → ... → Escritura)
   - Etapa actual destacada
4. **Card "Próximos pasos"** dinámico según Etapa
5. **List block** con últimas 3 Observaciones visibles al cliente
6. **CTA buttons:** "Subir documentos" → `/cliente/documentos`, "Ver mis pagos" → `/cliente/pagos`

#### `/cliente/documentos`

**Bloques:**
1. **List block** conectado a Documentos del legajo del usuario
   - Columnas: Tipo, Estado (badge), Fecha subida, Comentario revisor
2. **Form block** "Subir documento"
   - Campos: Tipo (select), Archivo (file upload)
   - Action: Create record in Documentos linkeado al Legajo del usuario

#### `/cliente/pagos`

Solo visible si Etapa=Finalizado.

**Bloques:**
1. **Stats block** con: Total cuotas, Pagadas, Pendientes, Vencidas
2. **Table block** con todas las Cuotas del legajo del usuario
   - Columnas: Nº, Vencimiento, Monto, Estado, "Informar pago" (button)
3. **Modal form** al click en "Informar pago":
   - Fecha, Monto, Banco, Comprobante (file)
   - Action: Create record in Pagos

#### `/cliente/perfil`

Form para editar Nombre, Apellido, Teléfono. Email es read-only.

#### `/cliente/soporte`

Form simple: Asunto, Mensaje. Envía email a `info@tucasamascerca.com.ar`.

---

### 🤝 PORTAL ASESOR

#### `/asesor/dashboard` — Mis legajos

**Bloques:**
1. **Stats block** con: Total legajos asignados, En proceso, Finalizados este mes, Pendientes de acción
2. **Table block** con Legajos filtrados por `Asesor asignado.Email = {logged_in_user.email}`
   - Columnas: ID, Cliente, Monto, Etapa, Última actualización, Acción (link a detalle)
3. **Filtros visuales:** dropdown por Etapa, search por nombre cliente

#### `/asesor/pipeline` — Vista kanban

**Bloque "Kanban"** de Softr conectado a Legajos:
- Group by: Etapa
- Filter: Asesor asignado = current user
- Cada card muestra: Cliente, Monto, Fecha
- **Drag entre columnas** mueve el legajo de etapa (escribe en Airtable)

#### `/asesor/legajo/{id}` — Detalle CRM

Página dinámica con `{id}` en URL.

**Bloques:**
1. **Detail block** con todos los datos del Legajo
2. **Tabs:**
   - **Datos cliente** — info del cliente
   - **Datos préstamo** — montos, plazo, tasa, cuota
   - **Documentos** — list con estado, botón "Aprobar" / "Observar"
   - **Observaciones** — historial + form para agregar nueva
   - **Cuotas** (si Finalizado) — tabla de pagos
3. **Action button "Cambiar etapa"** — modal con dropdown de etapas + textarea para nota

#### `/asesor/clientes`

Tabla con clientes asignados, link a su legajo.

---

### ⚙️ BACKOFFICE ADMIN

#### `/admin/dashboard` — KPIs generales

**Bloques:**
1. **Stats blocks** (4 cards):
   - Total legajos activos
   - Volumen total USD (sum of Monto solicitado)
   - Finalizados este mes
   - % conversión (Finalizados / Total)
2. **Chart block** (Pie chart) — legajos por Etapa
3. **Chart block** (Bar chart) — legajos por Oficina
4. **List block** — 5 legajos más recientes
5. **List block** — 5 leads nuevos sin contactar

#### `/admin/legajos` — Tabla completa

**Bloque "Table" o "List" de Softr conectado a Legajos:**
- Sin filtros (admin ve todo)
- Columnas configurables: ID, Cliente, Email, Monto, Etapa, Asesor, Oficina, Fecha, Estado
- **Search global** por nombre/email/ID
- **Filters:** Etapa, Oficina, Asesor, Estado
- **Sort:** por cualquier columna
- **Export to CSV** — botón nativo de Softr
- Click en row → `/admin/legajo/{id}` (mismo detalle que asesor pero con todos los permisos)

#### `/admin/legajos-finalizados` — Tipo Cobranzas

**Tabla filtrada:** Etapa = Finalizado

**Columnas (las que pediste antes):**
- Tomador (Cliente)
- Dir inmueble
- Monto Tomado
- Valor compra
- Total cuotas (Q) y (USD)
- Cuotas pendientes (Q) y (USD)
- Estado de pago (Al día / Atraso <5d / Atraso >5d) — campo Formula calculado

Click en row → modal con CRM completo del legajo + tab "Cargar escritura/hipoteca".

#### `/admin/pipeline` — Kanban global

Mismo bloque Kanban pero sin filtro por asesor.

#### `/admin/cobranzas` — Matriz mensual

**Bloque Table** de Cuotas:
- Group by: Mes vencimiento (campo Formula: `MONTH({Vencimiento})`)
- Aggregations: Count total, Count pagadas, Sum monto, Sum monto pagado
- Filters: Año, Estado

#### `/admin/usuarios` — ABM

**Bloque Table** de Profiles:
- Columnas: Nombre, Email, Rol, Estado, Oficina, Fecha registro
- Filtros: Estado, Rol
- Action buttons inline:
  - "Aprobar" → cambia Estado a Activo
  - "Rechazar" → cambia Estado a Inactivo
  - "Cambiar rol" → modal con dropdown
- **Bulk import CSV** — Softr lo soporta nativo

#### `/admin/oficinas` — ABM

Tabla simple de Oficinas, form para crear/editar.

#### `/admin/leads` — Pipeline de leads

**Bloque Kanban** de Leads:
- Group by: Estado (Nuevo / Contactado / Calificado / Convertido / Descartado)
- Cada card: Nombre, Email, Teléfono, Monto simulado, Fecha
- **Acción "Convertir a legajo":** crea registro en Legajos pre-rellenando datos

#### `/admin/reportes`

3 vistas con tabs:
1. **Pipeline:** tabla legajos agrupados por Etapa con sum/count
2. **Performance asesores:** tabla con # legajos, $ volumen, # finalizados, % conversión
3. **Financiero:** total volumen, total cobrado, morosidad

Cada uno con botón "Export Excel" nativo de Softr.

#### `/admin/config`

Form para editar:
- LTV máximo (%)
- Monto máximo (USD)
- Tasas por plazo (12/24/36/48/60)
- Defaults simulador web (valor inmueble, monto, plazo)

Estos valores se guardan en una tabla extra "Config" (no incluida en el schema base, agregar como tabla 10 si lo necesitás).

---

## Branding en Softr

### Lo que SÍ podés customizar (sin pagar extra)
- Logo en header
- Favicon
- Colores primario/secundario/acento
- Fuente (Google Fonts, podés usar Outfit)
- Background de páginas
- Estilo de botones (border-radius, sombras)
- Custom CSS para detalles finos

### Lo que NO podés cambiar
- La estructura general de la página (header + sidebar + content)
- El comportamiento de bloques específicos (algunas plantillas son fijas)
- Hide del "Made with Softr" en planes inferiores (en Pro sí podés ocultarlo)

### Settings a configurar
1. **Site settings** → Branding:
   - Logo: subir el de TCMC
   - Favicon: el ícono del brandbook
   - Primary color: `#1A4394`
   - Accent color: `#0D00FF`
2. **Typography:**
   - Heading font: Outfit
   - Body font: Outfit
3. **Custom CSS** (opcional, para refinar):
```css
:root {
  --brand-primary: #1A4394;
  --brand-vivid: #0D00FF;
  --brand-dark: #1E1E1E;
}
.softr-button-primary {
  border-radius: 8px;
  font-weight: 600;
}
```

---

## Dominio personalizado

### Para staging (sin costo extra)
- URL Softr gratis: `tucasamascerca.softr.app`

### Para producción (plan Pro+ requerido)
1. Comprar `app.tucasamascerca.com.ar` o usar subdominio del principal
2. En Softr: Settings → Custom Domain → seguir instrucciones DNS
3. SSL automático

---

## Integración con la landing (Framer)

### Botón "Ingresar" de la landing
URL: `https://app.tucasamascerca.com.ar/login?propertyValue=X&loanAmount=Y&months=Z`

Softr lee esos query params y los puede usar en el form de registro (campo "intención simulada") para que el asesor sepa con qué simuló el cliente.

### Captura de leads del simulador
Form de la landing Framer → Webhook → Airtable (tabla Leads)

Setup:
1. En Framer, configurar el form con **Webhook URL** (lo da Airtable)
2. En Airtable: Tabla Leads → ⚙️ Settings → Integrations → "Receive data via webhook"
3. Mapear campos: Framer form fields → Airtable columns

---

## Costos exactos de Softr

| Plan | Precio | Qué incluye |
|------|--------|-------------|
| Free | $0 | 10 usuarios, "Made with Softr" visible, 200 records |
| Basic | $24/mes | 100 usuarios, dominio custom, sin watermark |
| **Professional** ⭐ | **$49/mes** | **1.000 usuarios, 5 user groups, member-only pages** |
| Business | $139/mes | 10.000 usuarios, advanced workflows |

**Recomendado:** Professional. Te alcanza para los primeros años cómodamente.

---

## Próximos pasos

1. Crear cuenta Softr → https://softr.io/signup
2. Plan: empezar Free, upgradear a Professional al publicar
3. Conectar Airtable: Settings → Data Sources → Connect Airtable
4. Elegir template "Member portal" o "Internal tool" como base
5. Empezar a armar página por página según este documento
6. Mover al `04-Plan-Operativo-Semanal.md` para el cronograma detallado
