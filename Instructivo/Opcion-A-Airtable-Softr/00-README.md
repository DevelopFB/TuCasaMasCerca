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
| **05-Brief-Freelance-Airtable.docx** | Si decidís contratar 8-15 hs de un experto para acelerar |

---

## Flujo recomendado

1. **Hoy:** Leé `01-Plan-General` y aprobá el alcance/costos
2. **Esta semana:** Crear cuentas Airtable + Softr (gratis para probar)
3. **Próximos 2 fines de semana:** Seguir `04-Plan-Operativo-Semanal`
4. **Si te trabás:** Contratar 8-15 hs de freelance con `05-Brief-Freelance-Airtable`

---

## Decisiones que tomar antes de arrancar

- [ ] **¿Vas con Airtable + Softr o querés evaluar alternativas?** (Glide, Stacker, Noloco). Mi recomendación es Airtable+Softr por madurez y precio.
- [ ] **¿Dominio app:** `app.tucasamascerca.com.ar` o subdominio Softr (`tucasamascerca.softr.app`) para empezar?
- [ ] **¿Querés cargar manualmente los primeros 5-10 legajos** mientras la web pública aún no captura leads?
- [ ] **¿Quién más va a tener acceso editor a Airtable?** (solo vos por ahora, o sumás 1-2 personas)
