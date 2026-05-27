# Tu Casa +Cerca — Entregable para Equipo de Desarrollo

Plataforma fintech argentina de micro-hipotecas en USD. Este repositorio contiene **todo lo necesario** para que un equipo de desarrollo cotice e implemente el producto sin reuniones previas de descubrimiento.

---

## Qué hay en este repo

```
Entregable-Dev/
├── README.md                            ← este archivo (empezá acá)
├── .gitignore
├── docs/                                ← documentación maestra
│   ├── 00-Brief-Cotizacion.md           ← leer primero si vas a cotizar
│   ├── 01-TCMC-Spec-WEB.md              ← spec completo del sitio público
│   ├── 02-TCMC-Spec-APP.md              ← spec completo de la app + backoffice
│   └── 03-Contrato-Web-App.md           ← contrato de integración entre ambos
├── docx/                                ← versiones Word de los specs (para imprimir/compartir)
├── prototype/                           ← mockup funcional como fuente de verdad visual
│   ├── index.html                       ← mockup combinado (landing + app en un solo archivo)
│   ├── landing/                         ← landing standalone
│   │   ├── index.html
│   │   ├── README.md
│   │   └── assets/                      ← imágenes
│   ├── app/                             ← app mockup
│   │   ├── mockup-reference.html
│   │   └── README.md
│   ├── shared/                          ← código compartido entre web y app
│   │   ├── algorithms.js                ← fuente única de cálculos financieros
│   │   ├── constants.js                 ← roles, etapas, formulario por defecto
│   │   └── CONTRACT.md                  ← contrato técnico web ↔ app
│   └── assets/                          ← logos, imágenes generales
└── dev-templates/                       ← templates de issues y PRs (genéricos)
    ├── ISSUE_BUG.md
    ├── ISSUE_FEATURE.md
    ├── ISSUE_DEV_QUESTION.md
    └── PULL_REQUEST.md
```

> **Nota sobre hosting Git:** este paquete está estructurado para subirse a **GitHub, GitLab, Bitbucket o cualquier otro hosting Git**. Los templates de `dev-templates/` se pueden mover a `.github/`, `.gitlab/` o donde corresponda según el hosting que elija el equipo de desarrollo.

---

## Por dónde empezar (5 minutos)

1. **Abrí el prototipo:** `prototype/index.html` en un navegador moderno.
2. **Login con cada rol** (credenciales en `docs/02-TCMC-Spec-APP.md` sección 20.2) y recorré las pantallas.
3. **Leé el brief de cotización:** `docs/00-Brief-Cotizacion.md` (~10 minutos).
4. **Decidí si cotizás el proyecto entero o solo Web / solo App** (son independientes).
5. **Leé el spec correspondiente:**
   - Solo Web: `docs/01-TCMC-Spec-WEB.md` (~20 min)
   - Solo App: `docs/02-TCMC-Spec-APP.md` (~40 min)
   - Ambos: añadir el contrato `docs/03-Contrato-Web-App.md` (~10 min)

---

## Estado del producto

| Componente | Estado | Próximo paso |
|------------|--------|--------------|
| UX / UI | ✅ Diseñada y maquetada en prototipo | Portar a stack productivo |
| Reglas de negocio | ✅ Documentadas | Implementar |
| Algoritmos financieros | ✅ Escritos y verificados (`shared/algorithms.js`) | Importar (no reescribir) |
| Branding | ✅ Brandbook V2 oficial | Respetar (PDF en repo raíz) |
| Backend / DB / API | ⏳ Por implementar | Ver spec APP sección 4 (DDL completo) y sección 6 (endpoints) |
| Landing productiva | ⏳ Por implementar | Ver spec WEB |
| Integraciones externas | Parcial — CB negociación pendiente | MetaMap y CB API para fase 2 |

---

## Resumen ejecutivo del producto

TCMC conecta compradores de **primera vivienda** con financiamiento estructurado vía Fondo Común de Inversión Cerrado (FCICC), operando a través de la red **Coldwell Banker Argentina**.

**El producto es no transaccional:** gestiona solicitudes, scoring, aprobaciones, documentación y registro de pagos. No procesa transferencias.

### Componentes del sistema

1. **Landing pública** (`tucasamascerca.com`)
   Sitio informativo + simulador interactivo + captura de leads.

2. **Aplicación** (`app.tucasamascerca.com`)
   - **Portal cliente:** simulador, wizard de solicitud, seguimiento, pagos, soporte.
   - **Backoffice multi-rol:** legajos, pipeline, cobranzas, reportes, ABM dinámico del formulario, configuración.
   - **API REST** con autenticación, RBAC, RLS, audit trail.
   - **Notificaciones** (in-app + email) con 4 triggers definidos.

