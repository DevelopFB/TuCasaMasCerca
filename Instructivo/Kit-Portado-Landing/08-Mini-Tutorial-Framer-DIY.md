# Mini-tutorial Framer — Armar la landing vos mismo

Guía paso a paso para que Pancho monte un primer MVP de la landing en Framer **sin ayuda externa**, usando el kit que ya tenés en esta carpeta. Tiempo estimado: **4-6 horas**.

> ¿Por qué Framer y no Webflow para hacerlo vos mismo? Porque Framer tiene curva de aprendizaje mucho más suave (te vas a sentir en Figma). Webflow es más potente pero requiere más horas para dominar.

---

## Antes de empezar — Checklist

- [ ] Tener abierta la carpeta `Kit-Portado-Landing/` en Finder
- [ ] Tener `03-Copy.docx` abierto en Word/Pages (para copy-paste)
- [ ] Tener `02-Componentes-Specs.md` abierto en una pestaña aparte (para consultar dimensiones)
- [ ] Tener https://developfb.github.io/TuCasaMasCerca/ abierto en otra pestaña (referencia visual)
- [ ] Tener 4 horas de tiempo libre (idealmente en 1-2 sesiones)

---

## PASO 1 — Crear cuenta Framer (5 min)

1. Andá a https://www.framer.com/
2. Click en **"Sign up free"** (esquina superior derecha)
3. Registrate con tu cuenta de Google (más rápido)
4. Elegí el plan **"Free"** por ahora. Te alcanza para construir y testear todo.

> Recién cuando vayas a publicar con tu dominio propio (`tucasamascerca.com.ar`) pasás al plan **Pro (USD 30/mes)**.

---

## PASO 2 — Crear el proyecto desde template (5 min)

1. En el dashboard, click en **"New Project"** (botón azul arriba)
2. Te muestra una galería de templates. **Buscá** en el cuadro superior: `landing page` o `fintech`
3. Recomendados para arrancar:
   - **"SaaS Landing"** (gratis) — estructura ya muy parecida a la nuestra
   - **"Startup"** (gratis) — más minimalista
   - **"Blank"** (vacío) — si te animás a empezar de cero
4. Click en el template → **"Use Template"**
5. Nombrá el proyecto: `Tu Casa +Cerca` y dale **"Create"**

---

## PASO 3 — Configurar tipografía Outfit (5 min)

Framer carga Inter por defecto. Hay que cambiar a Outfit.

1. En el panel derecho, click en cualquier texto del template
2. En la sección **"Font"**, click en el nombre actual (probablemente "Inter")
3. Se abre el selector. Escribí en el buscador: `Outfit`
4. Aparece **"Outfit"** de Google Fonts → click para seleccionarlo
5. Framer la carga automáticamente. **¡Listo!**

Para aplicarla a TODO el sitio de una vez:
1. En el panel izquierdo, andá a **"Text Styles"** (icono "T")
2. Cambiá cada Text Style (H1, H2, Body, etc.) → cambiá la font a Outfit
3. Asegurate de tener estos pesos disponibles: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700), Extra Bold (800)

> Tutorial oficial sobre Text Styles: https://www.framer.com/help/articles/text-styles/

---

## PASO 4 — Configurar paleta de colores (10 min)

Vamos a crear "Color Styles" reutilizables.

1. En el panel izquierdo, ir a **"Color Styles"** (icono de paleta)
2. Click en **"+"** para crear nuevo color style
3. Crear estos 6 colores (copiá los valores HEX exactos de `04-Design-Tokens.json`):

| Nombre | HEX |
|--------|-----|
| Brand Primary | `#1A4394` |
| Brand Vivid | `#0D00FF` |
| Brand Dark | `#1E1E1E` |
| Brand Mid | `#748082` |
| Brand Light | `#E1EAEB` |
| Brand White | `#FFFFFF` |

4. Para los gradientes del hero, crear un **Gradient Style**:
   - Tipo: **Linear**
   - Ángulo: **135°**
   - Stops: 0% → `#1A4394`, 100% → `#0D00FF`
   - Nombre: `Hero Gradient`

