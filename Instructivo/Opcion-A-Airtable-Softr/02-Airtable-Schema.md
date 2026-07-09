# Airtable Schema — Tu Casa +Cerca

Diseño completo de la base de datos: tablas, campos, vistas, automatizaciones.

> **Cómo usarlo:** Crear una base nueva en Airtable llamada "TCMC", y para cada tabla seguir la estructura de campos exacta. Las relaciones (Linked Records) se crean al final, cuando todas las tablas existen.

---

## Tablas (9 en total)

| # | Tabla | Propósito | Registros estimados año 1 |
|---|-------|-----------|---------------------------|
| 1 | **Profiles** | Usuarios del sistema (clientes, asesores, admins) | ~150 |
| 2 | **Oficinas** | Oficinas Coldwell Banker | ~3-10 |
| 3 | **Legajos** | Solicitudes de crédito (tabla central) | ~100 |
| 4 | **Documentos** | Archivos subidos por legajo | ~600 (6 por legajo) |
| 5 | **Observaciones** | Comentarios/notas internas por legajo | ~300 |
| 6 | **Cuotas** | Cronograma de pagos por legajo finalizado | ~3.600 (36 cuotas × ~100 legajos) |
| 7 | **Pagos** | Registro de pagos efectivos | ~2.500 |
| 8 | **Leads** | Capturas del simulador de la landing | ~500-1.000 |
| 9 | **Notificaciones** | Log de notificaciones enviadas | ~2.000 |

---

## TABLA 1: Profiles

Usuarios del sistema. Una sola tabla con un campo `Rol` que define qué puede ver/hacer.

| Campo | Tipo | Descripción / Opciones |
|-------|------|-------------------------|
| `Nombre` | Single line text | |
| `Apellido` | Single line text | |
| `Email` | Email | Único — es el login |
| `Teléfono` | Phone number | |
| `DNI` | Single line text | Solo para cliente |
| `Rol` | Single select | `super_admin` / `admin_red` / `jefe_oficina` / `asesor` / `cliente` |
| `Estado` | Single select | `Activo` / `Pendiente aprobación` / `Inactivo` |
| `Oficina` | Linked record → Oficinas | Para asesores y jefes |
| `Fecha registro` | Created time | Auto |
| `Última actualización` | Last modified time | Auto |
| `Legajos como cliente` | Linked record → Legajos | Auto-poblado desde Legajos.Cliente |
| `Legajos como asesor` | Linked record → Legajos | Auto-poblado desde Legajos.Asesor |
| `Avatar` | Attachment | Opcional |

**Vistas sugeridas:**
- **Todos los usuarios** (default)
- **Pendientes de aprobación** (filter: Estado = Pendiente)
- **Solo clientes** (filter: Rol = cliente)
- **Solo asesores** (filter: Rol = asesor)
- **Equipo interno** (filter: Rol ≠ cliente)

---

## TABLA 2: Oficinas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Nombre` | Single line text | Ej: "CB Palermo" |
| `Código` | Single line text | Ej: "ofi001" |
| `Dirección` | Single line text | |
| `Teléfono` | Phone number | |
| `Email contacto` | Email | |
| `Estado` | Single select | `Activa` / `Inactiva` |
| `Asesores` | Linked record → Profiles | Auto |
| `Legajos` | Linked record → Legajos | Auto |
| `Cantidad asesores` | Count (Asesores) | Rollup |

**Datos iniciales a cargar:**
- CB Palermo, CB Belgrano, CB Recoleta (los 3 del mockup)

---

## TABLA 3: Legajos (CENTRAL)

La tabla más importante. Cada registro es una solicitud de crédito.

