# Opción A — MVP con Airtable + Softr

Plan completo para armar el backoffice + portal cliente de Tu Casa +Cerca usando herramientas no-code, como alternativa al desarrollo custom de USD 27.900.

**Inversión estimada año 1:** USD 1.200-1.700
**Tiempo de implementación:** 4 semanas (2 fines de semana + ajustes)
**Mantenimiento:** ~USD 100/mes recurrente

---

## Por qué esta opción

Tu volumen actual (~100 operaciones/año) NO justifica una plataforma custom de USD 27k. Esta opción te permite:
- ✅ Validar el negocio con CAC bajo
- ✅ Iterar rápido sin esperar 12 semanas de dev
- ✅ Tener DB exportable a Excel + repositorio de docs por legajo
- ✅ Backup automático nativo
- ✅ Login con roles (cliente, asesor, admin)
- ✅ Migrar a custom cuando crezcas (sin penalty: los datos viven en Airtable, exportables siempre)

---

## Cómo usar esta carpeta

| Archivo | Para qué sirve |
|---------|----------------|
| **00-README.md** | Este archivo: índice y orden de lectura |
| **01-Plan-General.md** *(o .docx)* | Resumen ejecutivo: qué se construye, costos, plazos, decisiones |
| **02-Airtable-Schema.md** | Diseño de la base de datos: tablas, campos, vistas, automatizaciones |
| **03-Softr-Layout.md** | Diseño de la app: páginas, formularios, permisos por rol |
| **04-Plan-Operativo-Semanal.md** | Paso a paso día por día durante las 4 semanas |
| **05-Brief-Freelance-Airtable.docx** | Aviso para postear en Workana/Upwork (~USD 400-700) |
| **06-Camino-1-DIY-Completo** *(md + docx)* | **Tutorial completo para hacerlo vos mismo** sin freelance. 37 horas, paso a paso con clicks específicos. |
| **07-Camino-2-Hibrido** *(md + docx)* | **División de tareas vos + freelance** para acelerar. 12-15 hs tuyas + 12-15 hs freelance. |

---

## Flujo recomendado

1. **Hoy:** Leé `01-Plan-General` y aprobá el alcance/costos
2. **Esta semana:** Crear cuentas Airtable + Softr (gratis para probar)
3. **Elegí tu camino:**
   - **Camino 1 — DIY completo (37 hs tuyas):** Seguí `06-Camino-1-DIY-Completo`. Ahorrás USD 500-700, tardás 4-5 fines de semana.
   - **Camino 2 — Híbrido (12-15 hs tuyas + freelance):** Seguí `07-Camino-2-Hibrido`. Inversión extra USD 500-700, te ahorra ~25 horas de trabajo, terminás en 3-4 semanas.

> **Tip pragmático:** Postea el aviso del freelance HOY (Camino 2) Y empezá vos en paralelo el Camino 1. Si en 10 días aparece un buen freelance, le pasás lo que llevás hecho. Si no, seguís vos. Win-win.

---

## Decisiones que tomar antes de arrancar

- [ ] **¿Vas con Airtable + Softr o querés evaluar alternativas?** (Glide, Stacker, Noloco). Mi recomendación es Airtable+Softr por madurez y precio.
- [ ] **¿Dominio app:** `app.tucasamascerca.com.ar` o subdominio Softr (`tucasamascerca.softr.app`) para empezar?
- [ ] **¿Querés cargar manualmente los primeros 5-10 legajos** mientras la web pública aún no captura leads?
- [ ] **¿Quién más va a tener acceso editor a Airtable?** (solo vos por ahora, o sumás 1-2 personas)
