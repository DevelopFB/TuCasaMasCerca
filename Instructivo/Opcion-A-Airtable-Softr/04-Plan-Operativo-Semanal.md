# Plan Operativo Semana por Semana

Cronograma día por día para implementar la Opción A en 4 semanas. Asume que trabajás en horario de fines de semana (5-8 horas por sábado/domingo) + 1 hora suelta entre semana.

**Tiempo total estimado:** 30-40 horas distribuidas en 4 semanas.

---

## SEMANA 1 — Setup y base de datos

**Objetivo:** Tener Airtable funcionando con datos de prueba.

### Día 1 (1 hora — entre semana)
**Tarea:** Crear cuentas y explorar
- [ ] Crear cuenta Airtable: https://airtable.com/signup (gratis)
- [ ] Crear cuenta Softr: https://softr.io/signup (gratis)
- [ ] Crear cuenta Resend: https://resend.com (gratis hasta 3k emails/mes)
- [ ] Explorar 10 min cada plataforma para familiarizarte

### Día 2 (Sábado — 4-5 horas)
**Tarea:** Construir las 9 tablas en Airtable
- [ ] Crear base nueva "TCMC"
- [ ] Crear Tabla 1: **Profiles** con todos los campos del schema
- [ ] Crear Tabla 2: **Oficinas**
- [ ] Crear Tabla 3: **Legajos** (la más grande, ~30 campos)
- [ ] Crear Tabla 4: **Documentos**
- [ ] Crear Tabla 5: **Observaciones**
- [ ] Crear Tabla 6: **Cuotas**
- [ ] Crear Tabla 7: **Pagos**
- [ ] Crear Tabla 8: **Leads**
- [ ] Crear Tabla 9: **Notificaciones**

> **Tip:** Hacelo en orden. No agregues las Linked Records (relaciones) hasta que todas las tablas existan, sino se va a complicar.

### Día 3 (Domingo — 3-4 horas)
**Tarea:** Conectar relaciones y crear vistas
- [ ] Volver a cada tabla y agregar los campos Linked Record (referencias entre tablas)
- [ ] Crear las Fórmulas (cuota PMT, LTV %, ID público, Estado de pago, etc.)
- [ ] Crear las Vistas filtradas en cada tabla (Pipeline, Por asesor, Pendientes, etc.)
- [ ] Configurar permisos: solo vos como Creator

### Día 4 (1 hora — entre semana)
**Tarea:** Cargar datos iniciales (seed)
- [ ] Crear las 3 Oficinas: CB Palermo, CB Belgrano, CB Recoleta
- [ ] Crear tu usuario en Profiles (Rol: super_admin)
- [ ] Crear 2-3 asesores de prueba
- [ ] Crear 5 clientes de prueba con datos reales (o ficticios)
- [ ] Crear 5 legajos en diferentes etapas

### Día 5 (1 hora — entre semana)
**Tarea:** Configurar automatizaciones básicas
- [ ] Automation 1: Nueva solicitud → notificar asesor por email
- [ ] Automation 2: Cambio de etapa → notificar cliente
- [ ] Probar manualmente: crear un legajo y verificar que el email llega

**✅ Fin Semana 1:** Tenés Airtable con datos cargados y emails funcionando. Si abrís la base, ya podés operar manualmente.

---

## SEMANA 2 — Frontend Softr

**Objetivo:** Tener la app web (login + portal cliente + portal asesor) andando en staging.

### Día 1 (Sábado — 4-5 horas)
**Tarea:** Setup Softr y conectar Airtable
- [ ] En Softr: crear app nueva "TCMC App"
- [ ] Settings → Data Sources → Connect Airtable → autenticar
- [ ] Importar la base TCMC (todas las tablas se ven en Softr)
- [ ] Settings → Branding: subir logo, colores `#1A4394` primary, font Outfit
- [ ] Settings → User Groups: crear 3 grupos (Clientes, Asesores, Admins)
- [ ] Configurar Login page (rediseñar con branding)
- [ ] Configurar Signup page (campos: nombre, apellido, email, teléfono, password)

### Día 2 (Domingo — 4-5 horas)
**Tarea:** Construir Portal Cliente completo
- [ ] Página `/cliente/dashboard`
  - Hero block con saludo
  - Detail block: Legajo del usuario (con filter `Cliente.Email = {logged_in_user.email}`)
  - Progress bar de etapas
