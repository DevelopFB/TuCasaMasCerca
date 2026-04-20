# Instructivo TCMC — Tu Casa +Cerca

Esta carpeta contiene toda la documentacion necesaria para el uso de la plataforma y para el desarrollador que la implemente en produccion.

---

## Estructura del repo

```
TuCasaMasCerca/
├── index.html             ← Mockup combinado (landing + app). FUENTE DE VERDAD VISUAL.
│                            Abrir en navegador para ver el comportamiento completo.
│
├── landing/               ← Para el dev WEB (landing publica)
│   ├── index.html         (landing standalone, lista para deploy)
│   ├── assets/            (imagenes: hero, casos de uso, etc.)
│   └── README.md
│
├── app/                   ← Para el dev APP (backoffice + portal cliente)
│   ├── mockup-reference.html   (copia del mockup como referencia visual)
│   └── README.md          (quickstart con Next.js + Supabase)
│
├── shared/                ← Codigo compartido entre landing y app
│   ├── algorithms.js      (calcularBruto, calcularCuota, generatePaymentSchedule, etc.)
│   ├── constants.js       (STAGES, DEFAULT_FORM_CONFIG, QUESTION_TYPES, etc.)
│   └── CONTRACT.md        (contrato tecnico entre ambos lados)
│
├── Instructivo/           ← ESTA CARPETA
│   ├── README.md                        (este archivo)
│   ├── 01-Instructivo-Formulario.md    (manual del ABM Formulario)
│   ├── 02-Brief-Desarrollador-WEB.md   (spec para el dev de landing)
│   ├── 03-Brief-Desarrollador-APP.md   (spec para el dev de app)
│   └── 04-Contrato-Web-App.md          (contrato entre landing y app)
│
├── docs-legacy/           ← Documentos historicos (referencia adicional)
├── TCMC-Spec-Desarrollador.md    ← Spec tecnica completa (16 secciones)
├── TCMC-supabase-plan.md          ← Plan detallado de integracion Supabase
└── (assets de la landing, pdfs comerciales, etc.)
```

---

## Contenido de esta carpeta

| Archivo | Para quien | Proposito |
|---------|-----------|-----------|
| `01-Instructivo-Formulario.md` | Vos / Admin | Como editar el formulario de solicitud de credito (paso a paso, sin tocar codigo) |
| `02-Brief-Desarrollador-WEB.md` | Desarrollador web | Especificacion completa para la landing |
| `03-Brief-Desarrollador-APP.md` | Desarrollador app | Especificacion completa para la app |
| `04-Contrato-Web-App.md` | Ambos devs | Que datos comparten landing y app (endpoints, handoff) |

---

## ¿Cómo entrego al desarrollador?

### Caso 1 — Un solo dev hace todo

1. Darle acceso al repo: https://github.com/DevelopFB/TuCasaMasCerca
2. Indicarle que lea:
   - `Instructivo/README.md` (este archivo)
   - `Instructivo/02-Brief-Desarrollador-WEB.md` (empezar por landing, mas simple)
   - `Instructivo/03-Brief-Desarrollador-APP.md` (despues la app)
   - `Instructivo/04-Contrato-Web-App.md`
3. El dev trabaja primero en `/landing/`, deploya, cobra. Despues arranca `/app/`.

### Caso 2 — Dos devs en paralelo (mas rapido)

1. Darle acceso al repo a ambos
2. Dev WEB solo lee: `README.md`, `02-Brief-Desarrollador-WEB.md`, `04-Contrato-Web-App.md`. Trabaja en `/landing/`.
3. Dev APP solo lee: `README.md`, `03-Brief-Desarrollador-APP.md`, `04-Contrato-Web-App.md`, `01-Instructivo-Formulario.md`. Trabaja en `/app/`.
4. Ambos respetan el contrato de `/shared/CONTRACT.md` para que las partes se comuniquen.
5. Deploy independiente. La landing puede salir primero con boton "Ingresar — Proximamente" mientras se termina la app.

---

## Mentalidad de entrega

El objetivo es que el desarrollador **copie/porte lo que ya existe**, no que disene desde cero. Todo el trabajo de UX, algoritmos financieros, flujos, roles y copy ya esta hecho. Solo falta:

1. Portar el mockup HTML/React a componentes modulares
2. Reemplazar mock data por conexion a base de datos via API
3. Implementar autenticacion real (JWT)
4. Implementar uploads a storage externo (S3 / Supabase Storage)
5. Implementar los triggers de email (SendGrid / Resend)
6. Deploy

**Estimacion total realista:** 105 horas (25 hs landing + 80 hs app con Supabase).

Si usan AWS en vez de Supabase, sumar ~25 hs a la app (total ~130 hs).

---

## Antes de contratar al dev

Hacele estas preguntas para confirmar que entiende el alcance:

**Para el dev WEB:**
- ¿Vas con HTML estatico o Next.js? (HTML es mas rapido, ~25 hs vs ~40 hs con Next.js)
- ¿Tenes experiencia con Vercel/Netlify y SSL automatico?
- ¿Sabes optimizar imagenes pesadas (WebP, lazy loading)?
- ¿Cuanto cobras la hora?

**Para el dev APP:**
- ¿Supabase o AWS? (Supabase es mas rapido, ~80 hs vs ~110 hs con AWS)
- ¿Manejaste Postgres con RLS y cron jobs antes?
- ¿Experiencia con Next.js App Router + SSR?
- ¿Has implementado sistemas con roles y permisos complejos?
- ¿Cuanto cobras la hora?

Si el dev responde bien todas, y su presupuesto se acerca a las estimaciones, avanzar.