3. **Integraciones externas**
   - **Coldwell Banker** — búsqueda de propiedades aptas para crédito.
   - **MetaMap** (fase 2) — KYC / verificación de identidad.
   - **Resend / SendGrid** — email transaccional.
   - **Supabase Storage / S3** — documentos.

### Stack recomendado

- **Landing:** HTML + CSS + JS vanilla (Vercel/Netlify estático) — ~25 hs. Migrar a Next.js si se necesita SSR/SEO premium.
- **App:** Next.js 14 + Supabase (Postgres + Auth + Storage + Realtime) + Resend — ~80 hs.

El equipo de desarrollo puede proponer otro stack si lo justifica.

---

## Cómo correr el prototipo localmente

### Opción rápida — abrir directo en navegador

```bash
# macOS / Linux
open prototype/index.html

# Windows
start prototype/index.html
```

### Opción servida (recomendada para CORS y URLs absolutas)

```bash
cd prototype
python3 -m http.server 8080
# o
npx serve .
```

Abrir `http://localhost:8080`.

### Credenciales demo

| Rol | Email | Password |
|-----|-------|----------|
| Super Admin | `panchobenegas@gmail.com` | `Admin123!` |
| Red Admin | `director@coldwell.com` | `Red123!` |
| Oficina Admin | `jefe.palermo@coldwell.com` | `Oficina123!` |
| Agente | `maria@coldwell.com` | `Agente123!` |
| Cliente | `client@tcmc.local` | `Client123!` |

---

## Reglas de oro para el equipo de desarrollo

1. **No reinventar** algoritmos financieros. Importar desde `prototype/shared/algorithms.js` y usar como fuente única. Si necesitás modificarlos, coordinar con TCMC y bumpear versión.
2. **No duplicar** la spec. Cualquier ambigüedad o conflicto entre el prototipo y los specs: **el spec gana**. El prototipo es referencia visual, no source-of-truth funcional.
3. **No mover dinero.** TCMC no procesa pagos reales en MVP. Solo registra que el cliente informó un pago.
4. **Respetar el RBAC.** 5 roles con scope jerárquico. Validar permisos en API + RLS de Postgres.
5. **Audit trail siempre.** Cambios de etapa, observaciones, aprobaciones de docs → quedan registrados.
6. **Server-side validation.** Toda regla de negocio (LTV, montos, transiciones de stage) validada en backend con Zod o equivalente. No confiar en el frontend.
7. **Documentar deltas.** Si algún detalle del spec no aplica o requiere cambio, documentar la decisión en un ADR o issue.

---

## Próximos pasos sugeridos al recibir este repo

### Si vas a cotizar:

1. Leé `docs/00-Brief-Cotizacion.md` (10 min).
2. Recorré el prototipo con los 5 roles (30 min).
3. Leé el spec del componente que vayas a cotizar (20–40 min).
4. Identificá dudas críticas y mandalas en una sola tanda a `panchobenegas@gmail.com`.
5. Emití cotización fija (preferida) o T&M con cap.

### Si ya estás contratado:

1. Decidí el hosting de Git (GitHub / GitLab / Bitbucket / propio).
2. Subí este paquete como punto de partida.
3. Moví `dev-templates/` al lugar que corresponda según el hosting (ej. `.github/ISSUE_TEMPLATE/` para GitHub).
4. Creá el repo de la app y de la landing (pueden ser monorepo o dos repos separados).
5. Setup de Supabase (o equivalente) y aplicá el DDL de `docs/02-TCMC-Spec-APP.md` sección 4.2.
6. Ejecutá el seed inicial (sección 16.2 del spec APP).
7. Empezá portando la landing (más rápido, baja complejidad).
8. En paralelo, arrancá el backend de la app: auth + esquema + un endpoint chico (`POST /api/leads`) para destrabar a la landing.

---

## Soporte y contacto

**Francisco Benegas (Pancho)**
Email: `panchobenegas@gmail.com`

Para dudas durante el desarrollo:
- Crear issue con plantilla `dev-templates/ISSUE_DEV_QUESTION.md` en el repo del proyecto.
- O email directo si es bloqueante.

Tiempo de respuesta esperado: 48 hs hábiles.

---

## Licencia

Código de propiedad de Tu Casa +Cerca / Francisco Benegas. La transferencia de propiedad intelectual al cliente es parte del contrato con el equipo de desarrollo.

---

*Versión 1.0 — Mayo 2026*