- [ ] Página `/cliente/documentos`
  - List block + Form de upload
- [ ] Página `/cliente/pagos` (deshabilitar visualmente si Etapa ≠ Finalizado)
- [ ] Página `/cliente/perfil`
- [ ] Página `/cliente/soporte`
- [ ] Probar: loguearte como cliente de prueba, verificar que solo ves tu legajo

### Día 3 (1 hora — entre semana)
**Tarea:** Portal Asesor — parte 1
- [ ] Página `/asesor/dashboard`
- [ ] Página `/asesor/pipeline` (Kanban)

### Día 4 (1 hora — entre semana)
**Tarea:** Portal Asesor — parte 2
- [ ] Página `/asesor/legajo/{id}` (CRM detalle)
- [ ] Página `/asesor/clientes`
- [ ] Probar: loguearte como asesor, verificar permisos (solo tus legajos)

**✅ Fin Semana 2:** Cliente y Asesor pueden loguearse y operar. Falta el backoffice admin.

---

## SEMANA 3 — Backoffice Admin + Automatizaciones

**Objetivo:** Backoffice completo y todos los flujos de email funcionando.

### Día 1 (Sábado — 4 horas)
**Tarea:** Backoffice Admin — páginas principales
- [ ] Página `/admin/dashboard` con KPIs y charts
- [ ] Página `/admin/legajos` (tabla completa con filtros, search, export)
- [ ] Página `/admin/legajos-finalizados` (con columnas de cobranzas)
- [ ] Página `/admin/pipeline` (Kanban global)

### Día 2 (Domingo — 4 horas)
**Tarea:** Backoffice Admin — secundarias
- [ ] Página `/admin/cobranzas` (matriz mensual)
- [ ] Página `/admin/usuarios` (ABM con aprobar/rechazar)
- [ ] Página `/admin/oficinas` (ABM simple)
- [ ] Página `/admin/leads` (Kanban de leads)
- [ ] Página `/admin/reportes` (3 tabs con export)
- [ ] Página `/admin/config`

### Día 3 (1 hora)
**Tarea:** Automatizaciones avanzadas Airtable
- [ ] Automation 3: Pasar a Finalizado → generar cuotas (script)
- [ ] Automation 4: Cron diario → cuotas próximas a vencer (email cliente)
- [ ] Automation 5: Documento subido → notificar asesor

### Día 4 (1 hora)
**Tarea:** Integración con Resend para emails con branding
- [ ] En Resend: verificar dominio `tucasamascerca.com.ar` (DNS records)
- [ ] Crear templates HTML de emails (bienvenida, cambio de etapa, cuota por vencer)
- [ ] Actualizar las Automations de Airtable para usar Resend en vez de Gmail

**✅ Fin Semana 3:** Backoffice completo + emails con branding profesional.

---

## SEMANA 4 — Testing, branding final y go-live

**Objetivo:** App probada, branding pulido, primer cliente real cargado.

### Día 1 (Sábado — 3 horas)
**Tarea:** Testing exhaustivo
- [ ] Crear 5 clientes de prueba con perfiles distintos
- [ ] Simular el flujo end-to-end:
  - Cliente se registra
  - Admin aprueba
  - Cliente sube documentos
  - Asesor recibe notificación, revisa, aprueba docs
  - Asesor cambia etapa → cliente recibe email
  - Asesor pasa a Finalizado con fecha escritura → sistema genera cuotas
  - Cliente entra a "Mis pagos" y registra un pago
  - Admin valida pago
- [ ] Anotar bugs/cosas raras

### Día 2 (Domingo — 3-4 horas)
**Tarea:** Pulir branding y UX
- [ ] Custom CSS final en Softr
- [ ] Ajustar textos de email templates (tono cercano, claro)
- [ ] Subir todos los assets (logo claro, favicon, OG image)
- [ ] Verificar responsive en celular (Softr es responsive nativo pero algunos bloques requieren ajuste)
- [ ] SEO: meta tags en cada página, sitemap

### Día 3 (1 hora)
**Tarea:** Comprar dominio + DNS
- [ ] Comprar `app.tucasamascerca.com.ar` en Nic.ar (~ARS 2.700)
- [ ] En Softr: Settings → Custom Domain → seguir instrucciones DNS
- [ ] Esperar propagación (5min - 2 horas)
- [ ] SSL automático

