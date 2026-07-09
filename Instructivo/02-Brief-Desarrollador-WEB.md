# Brief Desarrollador — Landing Web Tu Casa +Cerca

Este documento contiene **todo lo necesario** para implementar la landing page productiva. El objetivo es **minimizar las horas de desarrollo** portando el mockup existente a una arquitectura productiva simple.

## 📂 Carpeta de trabajo

**Trabajá exclusivamente en `/landing/`.** No toques `/app/` ni `/index.html` en la raíz (es el mockup combinado de referencia).

Archivos que vas a usar:
- `/landing/index.html` — tu punto de partida (ya limpio, sin React)
- `/landing/assets/` — imágenes listas para optimizar
- `/shared/algorithms.js` — algoritmos financieros del simulador (importar desde acá)
- `/shared/CONTRACT.md` y `/Instructivo/04-Contrato-Web-App.md` — contrato con el backend de la app
- `/Instructivo/01-Instructivo-Formulario.md` — contexto del negocio (opcional)

**No necesitás** leer todo el `/index.html` raíz ni el código React. Tu entregable es solo landing estática + integración con API pública del backend.

---

## 1. Alcance

**Qué entregar:**
- Landing page pública (sitio web informativo + simulador + captura de lead)
- Integración con link a la app (botón "Ingresar")
- SEO básico, meta tags, responsive mobile
- Hosting + dominio apuntado

**Qué NO incluye (es otro proyecto):**
- El backoffice / app de gestión (ver `03-Brief-Desarrollador-APP.md`)
- Integración backend real con base de datos
- Autenticación de usuarios

---

## 2. Código fuente de referencia

El mockup completo está en el archivo **`index.html`** en el repo raíz.

**Lo que le corresponde a este proyecto web:**
- Desde la línea 1 hasta ~1285 (todo antes del `<script type="text/babel">`)
- Especialmente: líneas 1-1220 (HTML + CSS de la landing)
- Script JS del simulador: líneas 950-1200 aprox

**Lo que NO le corresponde (es la app):**
- Todo lo que está dentro de `<script type="text/babel">` (React app)
- La carpeta `APP/`

---

## 3. Stack recomendado

**Opción A — Más rápida (minimiza horas):** Mantener HTML + CSS + JS vanilla como está en el mockup, y deployar en Netlify/Vercel estático. **~8-12 hs de trabajo total.**

**Opción B — Más profesional:** Next.js 14 con App Router + Tailwind. **~20-30 hs.** Ventaja: SEO mejorado, mejor performance.

**Recomendación:** Opción A para lanzamiento rápido. Migrar después si escala.

---

## 4. Secciones de la landing

Todas ya están diseñadas y funcionando en el mockup. El desarrollador solo debe:
- Separarlas en componentes si va con Next.js
- Optimizar imágenes (compresión, WebP, lazy loading)
- Responsive mobile

| Sección | Contenido | Líneas en mockup |
|---------|-----------|------------------|
| Header | Logo + nav + botón "Ingresar" | 453-466 |
| Hero con simulador | Título, subtítulo, badges, simulador interactivo | 469-520 |
| Cómo funciona | Pasos del proceso, flujo online | 530-570 |
| Casos de uso | 6 tarjetas con casos (enamoraste, familia, avanzar, etc.) | 573-600 |
| Coldwell Banker | Sección de partnership con buscador de propiedades | 618-720 |
| Testimonios | 3 testimonios reales | 725-760 |
| FAQ | Preguntas frecuentes con acordeón | 810-850 |
| Footer | Links y contacto | 850-fin |

---

## 5. Simulador de crédito (lógica ya implementada)

El simulador del hero ya funciona. Los algoritmos están en el mockup:

### 5.1 Cálculo del monto bruto
```javascript
function calcularBruto(prestamo) {
  const upfront = prestamo * 0.05;  // 5% de gastos upfront
  const iva = upfront * 0.21;        // 21% IVA sobre upfront
  return prestamo + upfront + iva;
}
```

