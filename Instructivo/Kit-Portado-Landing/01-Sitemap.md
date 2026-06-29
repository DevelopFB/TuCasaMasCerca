# Sitemap — Landing Tu Casa +Cerca

Estructura completa del sitio, sección por sección, en el orden en que aparecen.

---

## Estructura general

```
HEADER (sticky)
└── Logo + Nav (desktop) / Hamburger (mobile) + Botón Ingresar

HERO con SIMULADOR  (#simulador)
├── Background azul gradient + foto pareja (desktop) / sin foto (mobile)
├── Copy izquierda: H1 + subtítulo + badges
└── Card simulador derecha (interactivo)

ASPIRACIÓN
└── Banner azul con frase aspiracional

CÓMO FUNCIONA  (#como)
├── 5 pasos numerados
└── Card "Flujo completo online" con 4 sub-items

CASOS DE USO  (#casos)
├── Título
└── 6 cards con imagen + título + descripción

PLATAFORMA
├── 4 cards con icono + título + descripción

COLDWELL BANKER  (#cb)
├── Badge + título + subtítulo
├── Infografía: 100+ años / 40+ países / Logo CB / Tu Casa +Cerca
└── 3 cards de beneficios

PROPIEDADES CB  (#propiedades)
├── Filtros (zona, tipo, precio)
├── Botón "Ver propiedades en Coldwell Banker Argentina"
└── Preview cards con fotos de propiedades demo

TESTIMONIOS  (#testimonios)
└── 3 cards con estrellas + texto + autor

TASAS Y CFT  (#tasas)
├── Tabla "Cuotas por Plazo"
└── Tabla "CFT - Costo Financiero Total"

FAQ  (#faq)
└── Lista de preguntas frecuentes con acordeón

CTA FINAL
└── Banner azul con botón "Empezar simulación"

FOOTER
├── 4 columnas: Producto / Empresa / Legal / Contacto
└── Línea inferior con copyright
```

---

## Anchors (links internos del navbar)

| Texto del nav | Link |
|---------------|------|
| Cómo funciona | `#como` |
| Coldwell Banker | `#cb` |
| Propiedades | `#propiedades` |
| Testimonios | `#testimonios` |
| Preguntas | `#faq` |
| Ingresar (botón) | `https://app.tucasamascerca.com.ar/login` (placeholder hasta que esté la app) |

---

## Modales / Pop-ups

| Modal | Trigger | Contenido |
|-------|---------|-----------|
| Lead capture | Click en "Contactar asesor" del hero | Form con nombre, email, teléfono + resumen de simulación |
| (Eliminados) | — | Backoffice config (ya migrado a la app) |

---

## URLs externas a las que enlaza el sitio

| Sección | URL destino |
|---------|-------------|
| Botón "Ver propiedades en CB Argentina" | `https://www.coldwellbanker.com.ar/propiedades?suitable_for_credit=1&zona=...&tipo=...&precio_hasta=...` |
| Botón "Ingresar" (cuando la app esté) | `https://app.tucasamascerca.com.ar/login?propertyValue=X&loanAmount=Y&months=Z` |

---

## Vistas responsive

| Breakpoint | Comportamiento clave |
|------------|---------------------|
| Desktop (>1024px) | Layout completo: hero 2 columnas, grids de 3-5 columnas, foto pareja visible |
| Tablet (768-1024px) | Grids colapsan a 2 columnas, calculator-box reducido |
| Mobile (<768px) | Todo a 1 columna, nav cambia a hamburger menu, foto pareja OCULTA |
| Mobile chico (<520px) | Padding reducido, font-sizes recalculados con clamp() |