### Día 4 (1 hora)
**Tarea:** Upgrade a Softr Pro + pago anual
- [ ] Settings → Billing → Upgrade to Professional (USD 49/mes)
  - Tip: Pagar anual da ~20% de descuento (USD 490/año vs 588)
- [ ] Habilitar dominio custom (incluido en Pro)
- [ ] Quitar "Made with Softr" del footer

### Día 5 (1 hora)
**Tarea:** Onboarding equipo
- [ ] Crear cuentas para los 2-3 asesores reales
- [ ] Sesión de 30 min con cada asesor mostrando:
  - Cómo loguear
  - Cómo ver sus legajos
  - Cómo cambiar etapa
  - Cómo cargar observaciones
  - Cómo aprobar documentos
- [ ] Crear cuenta para Marketing (rol: super_admin si confías, sino limitado)

**✅ Fin Semana 4:** App productiva con dominio propio, equipo onboardeado.

---

## SEMANA 5+ (operación)

A partir de acá:
1. Procesás clientes reales con el sistema
2. Iterás: cada vez que detectás algo que falta, lo agregás (Airtable + Softr permiten cambios sin downtime)
3. Backup mensual a Google Drive con Make.com
4. Revisás métricas en `/admin/dashboard` cada lunes

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| Te trabás armando una tabla compleja en Airtable | Pedile a un freelance 2-3 hs específicas (USD 60-90) o consultá la comunidad Airtable |
| Softr no permite armar UI exacta como querés | Hablás conmigo y vemos workarounds, o aceptás 80% del look y pulís después |
| Las automations no envían emails | Revisar Resend dashboard, configurar DKIM en DNS |
| Cliente sube un PDF de 100MB y se rompe | Configurar límite de tamaño en el form de upload (max 10MB) |
| Pierdo datos por error humano | Airtable hace snapshots automáticos. Rollback en Settings → Snapshots |
| Necesitás escalar a 500+ legajos | Migrar a Supabase + Next.js (proyecto separado, ~USD 5-8k) |

---

## Cuándo contratar freelance

Si te trabás más de 1 hora en algo específico, contratar puntual:

| Tarea | Plataforma para buscar | Costo estimado |
|-------|------------------------|----------------|
| Setup completo de Airtable | Workana, Fiverr | USD 200-400 |
| Diseño visual Softr (CSS custom) | Behance, Fiverr | USD 100-200 |
| Integración Airtable ↔ Framer (lead capture) | Upwork | USD 80-150 |
| Templates de email HTML con branding | Fiverr | USD 50-100 |

**Total potencial freelance (si contratás los 4):** USD 430-850 (sigue siendo mucho menos que USD 27.900).

---

## Checklist final pre-go-live

- [ ] 9 tablas Airtable creadas con todos los campos y fórmulas
- [ ] 5 automations activas y probadas
- [ ] Permisos Airtable: solo Creator vos
- [ ] Softr conectado a Airtable
- [ ] 3 User Groups creados (Clientes / Asesores / Admins)
- [ ] Páginas con filtros correctos (cliente solo ve lo suyo, asesor lo asignado, admin todo)
- [ ] Login + Signup + Reset password funcionando
- [ ] Branding aplicado (logo, colores, font Outfit)
- [ ] Plan Pro de Softr activo
- [ ] Dominio custom apuntado (`app.tucasamascerca.com.ar`)
- [ ] SSL activo
- [ ] Resend conectado con dominio verificado
- [ ] Templates de email funcionando
- [ ] 5 clientes y 3 asesores reales cargados
- [ ] Make.com configurado para backup mensual a Drive
- [ ] Onboarding del equipo realizado
- [ ] Manual de uso interno escrito (3-5 páginas, te lo armo si querés)

---

## ¡Listo para producir!

Después de estas 4 semanas tenés:
- ✅ Una webapp profesional funcionando
- ✅ Equipo capacitado
- ✅ Backup automático
- ✅ Costo total año 1: **~USD 1.500-1.700** (vs USD 27.900 propuesta original)
- ✅ Margen para iterar/cambiar sin pagar a developers

Cuando crezcas (>300 legajos/año), evaluamos migración a stack custom. Pero hasta entonces, **Airtable + Softr te alcanza y sobra**.