> Tutorial oficial: https://www.framer.com/help/articles/color-styles/

---

## PASO 5 — Construir las secciones (3-4 horas)

Esta es la parte más larga. **No lo hagas todo de una sentada.** Hacé 2-3 secciones por sesión.

### Estrategia general
Por cada sección del sitemap (`01-Sitemap.md`):
1. Identificá qué elementos del template podés **reutilizar** (cambiar copy y colores)
2. Lo que no exista, **insertalo** desde "Insert" (panel izquierdo)
3. Aplicá el copy desde `03-Copy.docx` (copy-paste exacto)
4. Aplicá colores y tipografías que ya configuraste

### Orden recomendado (de más fácil a más difícil)

#### 5.1 Header (15 min)
1. Borrá el header del template
2. Insert → **Navigation** (Framer tiene componente nativo)
3. Logo: borrá el del template, drag the file `06-Assets/` o crealo con texto "Tu Casa +Cerca"
4. Links: pegar desde Copy.docx → "Cómo funciona", "Coldwell Banker", etc.
5. Botón "Ingresar" → estilo: background `Brand Primary`, color blanco, weight 600, border-radius 8px
6. Mobile: Framer ya hace hamburger automático en breakpoint < 768px

#### 5.2 Footer (15 min)
Lo hacés primero para sacártelo del medio.
1. Insert → **Footer** template
2. 4 columnas con los items de `03-Copy.docx` sección FOOTER
3. Background: `Brand Dark` (#1E1E1E)
4. Color texto: blanco con opacity 85%

#### 5.3 Hero con simulador (45 min) — EL MÁS IMPORTANTE
1. Background: aplicar el `Hero Gradient` creado en Paso 4
2. Layout: 2 columnas (Frame con `Layout: Stack Horizontal`, gap 48px)
3. **Columna izquierda:**
   - H1: insertar texto, pegar las 3 líneas del Copy.docx, fuente Outfit Bold 700, color blanco
   - Para el "+Cerca" especial: hacé un span dentro del H1 con text-shadow `0 4px 24px rgba(13,0,255,0.45)`
   - Subtítulo: 2 líneas, color blanco con opacity 88%, weight 400
   - 4 badges (grid 2x2):
     - Insert → Frame
     - Layout: Stack Horizontal
     - Border-radius: 999px (pill)
     - Background: `rgba(255,255,255,0.12)`
     - Border: 1px solid `rgba(255,255,255,0.22)`
     - Padding: 10px 18px
     - Pegar texto del badge (100% online, Rápido, etc.)
     - Duplicar 3 veces, cambiar el texto
4. **Columna derecha — Simulador:**
   - Insert → **Embed** (CRÍTICO: este es el componente clave)
   - Pegá TODO el contenido de `05-Custom-Code-Simulator.html`
   - Setea el width: 520px, height: auto
   - ¡Listo! El simulador funciona standalone con cálculos en tiempo real

> Tutorial sobre Embed en Framer: https://www.framer.com/help/articles/embedding-html/

#### 5.4 Cómo funciona (20 min)
1. Background: `#f9f9f9`
2. H2 centrado del Copy
3. Grid 5 columnas (mobile 1):
   - Cada paso: círculo numerado azul + título Outfit semibold + descripción
   - Usar componente "Stat" o "Feature" del template, adaptarlo
4. Card "El flujo completo online en Tu Casa +Cerca":
   - Frame con padding 40px, border-radius 12px, background blanco, border 1px solid `Brand Light`
   - Adentro: H3 + 4 items con icono Lucide a la izquierda

#### 5.5 Casos de uso (20 min)
1. Background blanco
2. H2 centrado del Copy
3. Grid 3 columnas (mobile 1):
   - Cada card: imagen de `06-Assets/caso-*.png` + título Outfit semibold + descripción
   - Border 2px solid `Brand Light`
   - Border-radius 16px, padding 28px
   - **Hover effect**: en Framer, click en el card → panel derecho → "Effects" → "On Hover" → "Translate Y -4px" + "Box Shadow Medium"

#### 5.6 Plataforma (15 min)
Similar a Casos de uso pero con iconos Lucide en vez de fotos.
1. Para iconos Lucide en Framer:
   - Insert → **Component**
   - Buscá "Lucide" en la galería de Framer Community
   - Está el componente oficial, gratis
2. Si no aparece, usá `https://lucide.dev/icons/`, descargá el SVG y arrastralo a Framer

#### 5.7 Coldwell Banker — Alianza (30 min)
1. Badge "INTEGRACIÓN ESTRATÉGICA" (uppercase, letter-spacing, color `Brand Primary`, background `rgba(26,67,148,0.10)`)
2. H2 + subtítulo del Copy
3. **Infografía horizontal:**
   - Frame Stack Horizontal con 7 elementos: 4 stats + 3 flechas
   - Background: linear gradient `rgba(26,67,148,0.10)` → `rgba(13,0,255,0.10)`
   - Border-radius 16px, padding 40px 32px
   - Para el stat con logo: en vez de texto "100+", insertá la imagen `Coldwell-Banker-Symbol.png` (height 44px)
4. Grid 3 cards de beneficios (similar a Plataforma)

#### 5.8 Propiedades CB (20 min)
1. Layout 2 columnas
2. Izquierda: badge + H2 + 3 inputs + botón
3. **Botón "Ver propiedades en Coldwell Banker Argentina":**
   - Type: Link
   - URL: `https://www.coldwellbanker.com.ar/propiedades?suitable_for_credit=1`
   - Background `Brand Primary`, blanco, peso 600
4. Derecha: 2 prop-cards demo con imagen Unsplash. Las URLs están en `02-Componentes-Specs.md`.

#### 5.9 Testimonios (15 min)
Grid 3 columnas, cada card con estrellas, texto en italic, avatar circular + nombre.

#### 5.10 Tasas y CFT (15 min)
2 boxes lado a lado, cada uno con icono Lucide + título + subtítulo + tabla simple.

#### 5.11 FAQ (15 min)
1. Insert → **Accordion** (componente nativo de Framer)
2. Por cada FAQ: pegar pregunta + respuesta del Copy
3. Estilo: background blanco, border-radius 8px, padding 24px

#### 5.12 CTA Final (10 min)
1. Background: `Hero Gradient`
2. H2 + subtítulo blancos
3. Botón "Empezar simulación" → background blanco, color `Brand Primary`, border-radius 8px
4. **Smooth scroll a #simulador:** en el botón, Link → "Scroll to section" → seleccionar Hero

---

## PASO 6 — Formulario de captura de leads (15 min)

El botón "Contactar asesor" del simulador redirige a la app (que aún no existe). Mientras tanto, agregá un form aparte:

1. Insert → **Form**
2. Campos: Nombre, Email, Teléfono
3. Click en el form → panel derecho → **"On Submit"**:
   - Action: **Send email**
   - To: `info@tucasamascerca.com.ar` (o tu email)
   - Subject: `Nuevo lead de la landing`
4. Mensaje de éxito: "¡Gracias! Un asesor se va a contactar pronto."

> Framer tiene esto built-in. Si querés algo más sofisticado: integrar con Resend o HubSpot (vía Webhook).

---

## PASO 7 — Responsive (30 min)

Framer tiene 3 breakpoints visuales que ves en la barra superior: **Desktop / Tablet / Phone**.

Por cada sección:
1. Click en el breakpoint **Phone** (ícono celular)
2. Mirá si todo se ve bien. Ajustes comunes:
   - Grid de 3-5 columnas → cambiar a 1 columna
   - Padding 80px → reducir a 24-32px
   - Font-size H1: 48px → 32px
   - **Foto pareja del hero**: ocultar (click en la foto → "Visibility" → desactivar en Phone)
   - Hamburger menu: Framer lo hace automático en Navigation component

3. Tablet: ajustes intermedios (grids de 2 columnas, padding 48px)

> Tutorial responsive en Framer: https://www.framer.com/academy/lessons/responsive-design

---

## PASO 8 — Preview y testing (15 min)

1. Click en **"Preview"** (esquina superior derecha, ícono play)
2. Se abre nueva pestaña con el sitio en staging URL (algo como `https://tu-casa-mas-cerca.framer.website`)
3. Probá:
   - [ ] Todos los links del nav scrollean a su sección
   - [ ] Hamburger menu en mobile funciona
   - [ ] Simulador calcula bien (valor 100.000, monto 35.000, 60 meses → cuota ~U$D 748)
   - [ ] Botón CB redirige al sitio externo
   - [ ] Formulario envía email
   - [ ] No hay overflow horizontal en mobile (deslizá a izq/der)

4. Mandate la URL a vos mismo por WhatsApp y abrilo en celular real

---

## PASO 9 — Publicar staging (5 min)

Mientras no tenés dominio propio:

1. Click en **"Publish"** (esquina superior derecha)
2. Framer te asigna URL gratis: `https://[nombre-proyecto].framer.website`
3. Compartila con tu equipo de Marketing o con Santi para feedback
4. Cada vez que hagas un cambio y aprietes "Publish", se actualiza en 5 segundos

---

## PASO 10 — Próximos pasos

### Pulir con freelance (opcional pero recomendado)
Cuando tengas el MVP funcional:
1. Invitá un freelance a tu proyecto (settings → Team → Invite)
2. Que te ayude a:
   - Pulir animaciones (scroll reveals, hover sofisticados)
   - Mejorar responsive en breakpoints intermedios
   - SEO técnico (meta tags, og:image, sitemap)
   - Pixel/Analytics

Costo estimado pulido: USD 200-400 (mucho menos que armar desde cero).

### Comprar dominio
Cuando esté pulido:
1. Comprá `tucasamascerca.com.ar` en https://nic.ar (~ARS 2.700/año)
2. En Framer: Settings → Domains → Add domain → seguir las instrucciones de DNS
3. Framer instala SSL automático (5-10 min)

### Pasar a plan Pro
1. En Framer: Settings → Billing → Upgrade to **Pro** (USD 30/mes)
2. Habilita: dominio custom, password protection, CMS

---

## Recursos útiles

| Recurso | Link |
|---------|------|
| Framer Academy (tutoriales) | https://www.framer.com/academy/ |
| Framer YouTube oficial | https://www.youtube.com/@framer |
| Plantillas gratuitas | https://www.framer.com/templates/free/ |
| Comunidad / soporte | https://www.framer.community/ |
| Lucide Icons (set oficial) | https://lucide.dev/icons/ |
| Unsplash (fotos gratis) | https://unsplash.com/ |

---

## Errores comunes y cómo resolverlos

| Problema | Solución |
|----------|----------|
| El simulador embebido se ve cortado | Setear `height: 100%` o un valor fijo (700px) en el contenedor del Embed |
| La foto del hero se ve gigante en mobile | Click en foto → Visibility → desactivar en breakpoint Phone |
| Outfit no se carga | Verificar que en Settings → Site → Fonts esté agregado Outfit con todos los pesos |
| Overflow horizontal en mobile | Identificar el elemento causante (usualmente una imagen sin max-width: 100%) |
| El botón "Ingresar" no redirige | Verificar que el Link sea de tipo "External URL" no "Page" |
| Imágenes pesan mucho | Comprimir con TinyPNG (https://tinypng.com) antes de subirlas |

---

## Si te trabás

Tres opciones, en orden:
1. **Buscá el tutorial específico** en https://www.framer.com/academy/
2. **Preguntá en la comunidad oficial**: https://www.framer.community/ (responden rápido)
3. **Contratá 2-3 horas de un freelance** para destrabar lo puntual (USD 50-100). Mucho más barato que pagar el proyecto entero.

---

## ¡Éxitos!

Con este tutorial + el kit completo en mano, deberías llegar a un MVP publicado en staging en **un fin de semana**. Después podés contratar al freelance solo para pulir lo que no quedó perfecto, ahorrándote 60-70% del costo total.

**Recordá:** no busques que esté perfecto al primer intento. Publicá una v1 funcional, mostrala a tu equipo, recibí feedback, mejorá. Es mejor tener algo publicado en 1 semana que algo perfecto en 2 meses.

— Tu Casa +Cerca · Plataforma de Créditos Hipotecarios