### 5.2 Cálculo de cuota mensual (PMT)
```javascript
function calcularCuota(tasaAnual, meses, bruto) {
  const tm = tasaAnual / 12;
  return bruto * (tm * Math.pow(1 + tm, meses)) / (Math.pow(1 + tm, meses) - 1);
}
```

### 5.3 TNA (tasa nominal anual aproximada)
```javascript
function calcularTNA(cuota, meses, prestamo) {
  const td = (cuota * meses) / prestamo - 1;
  return Math.pow(1 + td, 12 / meses) - 1;
}
```

### 5.4 Configuración
```javascript
const CONFIG = {
  tasasBase: {
    12: 0.095,   // 10.5% anual para 12 meses
    24: 0.105,   // 11.5% anual para 24 meses
    36: 0.115,   // 12.5% anual para 36 meses
    48: 0.125,   // 13.5% anual para 48 meses
    60: 0.135    // 13.5% anual para 60 meses
  },
  maxLTV: 0.35,      // 35% del valor de la propiedad
  maxLoan: 50000     // USD 50.000 máximo
};
```

**Nota para el dev:** En el mockup estas tasas están hardcodeadas en el JS de la landing. En producción, traer desde el backend de la app via GET `/api/config/public` para que cuando el admin cambie las tasas en el backoffice, la landing se actualice automáticamente.

---

## 6. Integración con Coldwell Banker

### 6.1 Botón "Ver propiedades en Coldwell Banker"

Al hacer click, el cliente es redirigido a CB con los filtros aplicados. Código actual:

```javascript
function buscarEnCB() {
  const zona = document.getElementById('cb-zona').value;
  const tipo = document.getElementById('cb-tipo').value;
  const precio = document.getElementById('cb-precio').value;
  let url = 'https://www.coldwellbanker.com.ar/propiedades?';
  const params = ['suitable_for_credit=1']; // SIEMPRE filtro por defecto
  if (zona) params.push('zona=' + encodeURIComponent(zona));
  if (tipo) params.push('tipo=' + encodeURIComponent(tipo));
  if (precio) params.push('precio_hasta=' + encodeURIComponent(precio));
  url += params.join('&');
  window.open(url, '_blank');
}
```

**Clave:** `suitable_for_credit=1` siempre se incluye. Esto se negoció con CB para que su buscador filtre solo propiedades aptas para crédito Tu Casa +Cerca.

> **IMPORTANTE:** Si al momento del launch CB aún no implementó el flag `suitable_for_credit` en su URL de búsqueda, se redirige igual y el filtro se ignora. Hay que coordinar con CB para activarlo.

---

## 7. Captura de leads

El simulador del hero permite al usuario jugar con valores. Cuando el usuario hace click en "Contactar agente" (o equivalente):

**Comportamiento esperado:**
1. Enviar POST `/api/leads` al backend de la app con payload:
```json
{
  "email": "usuario@email.com",
  "phone": "+54 11 ...",
  "quote": {
    "propertyValue": 150000,
    "loanAmount": 45000,
    "months": 36,
    "cuota": 1234.56,
    "tna": 0.125
  },
  "source": "landing_simulator"
}
```
2. Mostrar mensaje de éxito y CTA "Creá tu cuenta para continuar"
3. Trackear evento en Google Analytics / Meta Pixel

---

## 8. Branding (alineado al brandbook V1)

**Brandbook oficial:** `/+CERCA-BRANDBOOK-V1.pdf` (en la raíz del repo). Es la fuente de verdad — leerlo antes de tocar estilos.

### 8.1 Nombre y copy
- **Nombre oficial:** "Tu Casa +Cerca" (nunca solo "+Cerca")
- **Tagline principal:** "Tu casa está +Cerca de lo que creés"
- **Copy:** Todo el texto está en el mockup. No modificar sin aprobación.

