# Tu Casa +Cerca — Paquete para Seis Elementos

**Para:** Santiago — Seis Elementos
**De:** Pancho Benegas — Tu Casa +Cerca (TCMC)
**Fecha:** 27/05/2026

---

## Qué hay en esta carpeta

Esta carpeta contiene todo el material necesario para que puedas cotizar y avanzar con el diseño y maquetado de la **landing institucional pública** de Tu Casa +Cerca.

> **Importante:** ya tenemos la estructura HTML armada (ver `03-Estructura-HTML/`). Tu trabajo se concentra en **diseño visual + capa CSS + assets + responsive + deploy** sobre esa base, no en programar HTML desde cero.

---

## Contenido

### `01-Brief/`
Documento maestro con el alcance completo, modelo de trabajo, sitemap, integraciones, entregables y aclaraciones para la cotización.

- `Brief_Landing_TCMC_SeisElementos.docx`

**Empezar por acá.** Si tenés que leer un solo archivo, es este.

---

### `02-Brandbook/`
Manual de marca V2 de Tu Casa +Cerca: logo, paleta de colores, tipografías, tonos, lineamientos visuales.

- `TCNCERCA-BRANDBOOK-V2.pdf`

Este es el input de identidad visual. La landing debe respetarlo. Si propusieras evolucionar la identidad (no aplicarla), eso es trabajo adicional a cotizar aparte.

---

### `03-Estructura-HTML/`
**Lo que ya tenemos armado.** Es la estructura HTML semántica de la landing, con las secciones organizadas, design tokens declarados y CSS base. Esto es lo que recibís como input para diseñar/maquetar encima.

- `index.html` → archivo único con la estructura completa
- `assets/` → imágenes que usa la landing (fotos, casos, logos, fondo)

**Cómo verlo:** abrí `index.html` con doble clic en cualquier navegador. Vas a ver la landing tal como está hoy. Las secciones ya están en el orden definido del sitemap; los design tokens (variables CSS de colores, tipografía, espaciados) están alineados al brandbook.

**Tu alcance sobre este archivo:**
- Mantener la estructura semántica (no rehacer HTML desde cero).
- Aplicar diseño visual definitivo (mockups Figma → CSS).
- Optimizar / reemplazar assets.
- Responsive tuning (mobile, tablet, desktop).
- Microinteracciones / animaciones donde aporten.
- Deploy final en DonWeb vía FTP.

---

### `04-Referencias/`
Material complementario para entender el producto y el universo gráfico.

- `TCMC-Presentación.pdf` → presentación ejecutiva del producto, propuesta de valor, casos de uso. Útil para entender el "porqué" del proyecto antes de diseñar.

---

## Stack técnico declarado

| Item | Valor |
|---|---|
| Hosting | DonWeb plan compartido Linux (cPanel) |
| Deploy | FTP |
| HTML | Provisto por el cliente (no rehacer) |
| CSS | A definir entre las partes (recomendado: mantener vanilla CSS con design tokens existentes, o migrar a Tailwind si preferís) |
| JS | Plano, sin framework |
| Backend | Sin backend propio. Formulario vía PHP simple o servicio externo (Formspree / Web3Forms) |
| Idioma | Castellano |

---

## Próximos pasos sugeridos

1. **Leer el brief** (`01-Brief/`).
2. **Abrir la landing actual** (`03-Estructura-HTML/index.html`) en el navegador para ver el punto de partida.
3. **Revisar el brandbook** (`02-Brandbook/`).
4. **Enviar cotización actualizada** considerando que NO incluye programación estructural HTML/JS desde cero.
5. **Aclarar dudas** antes de cerrar precio y plazo.

---

## Contacto

Pancho Benegas — panchobenegas@gmail.com

Cualquier consulta antes de cotizar, mejor preguntar que asumir.
