# Kit de Portado — Landing Tu Casa +Cerca

Carpeta lista para entregar a un freelance (diseñador Figma + desarrollador Webflow/Framer) para que reconstruya la landing actual en una plataforma con editor visual.

---

## Cómo usar este kit

### 1. Entregale al freelance todo este folder + estos 2 enlaces externos:
- **Mockup vivo (referencia visual):** https://developfb.github.io/TuCasaMasCerca/
- **Repo con código fuente:** https://github.com/DevelopFB/TuCasaMasCerca

### 2. Orden de lectura sugerido:
1. **`07-Brief-Freelance.docx`** — empieza acá: contexto, alcance, entregables esperados, condiciones
2. **`01-Sitemap.md`** — todas las secciones de la landing en orden
3. **`02-Componentes-Specs.md`** — dimensiones, layouts, comportamiento responsive de cada módulo
4. **`03-Copy.docx`** — todos los textos exactos, listos para copy-paste
5. **`04-Design-Tokens.json`** — paleta, tipografías, espacios (importable a Figma con plugin Tokens Studio)
6. **`05-Custom-Code-Simulator.html`** — bloque de código del simulador, listo para pegar en Webflow/Framer como Embed
7. **`06-Assets/`** — todas las imágenes optimizadas

---

## Cosas que NO está en este kit (que tenés que coordinar aparte)

- **Dominio:** todavía no compraste. Webflow/Framer te dan staging URL gratis (`tucasamascerca.webflow.io`). Comprá el dominio cuando todo esté aprobado.
- **Plan pago de Webflow/Framer:** podés trabajar en plan gratis hasta que quieras publicar con dominio propio.
- **Credenciales de Coldwell Banker:** si la integración con su buscador requiere alguna API o token, eso es separado.

---

## Flujo recomendado de trabajo con el freelance

| Etapa | Quién | Entregable | Tiempo |
|-------|-------|------------|--------|
| 1. Setup | Freelance | Cuenta Webflow/Framer + invita a Pancho | 1 hs |
| 2. Diseño Figma | Freelance | Archivo Figma con todas las secciones | 6-10 hs |
| 3. Review Figma | Pancho | Aprobación o ajustes | 1 hs |
| 4. Build Webflow/Framer | Freelance | Sitio armado en staging URL | 10-15 hs |
| 5. Custom code simulador | Freelance | Simulador funcionando dentro del sitio | 2-3 hs |
| 6. Responsive QA | Freelance | Sitio probado en 360px / 768px / 1440px | 2 hs |
| 7. Handoff a Marketing | Freelance + Pancho | Sesión 30 min explicando cómo editar | 0.5 hs |
| **Total** | | | **~25-35 hs** |

**Presupuesto orientativo:** USD 600-1.200 (depende seniority y país del freelance).

---

## Después del primer launch

Cuando la landing esté online en su dominio:
1. El equipo de Marketing entra con su usuario y empieza a editar/optimizar
2. Si necesita ayuda, contrata al mismo freelance por horas sueltas
3. Cuando el dev de la APP productiva termine su parte, se integra el handoff (botón Ingresar pasa al login real)