### 8.2 Paleta (definida como CSS variables)
```css
--brand-primary: #1A4394;     /* Azul institucional - dominante (botones, gradientes, headers) */
--brand-vivid:   #0D00FF;     /* Azul vibrante - acentos, hover states, focus, links */
--brand-dark:    #1E1E1E;     /* Negro/gris oscuro - texto principal */
--brand-mid:     #748082;     /* Gris medio - texto secundario, hints */
--brand-light:   #E1EAEB;     /* Gris claro - bordes, fondos suaves, separadores */
--brand-white:   #FFFFFF;
```

Las versiones de opacidad (75/50/25/10%) están definidas en el brandbook si se necesitan.

### 8.3 Tipografía
- **Familia web:** Poppins (cargada desde Google Fonts)
- **Pesos disponibles:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **NO usar 800** (Extra Bold) — está prohibido en este proyecto.

**Jerarquía:**
| Uso | Peso | Tamaño |
|-----|------|--------|
| H1 hero | 700 | clamp(32px, 5vw, 48px) |
| H2 sections | 600 | clamp(24px, 4vw, 36px) |
| H3 cards | 600 | 18-20px |
| Body | 400 | 15-16px |
| Body small / hints | 300 | 13-14px |
| Botones | 600 | 14-15px |
| Eyebrows / labels | 500, uppercase, tracking | 11-12px |

### 8.4 Iconografía
- **Estilo:** SVG line-style (stroke, sin relleno), siguiendo el brandbook
- **Set actual:** Lucide Icons inline. NO usar emojis en componentes principales.
- **Reglas:** stroke-width 2, stroke-linecap round, stroke-linejoin round, color via `currentColor`
- **Tamaños standard:** 18px (sm), 24px (default), 32px (lg), 48px (xl)

### 8.5 Logo
- **Logo principal:** `Tu Casa +Cerca` con isotipo (símbolo casa + ventana + cruz "+")
- **Tamaño mínimo:** 70px (web) / 1.85 cm (impreso)
- **Versiones:** completo, isotipo solo, monocromo, blanco/negro
- **Sobre azul institucional o primario:** logo blanco
- **Sobre fondos claros/blancos:** logo en color o azul institucional
- **Prohibiciones (9 reglas):** ver brandbook página correspondiente. Las más críticas:
  - NO condensar/estirar/deformar
  - NO cambiar colores
  - NO usar el icono casa sin todos sus elementos (+, ventana)
  - NO crear submarcas