### Datos del cliente
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Número legajo` | Autonumber | Ej: 0001, 0002 |
| `ID público` | Formula | `"TCMC-" & RIGHT("0000" & {Número legajo}, 4)` |
| `Cliente` | Linked record → Profiles | Filtrado a Rol=cliente |
| `Nombre cliente` | Lookup → Cliente.Nombre | |
| `Apellido cliente` | Lookup → Cliente.Apellido | |
| `Email cliente` | Lookup → Cliente.Email | |
| `Teléfono cliente` | Lookup → Cliente.Teléfono | |
| `DNI cliente` | Lookup → Cliente.DNI | |

### Datos del crédito
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Monto solicitado (USD)` | Number (integer) | |
| `Valor propiedad (USD)` | Number (integer) | |
| `Valor ofertado (USD)` | Number (integer) | Base para LTV |
| `Plazo (meses)` | Single select | 12 / 24 / 36 / 48 / 60 |
| `Tasa anual aplicada` | Number (decimal, 2 dec) | Ej: 0.135 = 13.5% |
| `Monto bruto (USD)` | Formula | `{Monto solicitado (USD)} + ({Monto solicitado (USD)} * 0.05 * 1.21)` |
| `LTV %` | Formula | `IF({Valor ofertado (USD)}>0, ROUND({Monto solicitado (USD)}/{Valor ofertado (USD)}*100, 1), 0)` |
| `Cuota mensual estimada` | Formula | Fórmula PMT compleja (ver abajo) |

### Datos de la propiedad
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Link propiedad CB` | URL | |
| `Código CB` | Single line text | Ej: IAP2257755 |
| `Dirección inmueble` | Long text | |

### Workflow
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Etapa` | Single select | `Solicitud Inicial` / `Scoring` / `Pre Aprobación` / `Escribanía` / `Aprobación` / `Escritura` / `Finalizado` / `Rechazado` |
| `Estado` | Single select | `En proceso` / `Activo` / `Finalizado` / `Rechazado` |
| `Asesor asignado` | Linked record → Profiles | Filtrado a Rol=asesor |
| `Oficina` | Lookup → Asesor asignado.Oficina | |
| `Fecha solicitud` | Created time | Auto |
| `Fecha última actualización` | Last modified time | Auto |
| `Fecha escritura` | Date | Solo si Etapa=Finalizado |
| `Motivo rechazo` | Long text | Solo si Etapa=Rechazado |

### Codeudor
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Tiene codeudor` | Checkbox | |
| `Codeudor nombre` | Single line text | |
| `Codeudor apellido` | Single line text | |
| `Codeudor DNI` | Single line text | |
| `Codeudor vínculo` | Single select | Cónyuge / Padre/Madre / Hermano/a / Hijo/a / Otro |
| `Codeudor ingresos anuales` | Number (USD) | |

### Documentos post-finalización
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Escritura` | Attachment | Carga post-finalización |
| `Hipoteca` | Attachment | Carga post-finalización |

### Relaciones
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Documentos` | Linked record → Documentos | Auto |
| `Observaciones` | Linked record → Observaciones | Auto |
| `Cuotas` | Linked record → Cuotas | Auto, solo si Etapa=Finalizado |
| `Total cuotas pendientes` | Count (Cuotas where Estado=Pendiente) | Rollup |
| `Total cuotas vencidas` | Count (Cuotas where Estado=Vencida) | Rollup |
| `Días máximo atraso` | MAX (Cuotas.Días atraso) | Rollup |
| `Estado de pago` | Formula | Si días atraso = 0 → "Al día", si ≤5 → "Atraso <5d", si >5 → "Atraso >5d" |

### Fórmula PMT (cuota mensual)
```
IF(
  AND({Monto bruto (USD)}>0, {Plazo (meses)}>0, {Tasa anual aplicada}>0),
  ROUND(
    {Monto bruto (USD)} *
    (({Tasa anual aplicada}/12) * POWER(1 + {Tasa anual aplicada}/12, {Plazo (meses)})) /
    (POWER(1 + {Tasa anual aplicada}/12, {Plazo (meses)}) - 1),
    2
  ),
  0
)
```

**Vistas sugeridas:**
- **Todos los legajos** (default)
- **Pipeline** (group by Etapa)
- **Por asesor** (group by Asesor asignado)
- **Por oficina** (group by Oficina)
- **Solo finalizados** (filter: Etapa = Finalizado)
- **Cobranzas** (filter: Etapa = Finalizado y Total cuotas pendientes > 0)
- **Con atrasos >5 días** (filter: Días máximo atraso > 5)
- **Mis legajos** (filter dinámico por usuario logueado — se hace en Softr)

---

## TABLA 4: Documentos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Nombre documento` | Single line text | Ej: "DNI Frente", "Comprobante domicilio" |
| `Tipo` | Single select | `DNI Frente` / `DNI Dorso` / `Comprobante domicilio` / `Declaración ingresos` / `Reserva crédito` / `Otro` |
| `Legajo` | Linked record → Legajos | |
| `Archivo` | Attachment | PDF, JPG, PNG |
| `Estado` | Single select | `Pendiente` / `Aprobado` / `Observado` |
| `Subido por` | Linked record → Profiles | |
| `Fecha subida` | Created time | Auto |
| `Revisado por` | Linked record → Profiles | |
| `Fecha revisión` | Date | |
| `Comentario revisor` | Long text | |

