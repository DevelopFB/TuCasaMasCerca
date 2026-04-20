# Brief Desarrollador — Landing Web Tu Casa +Cerca

Este documento contiene **todo lo necesario** para implementar la landing page productiva. El objetivo es **minimizar las horas de desarrollo** portando el mockup existente a una arquitectura productiva simple.

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
    12: 0.105,   // 10.5% anual para 12 meses
    24: 0.115,   // 11.5% anual para 24 meses
    36: 0.125,   // 12.5% anual para 36 meses
    48: 0.135,   // 13.5% anual para 48 meses
    60: 0.145    // 14.5% anual para 60 meses
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

## 8. Branding y contenido

- **Nombre oficial:** "Tu Casa +Cerca" (nunca solo "+Cerca")
- **Logo:** `assets/logo.png` (si no existe, generar uno simple con Poppins bold)
- **Colores principales:**
  - Azul marca: `#2563eb`
  - Azul acento: `#AFC8FF`
  - Verde éxito: `#16a34a`
  - Rojo atraso: `#dc2626`
- **Tipografía:** Poppins (ya cargada desde Google Fonts)
- **Copy:** Todo el texto está en el mockup. No modificar sin aprobación.

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
