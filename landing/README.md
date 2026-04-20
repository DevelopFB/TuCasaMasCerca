# TCMC Landing — Sitio público Tu Casa +Cerca

Esta carpeta contiene la landing page productiva (o el punto de partida para portarla a Next.js si se prefiere).

## Quickstart

### Opción A — Deploy estático (más rápido, recomendado)

```bash
# Simplemente subir esta carpeta a Netlify / Vercel / cualquier hosting estatico
# No requiere build step
```

### Opción B — Desarrollo local

```bash
# Servir con cualquier static server
cd landing
python3 -m http.server 8080
# o
npx serve .
```

Abrir http://localhost:8080

### Opción C — Portar a Next.js

1. `npx create-next-app@latest tcmc-landing --typescript --tailwind --app`
2. Dividir el HTML actual en componentes React en `app/page.tsx` y subcomponentes
3. Importar algoritmos desde `../shared/algorithms.js`

---

## Estructura

```
landing/
├── index.html          Todo el HTML + CSS + JS de la landing (self-contained)
├── assets/             Imágenes (bg-houses, couple, caso-*, logo)
└── README.md           Este archivo
```

---

## Configuración

### Variable `APP_URL`

El botón "Ingresar" redirige a la app. El dominio se configura en `index.html`:

```javascript
const APP_URL = window.APP_URL || 'https://app.tucasamascerca.com';
```

Para desarrollo local, agregar antes del script:

```html
<script>window.APP_URL = 'http://localhost:3000';</script>
```

O para producción usar `<meta>` / env de Vercel.

---

## Contrato con la app

Ver `/shared/CONTRACT.md` en la raíz del repo. Resumen:

1. **Botón "Ingresar"** redirige a `APP_URL/login` con query params opcionales (`propertyValue`, `loanAmount`, `months`).
2. **Captura de lead** (cuando haya formulario): `POST APP_URL/api/leads`
3. **Tasas dinámicas**: `GET APP_URL/api/config/public` (con fallback a valores hardcodeados si falla).

---

## Algoritmos financieros

Viven en `/shared/algorithms.js`. Para usarlos en el simulador:

```html
<script src="../shared/algorithms.js"></script>
<script>
  const bruto = TCMC.calcularBruto(30000);
  const cuota = TCMC.calcularCuota(0.125, 36, bruto);
</script>
```

Actualmente el simulador tiene los algoritmos duplicados inline. **Para el dev:** recomendado refactorizar para importarlos desde `/shared/` y evitar divergencia.

---

## Tareas pendientes del dev

Ver `/Instructivo/02-Brief-Desarrollador-WEB.md` para el checklist completo:

- [ ] Optimizar imágenes (bg-houses.png y couple.png pesan 4 MB cada una → convertir a WebP)
- [ ] Integrar `APP_URL` via env en deploy
- [ ] Instalar GA4 + Meta Pixel
- [ ] Configurar POST `/api/leads` cuando haya formulario de captura
- [ ] SEO: meta tags, sitemap, robots.txt
- [ ] Responsive final testing (360px → 1920px)
- [ ] Deploy a Vercel / Netlify con dominio `tucasamascerca.com`
- [ ] SSL (automático en Vercel/Netlify)

**Estimación:** ~25 horas. Ver brief para desglose.

---

## Referencia visual

- `/index.html` (raíz del repo): mockup combinado landing + app. Útil para ver el comportamiento del botón Ingresar en el flujo completo.
- `/app/mockup-reference.html`: la app como referencia para que el dev web entienda qué recibe el usuario después de ingresar.