**Vistas:**
- **Por legajo** (group by Legajo)
- **Pendientes de revisión** (filter: Estado = Pendiente)
- **Observados** (filter: Estado = Observado)

---

## TABLA 5: Observaciones

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Legajo` | Linked record → Legajos | |
| `Texto` | Long text | |
| `Tipo` | Single select | `Nota interna` / `Pedido información` / `Cambio etapa` / `Rechazo` |
| `Creado por` | Linked record → Profiles | |
| `Fecha` | Created time | Auto |
| `Visible al cliente` | Checkbox | Default false |

---

## TABLA 6: Cuotas

Generadas automáticamente al pasar legajo a "Finalizado" (vía automatización).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Legajo` | Linked record → Legajos | |
| `Número cuota` | Number | 1, 2, 3, ..., 36 |
| `Vencimiento` | Date | |
| `Monto USD` | Number (decimal, 2) | |
| `Estado` | Single select | `Pendiente` / `Pagada` / `Informada` / `Vencida` |
| `Días atraso` | Formula | `IF(AND({Estado}!="Pagada", IS_BEFORE({Vencimiento}, TODAY())), DATETIME_DIFF(TODAY(), {Vencimiento}, 'days'), 0)` |
| `Pago` | Linked record → Pagos | Auto |

**Vistas:**
- **Por legajo** (group by Legajo)
- **Vencidas** (filter: Estado = Vencida)
- **Próximas a vencer** (filter: Vencimiento entre hoy y hoy+7d, Estado = Pendiente)

---

## TABLA 7: Pagos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Cuota` | Linked record → Cuotas | |
| `Legajo` | Lookup → Cuota.Legajo | |
| `Fecha pago` | Date | |
| `Monto USD` | Number (decimal, 2) | |
| `Banco origen` | Single line text | |
| `Comprobante` | Attachment | |
| `Estado` | Single select | `Informado` / `Confirmado` / `Rechazado` |
| `Confirmado por` | Linked record → Profiles | |
| `Fecha confirmación` | Date | |

---

## TABLA 8: Leads