### 8.6 Estados de UI
- **Hover en botones:** `transform: translateY(-1px)` + sombra más fuerte
- **Focus visible:** outline 3px sólido en `--brand-vivid` (#0D00FF), offset 2px
- **Transiciones:** 0.2s ease para color/transform/box-shadow
- **Reduce motion:** respetar `prefers-reduced-motion`

### 8.7 Sombras consistentes
```css
--shadow-sm: 0 2px 8px rgba(26, 67, 148, 0.08);
--shadow-md: 0 8px 24px rgba(26, 67, 148, 0.12);
--shadow-lg: 0 20px 48px rgba(26, 67, 148, 0.18);
```

### 8.8 Spacing escala
```css
--space-1: 8px; --space-2: 16px; --space-3: 24px;
--space-4: 32px; --space-6: 48px; --space-8: 64px; --space-12: 96px;
--section-py: clamp(48px, 8vw, 80px);   /* padding vertical secciones */
--section-px: clamp(16px, 4vw, 24px);   /* padding horizontal secciones */
```

### 8.9 Breakpoints responsive
- **1024px:** Tablet (grids 4 cols → 2 cols)
- **768px:** Mobile grande (grids 2 cols → 1 col, padding sections reducido)
- **520px:** Mobile chico (cards padding 24px → 16px, font-sizes reducidos)

---

## 9. SEO y performance

Requisitos mínimos:
- Meta tags completas (title, description, og:image, og:title)
- Sitemap.xml
- Robots.txt
- Favicon
- Imágenes comprimidas (actualmente `bg-houses.png` y `couple.png` pesan 4MB — bajar a <500KB cada una con WebP)
- Lighthouse score >85 en mobile
- Responsive desde 360px

---

## 10. Assets provistos

En el repo raíz:

| Archivo | Uso |
|---------|-----|
| `bg-houses.png` | Background del hero (comprimir a WebP) |
| `couple.png` | Imagen hero derecha (comprimir a WebP) |
| `caso-avanzar.png` | Tarjeta caso de uso |
| `caso-enamoraste.png` | Tarjeta caso de uso |
| `caso-familia.png` | Tarjeta caso de uso |
| `caso-remodelar.png` | Tarjeta caso de uso |
| `caso-sindeudas.png` | Tarjeta caso de uso |
| `caso-zona.png` | Tarjeta caso de uso |

---

## 11. Formulario de contacto

El mockup no tiene formulario de contacto tradicional (solo simulador + botón "Ingresar"). Si se agrega:
- Enviar POST `/api/leads` con `source: "contact_form"`
- Enviar email interno a ventas@tucasamascerca.com (configurar con SendGrid)
- Responder al cliente con email de bienvenida

---

## 12. Analítica y tracking

Instalar:
- **Google Analytics 4** (GA4)
- **Meta Pixel** (para remarketing Facebook/Instagram)
- **Google Tag Manager** (opcional, recomendado)

Eventos a trackear:
- `landing_view`
- `simulator_used` (cuando cambian valores)
- `cb_search_clicked`
- `ingresar_clicked` (abre la app)
- `lead_submitted`
- `faq_opened`

---

## 13. Checklist de entrega

- [ ] Landing deployada en dominio productivo
- [ ] HTTPS activo con SSL (Let's Encrypt)
- [ ] Responsive verificado en iPhone + Android + Desktop
- [ ] Lighthouse >85 en mobile
- [ ] GA4 + Meta Pixel instalados
- [ ] Sitemap + robots.txt
- [ ] Meta tags OG para redes sociales
- [ ] Simulador funcionando sin errores
- [ ] Link "Ingresar" apunta a `https://app.tucasamascerca.com` (o el dominio de la app)
- [ ] Botón CB redirige con `suitable_for_credit=1`
- [ ] Formulario de contacto / captura de lead funciona y envía a backend
- [ ] Código en repo git con README claro
- [ ] Documentación de cómo editar textos / tasas

---

## 14. Estimación de horas

| Tarea | Horas estimadas |
|-------|-----------------|
| Setup proyecto + deploy | 2 |
| Portar HTML/CSS del mockup y ajustar responsive | 6 |
| Optimizar imágenes y performance | 2 |
| Integrar simulador JS (ya está hecho) | 1 |
| Configurar captura de leads al backend | 3 |
| SEO, meta tags, sitemap | 2 |
| Analytics (GA4 + Meta Pixel) | 2 |
| Testing cross-browser/mobile | 3 |
| Deploy producción + dominio + SSL | 2 |
| **TOTAL MVP estático (Opción A)** | **~25 hs** |
| Si va con Next.js + SSR (Opción B, opcional) | +15 hs |

---

## 15. Preguntas al cliente antes de arrancar

1. ¿Dominio final? (`tucasamascerca.com.ar` / `.com` / otro)
2. ¿Subdominio para la app? (`app.tucasamascerca.com` recomendado)
3. ¿Tenés cuenta de SendGrid / Mailgun para emails?
4. ¿Ya existe GA4 / Meta Pixel o hay que crearlos?
5. ¿La integración con CB (flag `suitable_for_credit=1`) está confirmada con ellos?
6. ¿Quién edita los textos después del deploy? (CMS simple vs edición directa de HTML)
