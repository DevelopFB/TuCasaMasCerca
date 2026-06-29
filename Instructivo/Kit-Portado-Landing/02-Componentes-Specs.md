# Specs de Componentes — Landing Tu Casa +Cerca

Detalle visual y comportamental de cada módulo. Usar junto con `04-Design-Tokens.json` para todos los valores de color/tipo/espacio.

---

## HEADER

| Propiedad | Valor |
|-----------|-------|
| Position | sticky, top: 0, z-index: 1000 |
| Background | white |
| Border-bottom | 1px solid `--brand-light` |
| Padding | 16px 0 |
| Container max-width | 1400px |
| Logo height | 40px |
| Nav gap | 32px |

**Mobile (<768px):**
- Nav links se ocultan
- Aparece hamburger menu (3 líneas, color `--brand-primary`)
- Click → desplegable vertical con todos los links + botón Ingresar
- Animación: las 3 líneas rotan a X cuando abierto

**Botón Ingresar:**
- Background: `--brand-primary` (#1A4394)
- Color: white
- Padding: 10px 24px
- Border-radius: 8px
- Font-weight: 600
- Hover: background `--brand-primary-hover`, transform translateY(-1px)

---

## HERO con SIMULADOR

| Propiedad | Valor |
|-----------|-------|
| Background | `linear-gradient(135deg, #1A4394 0%, #0D00FF 100%)` |
| Overflow | hidden |
| Padding vertical | `clamp(48px, 8vw, 80px)` |
| Layered | 3 capas: fondo casas (opacity 0.35), overlay, foto pareja |

**Estructura interna (grid 2 columnas):**

### Columna izquierda (hero-copy):
- **H1:** "Tu casa está / +Cerca de / lo que creés" (3 líneas con `<br>`)
  - Font: Outfit Bold 700, size clamp(32px, 5vw, 48px)
  - Color: white
  - "+Cerca" tiene clase `.brand-accent` con `color: white` + `text-shadow: 0 4px 24px rgba(13, 0, 255, 0.45)`
- **Subtítulo:** "Simulá tu préstamo en minutos y / conocé cuánto podés financiar hoy." (2 líneas con `<br>`)
  - Color: rgba(255,255,255,0.88)
  - Font-size: 18px
- **Badges (grid 2x2):**
  - "100% online" / "Rápido" / "Transparente" / "Simple"
  - Background: rgba(255,255,255,0.12) + backdrop-filter blur(8px)
  - Border: 1px solid rgba(255,255,255,0.22)
  - Border-radius: 999px (pill)
  - Padding: 10px 18px
  - Solo texto (sin íconos), centrado

### Columna derecha (hero-sim card):
- **Card "Simulá tu préstamo":**
  - Background: `linear-gradient(135deg, #f5f5f5 0%, #fff 100%)`
  - Border-radius: 16px
  - Padding: 40px (24px en mobile)
  - Box-shadow: `--shadow-lg`
- **Inputs:**
  - Valor del inmueble (U$D): text input, separador de miles con punto, default 100.000
  - Préstamo a solicitar (U$D): text input, default 35.000
  - Plazo: select dropdown, default 60 meses
- **Resultado:**
  - Cuota mensual: USD X.XXX,XX (font-size 32px, bold, color `--brand-primary`)
  - Préstamo a solicitar / Monto bruto / Recibirás (3 líneas info)
  - Border-top separator
  - TNA: X.XX% + CFT: X.XX% (con tooltips `?`)
- **Botón "Contactar asesor":**
  - Width: 100%, background `--brand-primary`, font-weight 600

### Foto pareja (desktop):
- Position absolute, bottom: -120px, left: 46%
- Width: min(820px, 62vw)
- Z-index: 2
- Filter: drop-shadow
- **Mobile (<768px): display: none**

---

## SECCIÓN "ASPIRACIÓN"

```
Background: linear-gradient(135deg, #1A4394 0%, #0D00FF 100%)
Color: white
Padding vertical: var(--section-py)
Text-align: center
Margin: 32px 0 (en mobile) / 60px 0 (desktop)
```

**Contenido:**
- H2 "Cuando una casa te elige, el desafío es llegar." (clamp 28-44px, weight 600)
- Párrafo "Con Tu Casa +Cerca, llegar es posible. Rápido, simple y 100% online."

---

## CÓMO FUNCIONA

```
Background: #f9f9f9
Padding vertical: var(--section-py)
```

**Estructura:**
- H2 centrado "Así de simple, así de transparente"
- Grid de 5 pasos (mobile: 1 columna, tablet: 2, desktop: 5):
  - Cada paso: número circular azul + título + descripción
- Card "El flujo completo online en Tu Casa +Cerca" con 4 sub-items:
  - KYC — Conozca a su cliente
  - Validación de propiedad
  - Aprobación y escritura
  - Cobranza automatizada

---

## CASOS DE USO

```
Background: white
Padding vertical: var(--section-py)
```

**Grid 3 columnas (mobile: 1, tablet: 2):**

| # | Imagen (250-280KB) | Título | Descripción |
|---|---------------------|--------|-------------|
| 1 | caso-familia.png | "Se agranda la familia" | Necesitás más espacio |
| 2 | caso-zona.png | "La zona preferida" | Encontraste el barrio |
| 3 | caso-remodelar.png | "Querés remodelar" | Mejorar tu hogar actual |
| 4 | caso-enamoraste.png | "Te enamoraste de ese inmueble" | Esa propiedad ideal |
| 5 | caso-sindeudas.png | "Sin deudas a familia" | Sin pedir prestado |
| 6 | caso-avanzar.png | "Querés avanzar" | Próximo paso de vida |

**Cada card:**
- Border: 2px solid `--brand-light`
- Border-radius: 16px
- Padding: 28px (20px en mobile)
- Imagen 110px width, border-radius 12px, object-fit cover
- Hover: transform translateY(-4px), shadow-md, border-color cambia a primary

---

## PLATAFORMA

```
Background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%)
Padding vertical: var(--section-py)
```

**Grid 4 columnas (mobile: 1, tablet: 2):**

| # | Icono SVG | Título | Descripción |
|---|-----------|--------|-------------|
| 1 | check-circle | 100% Online | Trámite sin moverte |
| 2 | zap | Rápido | Respuesta en horas |
| 3 | search | Transparente | Sin letra chica |
| 4 | target | Simple | Pasos claros |

Cada icono: SVG Lucide line-style, color `--brand-primary`, 32px.

---

## COLDWELL BANKER (alianza)

```
Background: white
Padding vertical: var(--section-py)
Max-width container: 1000px
```

**Estructura:**
- Badge "INTEGRACIÓN ESTRATÉGICA" (uppercase, tracking, font-size 12px, weight 500)
- H2 "Elegís la propiedad. Tu Casa +Cerca completa el camino."
- Subtítulo: "Encontrás tu propiedad con Coldwell Banker Argentina y financiás el complemento con Tu Casa +Cerca, en un proceso integrado y 100% online. Coldwell Banker Argentina es parte de una red global reconocida mundialmente, con presencia en +40 países."

**Infografía horizontal (4 stats + 3 flechas):**
| Stat 1 | → | Stat 2 | → | Stat 3 (logo) | → | Stat 4 |
|--------|---|--------|---|---------------|---|--------|
| **100+** años de trayectoria | | **40+** países con presencia | | **Logo CB** (imagen 44px) | | **Tu Casa +Cerca** financiás el complemento |

- Background: gradient suave azul (`--brand-primary-10` → `--brand-vivid-10`)
- Border-radius: 16px
- Padding: 40px 32px (24px 16px en mobile)
- **Mobile:** flex-direction column, flechas rotadas 90°

**Grid 3 cards de beneficios** con icono + título + descripción (Home, Users/Handshake, Zap).

---

## PROPIEDADES CB

```
Background: #f9f9f9
Padding vertical: var(--section-py)
Max-width container: 1100px
Grid 2 columnas (filtros izquierda, preview derecha)
```

**Columna izquierda - Filtros:**
- Badge "PROPIEDADES APTAS CRÉDITO"
- H2 "Encontrá tu próxima casa con Coldwell Banker Argentina"
- Subtítulo
- Inputs: Zona, Tipo de propiedad (select), Precio hasta (USD)
- Botón "Ver propiedades en Coldwell Banker Argentina" con icono search
- Texto pequeño: "Serás redirigido al sitio oficial de Coldwell Banker Argentina con tu búsqueda aplicada"

**Columna derecha - Preview (oculta en mobile):**
- 2 prop-card-demo con imagen real (Unsplash)
- Tag "Apto crédito Tu Casa +Cerca"
- Strong: "Departamento 3 amb." / "PH 2 amb."
- Texto: "Palermo, CABA" / "Caballito, CABA"
- Precio: "USD 120.000" / "USD 95.000"

---

## TESTIMONIOS

```
Background: white
Padding vertical: var(--section-py)
Max-width: 1100px
Grid 3 columnas (mobile: 1)
```

**Cada testimonio card:**
- Background: #f9f9f9
- Border: 1px solid `--brand-light`
- Border-radius: 16px
- Padding: 32px (20px en mobile)
- Estrellas: ★★★★★ amarillo (#f59e0b)
- Texto en italic
- Avatar circular + nombre + ciudad

---

## TASAS Y CFT

```
Background: white
Padding vertical: var(--section-py)
Grid 2 columnas (mobile: 1)
```

**Box 1 - "Cuotas por Plazo":**
- Icono BarChart3
- Subtítulo: "Ejemplos en base a un crédito de 30.000 USD"
- Tabla con 5 rows: 12, 24, 36, 48, 60 meses + cuota mensual

**Box 2 - "CFT - Costo Financiero Total":**
- Icono Clock
- Subtítulo: "CFT anualizado: incluye intereses, comisiones e IVA sobre intereses (sin sellados ni gastos de escritura)."
- Tabla con 5 rows: 12, 24, 36, 48, 60 meses + CFT % anual

---

## FAQ

```
Background: #f9f9f9
Padding vertical: var(--section-py)
Max-width: 1000px
```

**Cada item FAQ:**
- Background: white
- Border-radius: 8px
- Padding: 24px (16px en mobile)
- Margin-bottom: 12px
- Pregunta + "+" (cambia a "-" cuando abierto)
- Respuesta con max-height 0 / 500px, transition 0.3s

---

## CTA FINAL

```
Background: linear-gradient(135deg, #1A4394 0%, #0D00FF 100%)
Color: white
Padding vertical: var(--section-py)
Text-align: center
```

- H2 "¿Listo para empezar?"
- Botón "Empezar simulación" → scroll suave a #simulador
- Botón blanco con texto azul (background white, color `--brand-primary`)

---

## FOOTER

```
Background: #1E1E1E (--brand-dark)
Color: white
Padding: 48px 24px 24px
```

**Grid 4 columnas (mobile: 1):**

| Producto | Empresa | Legal | Contacto |
|----------|---------|-------|----------|
| Simulador | Blog | Términos | +54 11 4444-4444 |
| Tasas | Contacto | Privacidad | info@tucasamascerca.com.ar |

Links footer: color rgba(255,255,255,0.85), hover opacity 0.7 + underline.

**Línea inferior:**
- Copyright "© 2026 Tu Casa +Cerca"
- Pequeña ruedita (gear icon) → acceso oculto al editor admin **(en Webflow/Framer esto NO se implementa así; es el login a la plataforma directamente — el ícono ruedita ya no es necesario)**

---

## ESTADOS GLOBALES

### Hover en botones
```css
transition: all 0.2s ease;
:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
:focus-visible { outline: 3px solid var(--brand-vivid); outline-offset: 2px; }
```

### Hover en cards
```css
transition: all 0.2s ease;
:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--brand-primary); }
```

### Accessibility
- Skip-link "Saltar al contenido" (oculto, visible al :focus)
- `prefers-reduced-motion` respetado
- Focus visible accesible (WCAG AA)
