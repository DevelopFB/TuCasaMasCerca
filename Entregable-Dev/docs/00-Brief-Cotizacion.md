# TCMC · Brief para Cotización

**Producto:** Tu Casa +Cerca — Plataforma fintech de micro-hipotecas en USD
**Audiencia:** Estudios de desarrollo
**Versión:** 1.0 — Mayo 2026

---

## 1. Resumen Ejecutivo

TCMC es una plataforma fintech argentina que conecta compradores de primera vivienda con financiamiento estructurado vía Fondo Común de Inversión Cerrado (FCICC). Opera a través de la red **Coldwell Banker Argentina**. El producto no es transaccional: gestiona solicitudes, scoring, aprobaciones, documentación y cobranzas (sin mover dinero).

### Estado actual

- **Prototipo funcional completo** en HTML/React/Tailwind (un solo archivo `index.html` + versiones standalone separadas para landing y app).
- **Branding profesional** definido en brandbook V2 (PDF en el repo).
- **Modelo de datos, API REST, máquina de estados, reglas de negocio y notificaciones** documentados en este paquete.
- **Algoritmos financieros** ya escritos y verificados (`/prototype/shared/algorithms.js`).

### Qué necesita TCMC del equipo de desarrollo

Convertir el prototipo en una **aplicación productiva** (frontend + backend + DB + storage + email) y una **landing pública** (sitio informativo + simulador + captura de leads).

**Lo que TCMC YA aportó al proyecto**:
- Diseño visual completo (con ajustes de imágenes, ícenos y tipografías).
- Definición de reglas de negocio (no hay descubrimiento de requerimientos).
- Algoritmos financieros validados (no se rehacen).
- Branding (no hay diseño de marca).
- Especificación técnica completa con modelo de datos, API, estados y triggers.

---

## 2. Alcance de la Cotización

Pedimos cotizar **dos proyectos separados** (pueden ser ejecutados por el mismo equipo o equipos distintos):

### Proyecto 1 — Landing Web

| Componente | Incluido |
|------------|---------|
| Portar el prototipo HTML a sitio productivo | ✅ |
| Responsive (360px → 1920px) | ✅ |
| Simulador funcional consumiendo backend para tasas | ✅ |
| Captura de leads (POST a backend de la app) | ✅ |
| Integración con buscador CB (URL con `suitable_for_credit=1`) | ✅ |
| SEO, sitemap, OG tags, JSON-LD | ✅ |
| Analytics (GA4 + Meta Pixel) | ✅ |
| Optimización de imágenes (WebP) y performance | ✅ |
| Deploy productivo (Vercel/Netlify) + dominio + SSL | ✅ |
| Documentación técnica del entregable | ✅ |
| CMS headless (Sanity, Contentful) | ❌ Fase 2 |


### Proyecto 2 — Aplicación (App + Backoffice + API)

| Componente | Incluido |
|------------|---------|
| Backend con DB (Postgres) + RLS / RBAC | ✅ |
| Autenticación (login, registro, aprobación, 5 roles) | ✅ |
| Portal cliente: simulador + 5 vistas | ✅ |
| Wizard de solicitud **dinámico** (renderizado desde `form_config`) | ✅ |
| 10 paneles de backoffice (legajos, pipeline, cobranzas, etc.) | ✅ |
| Storage de documentos con signed URLs | ✅ |
| Sistema de notificaciones (4 triggers: in-app + email) | ✅ |
| Cron de cuotas por vencer | ✅ |
| ABM de formulario (Google-Forms-like, versionado) | ✅ |
| Reportes (3 tabs) + export CSV/Excel | ✅ |
| Endpoints públicos para landing (`/api/leads`, `/api/config/public`) | ✅ |
| Audit trail | ✅ |
| Deploy productivo (Vercel + Supabase) + dominio + SSL | ✅ |
| Seed inicial + documentación | ✅ |
| KYC con MetaMap | ❌ Fase 2 |
| Integración API privada con CB | ❌ Fase 2 |
| Pagos online (MercadoPago, etc.) | ❌ Fase 3 | a definir
| App mobile nativa | ❌ Fase 3 | a definir


---

## 3. Documentación Provista al Cotizar

Cuando el dev team reciba este paquete, encuentra TODO lo necesario para cotizar:

| Archivo | Contenido |
|---------|-----------|
| `docs/00-Brief-Cotizacion.md` | Este documento — resumen ejecutivo y alcance |
| `docs/01-TCMC-Spec-WEB.md` | Spec técnica completa de la landing (16 secciones) |
| `docs/02-TCMC-Spec-APP.md` | Spec técnica completa de la app (20 secciones, ~700 líneas) |
| `docs/03-Contrato-Web-App.md` | Contrato de integración entre landing y app |
| `prototype/index.html` | Mockup combinado funcional (landing + app en un solo archivo) |
| `prototype/landing/` | Landing standalone para portar |
| `prototype/app/` | Mockup de la app + estructura recomendada |
| `prototype/shared/` | Algoritmos financieros + constantes + contrato |
| `TCNCERCA-BRANDBOOK-V2.pdf` | Brandbook oficial |
| `docx/` | Versiones Word de los specs (para imprimir) |

