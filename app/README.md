# TCMC App — Backoffice + Portal Cliente Tu Casa +Cerca

Esta carpeta es donde vive (o va a vivir) la aplicación productiva. El mockup está en `mockup-reference.html` y sirve como referencia visual/funcional.

## Quickstart

### Paso 1: Inicializar proyecto

**Recomendado — Next.js 14 + Supabase:**

```bash
cd app
npx create-next-app@latest . --typescript --tailwind --app --src-dir
# Elegir: No a ESLint (opcional), No a turbopack
npm install @supabase/supabase-js @supabase/ssr zod
```

### Paso 2: Configurar Supabase

1. Crear proyecto en https://supabase.com
2. Copiar las credenciales a `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. Ejecutar el schema SQL (ver `/Instructivo/03-Brief-Desarrollador-APP.md` sección 4)
4. Configurar RLS policies (sección 5)

### Paso 3: Seed inicial

Seedear la DB con:
- 1 super_admin: `panchobenegas@gmail.com` / hash de `Admin123!`
- 1 red: Coldwell Bankers
- 3 oficinas: Palermo, Belgrano, Recoleta
- `form_config` activa con `DEFAULT_FORM_CONFIG` de `/shared/constants.js`
- `simulator_config` activa con `CONFIG_DEFAULTS` de `/shared/algorithms.js`

### Paso 4: Portar componentes del mockup

Abrir `mockup-reference.html` en el navegador. Hacer login con cada rol y recorrer cada pantalla. Cada componente React del mockup se traslada a un archivo `.tsx` en `src/app/` o `src/components/`.

---

## Estructura sugerida del proyecto

```
app/
├── mockup-reference.html       Mockup visual completo (NO modificar, es referencia)
├── README.md                   Este archivo
├── src/
│   ├── app/                    Next.js App Router
│   │   ├── (public)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (cliente)/
│   │   │   ├── dashboard/
│   │   │   ├── nueva-solicitud/
│   │   │   ├── mi-solicitud/
│   │   │   ├── pagos/
│   │   │   └── soporte/
│   │   ├── (backoffice)/
│   │   │   ├── dashboard/
│   │   │   ├── usuarios/
│   │   │   ├── oficinas/
│   │   │   ├── legajos/
│   │   │   ├── cobranzas/
│   │   │   ├── legajos-finalizados/
│   │   │   ├── reportes/
│   │   │   ├── abm-formulario/
│   │   │   └── config/
│   │   └── api/
│   │       ├── auth/
│   │       ├── applications/
│   │       ├── documents/
│   │       ├── payments/
│   │       ├── notifications/
│   │       ├── form-config/
│   │       ├── config/
│   │       ├── leads/
│   │       └── export/
│   ├── components/             Componentes reutilizables
│   ├── lib/                    Clientes Supabase, helpers
│   │   ├── supabase/
│   │   └── algorithms.ts       (re-export desde ../../shared/algorithms.js)
│   └── types/                  TypeScript types
├── supabase/
│   ├── migrations/             SQL migrations
│   └── seed.sql                Seed inicial
├── package.json
└── tsconfig.json
```

---

## Contrato con la landing

Ver `/shared/CONTRACT.md`. Endpoints públicos que debés implementar:

- `POST /api/leads` — landing envía leads del simulador
- `GET /api/config/public` — landing consume tasas y LTV actualizados

**Ambos endpoints requieren CORS habilitado** para `https://tucasamascerca.com`.

---

## Algoritmos compartidos

Los algoritmos financieros viven en `/shared/algorithms.js`. Para usarlos en Next.js:

```typescript
// src/lib/algorithms.ts
// @ts-ignore - shared es JS plano
export * from '../../../shared/algorithms.js';
```

O copiar a TypeScript puro si preferís. **No dupliques la lógica** — si hay que cambiarla, cambiarla en `/shared/` y coordinar con el equipo de landing.

---

## Documentación de referencia

| Archivo | Qué contiene |
|---------|--------------|
| `mockup-reference.html` | El mockup completo funcionando con mock data. Tu fuente de verdad visual y funcional. |
| `/Instructivo/03-Brief-Desarrollador-APP.md` | Spec completa: stack, DB schema, API endpoints, algoritmos, triggers, checklist |
| `/Instructivo/01-Instructivo-Formulario.md` | Cómo funciona el ABM Formulario (para entender qué hace el panel que tenés que construir) |
| `/TCMC-Spec-Desarrollador.md` | Spec técnica completa del sistema |
| `/TCMC-supabase-plan.md` | Plan detallado de integración con Supabase |
| `/docs-legacy/` | Documentos técnicos previos (puede servir de referencia adicional) |

---

## Checklist mínimo antes de considerar "entregado"

Ver `/Instructivo/03-Brief-Desarrollador-APP.md` sección 13 para el checklist completo. Resumen:

- [ ] Schema de DB + RLS + seed funcional
- [ ] Auth completo (login, registro con aprobación, logout)
- [ ] Portal cliente: simulador + 5 vistas con upload real
- [ ] Formulario cliente **dinámico** (consume `GET /api/form-config/active`)
- [ ] 10 paneles de backoffice (ver mockup)
- [ ] Storage real de documentos con signed URLs
- [ ] Sistema de notificaciones in-app + email (4 triggers)
- [ ] Cron de cuotas por vencer (pg_cron)
- [ ] Export CSV/Excel en paneles
- [ ] Deploy con dominio, SSL, backups

**Estimación total:** ~80 horas con Supabase, ~100-110 con AWS self-hosted.

---

## Contacto

Dueño: **Francisco Benegas (Pancho)**
Email: `panchobenegas@gmail.com`
Repo: https://github.com/DevelopFB/TuCasaMasCerca