Capturas del simulador de la landing pública. Se llena vía Webhook desde Framer.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Nombre` | Single line text | |
| `Email` | Email | |
| `Teléfono` | Phone number | |
| `Valor propiedad simulada` | Number | |
| `Monto solicitado simulado` | Number | |
| `Plazo simulado` | Number | |
| `Cuota calculada` | Number | |
| `Fecha captura` | Created time | Auto |
| `Origen` | Single select | `Landing simulador` / `Contactar asesor` / `Otro` |
| `Estado` | Single select | `Nuevo` / `Contactado` / `Calificado` / `Convertido a legajo` / `Descartado` |
| `Asesor asignado` | Linked record → Profiles | |
| `Legajo creado` | Linked record → Legajos | Si convirtió |
| `Notas` | Long text | |
| `UTM source` | Single line text | |
| `UTM medium` | Single line text | |
| `UTM campaign` | Single line text | |

---

## TABLA 9: Notificaciones (log)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Tipo` | Single select | `Nueva solicitud` / `Cambio estado` / `Doc subido` / `Cuota por vencer` / `Observación nueva` |
| `Legajo` | Linked record → Legajos | |
| `Destinatario` | Linked record → Profiles | |
| `Email destinatario` | Lookup → Destinatario.Email | |
| `Asunto` | Single line text | |
| `Mensaje` | Long text | |
| `Canal` | Single select | `Email` / `Pop-up app` / `Ambos` |
| `Enviado` | Checkbox | |
| `Fecha envío` | DateTime | |
| `Error` | Long text | Si falla el envío |

---

## Automatizaciones (Airtable Automations)

Airtable permite automatizaciones sin código. Crear estas 5 al final:

### Automation 1: Nueva solicitud → notificar
- **Trigger:** When record created in Legajos
- **Actions:**
  1. Create record in Notificaciones (type=Nueva solicitud, destinatario=Asesor asignado)
  2. Send email (via Resend / Gmail / SendGrid) al asesor

### Automation 2: Cambio de etapa → notificar
- **Trigger:** When record updated in Legajos, field "Etapa" changed
- **Actions:**
  1. Create record in Notificaciones (type=Cambio estado, destinatario=Cliente)
  2. Send email al cliente con la nueva etapa

### Automation 3: Pasar a Finalizado → generar cuotas
- **Trigger:** When Etapa = Finalizado AND Fecha escritura is set
- **Actions:**
  1. Script (Airtable scripting): Generar N registros en Cuotas con fechas mensuales desde Fecha escritura, monto = Cuota mensual estimada

### Automation 4: Cuota próxima a vencer
- **Trigger:** Daily at 9am
- **Conditions:** Vencimiento entre hoy y hoy+7d, Estado=Pendiente
- **Actions:**
  1. Send email al cliente: "Tu cuota #X vence el [fecha]"
  2. Log en Notificaciones

### Automation 5: Documento subido → notificar al asesor
- **Trigger:** When record created in Documentos
- **Actions:**
  1. Send email al asesor del legajo: "Cliente subió documento [Tipo]"

---

## Permisos Airtable (Bases collaborators)

Niveles que ofrece Airtable:
- **Owner / Creator:** Pancho (vos)
- **Editor:** 1-2 personas de tu equipo (puede editar todo)
- **Commenter:** Asesores externos (solo ver y comentar)
- **Read only:** Auditores / inversores que quieran ver KPIs

**Recomendación:** Solo vos como Creator. Asesores no acceden directo a Airtable; entran por Softr (que controla los permisos a nivel registro).

---

## Backup y exportación

### Backup automático (incluido)
Airtable hace **snapshots cada noche**. Podés rollback hasta los últimos 7 días en plan Team, 1 año en plan Business.

### Export manual a Excel
1. Click en cualquier vista
2. Esquina superior derecha → "Download CSV"
3. Abrir en Excel

### Backup mensual a tu Google Drive (recomendado)
Setear con **Make.com** (ex-Integromat) un escenario gratuito que:
1. Cada mes el día 1 a las 6am
2. Exporta cada tabla a CSV
3. Sube al Drive a una carpeta "TCMC Backups/2026-MM"

Make.com free tier alcanza para esto.

---

## Próximos pasos

1. Crear cuenta Airtable → https://airtable.com/signup
2. Crear nueva base "TCMC" desde cero
3. Crear las 9 tablas con los campos exactos de arriba
4. Cargar datos iniciales: 3 oficinas, tu usuario super_admin
5. Pasar al `03-Softr-Layout.md` para conectar el frontend
