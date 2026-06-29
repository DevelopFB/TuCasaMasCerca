# Camino 2 — Híbrido (vos + freelance)

Vos te encargás de las tareas más simples y de coordinar. El freelance hace lo más técnico. Costo total: USD 1.700-2.000 año 1 (USD 1.200 suscripciones + USD 500-800 freelance).

**Tiempo tuyo:** ~12-15 horas (vs 37 en Camino 1).
**Tiempo freelance:** 12-15 horas.
**Plazo total:** 3-4 semanas calendario.

---

## 🎯 Por qué este camino

Si tenés tiempo justo, no querés tocar mucha técnica, o querés acelerar el go-live, este camino es ideal. La división juega a tu favor:

- **Vos hacés** lo que necesita conocimiento del negocio (cargar datos reales, decidir flujos, testear como usuario, onboarding equipo).
- **Freelance hace** lo que necesita expertise técnica (fórmulas Airtable, scripts, automatizaciones, Softr permisos avanzados).

---

## 📋 División de tareas

### TAREAS TUYAS (12-15 horas)

#### Semana 1 — Setup y datos (vos solo, 5 horas)
1. Crear cuentas Airtable + Softr + Resend (30 min)
2. Cargar los datos iniciales en Airtable cuando el freelance termine las tablas:
   - 3 oficinas (15 min)
   - Tu usuario super_admin y de Marketing (10 min)
   - 2-3 asesores reales (15 min)
   - 5 legajos de prueba con datos reales (45 min)
3. Aprobar el schema y ajustes de campos que proponga el freelance (1 hora)
4. Comprar dominio `app.tucasamascerca.com.ar` en Nic.ar (30 min)

#### Semana 3 — Branding y customización (vos solo, 3 horas)
5. Subir logo, favicon, OG image al Softr (30 min)
6. Cargar copies/textos en cada página (1 hora)
7. Crear templates de email en Resend con tu copy (1 hora)
8. Revisar la app como cliente y como asesor → anotar feedback estético (30 min)

#### Semana 4 — Testing y go-live (vos solo, 4-5 horas)
9. Testing end-to-end (loguearte como cada rol, simular flujo completo) (2 horas)
10. Crear cuentas reales para el equipo de asesores (30 min)
11. Sesión de onboarding con cada asesor (30 min × 3 = 1.5 horas)
12. Validar dominio + SSL post-deploy del freelance (15 min)
13. Aprobar entregable final y pago (15 min)

### TAREAS DEL FREELANCE (12-15 horas)

#### Semana 1 — Setup técnico (5-6 horas)
- Configurar las 9 tablas en Airtable con todos los campos y fórmulas
- Crear las Linked Records y Lookups
- Configurar las Vistas (Pipeline, Por asesor, Cobranzas, etc.)
- Entregable: video screencast de 5 min mostrando la base armada

#### Semana 2 — Frontend Softr (6-7 horas)
- Conectar Softr a Airtable
- Crear User Groups (Clientes / Asesores / Admins)
- Armar las páginas de Portal Cliente (5 páginas)
- Armar las páginas de Portal Asesor (4 páginas)
- Armar las páginas de Backoffice Admin (10 páginas)
- Configurar permisos a nivel registro (filters)
- Entregable: URL de staging accesible para probar

#### Semana 3 — Automatizaciones (3-4 horas)
- Configurar las 5 Automations de Airtable
- Conectar Resend para emails con dominio
- Generar cuotas automáticamente al pasar a Finalizado (script)
- Cron diario para cuotas por vencer
- Entregable: video mostrando los emails que llegan

#### Semana 4 — Deploy y handoff (1-2 horas)
- Configurar dominio custom en Softr
- Activar SSL
- Sesión de handoff con vos: 1 hora explicando todo
- Documentación breve de cualquier customización hecha

---

## 🤝 Cómo coordinar con el freelance

### Antes de contratar

1. **Postear el aviso usando `05-Brief-Freelance-Airtable.docx`**
2. Plataformas para postear:
   - [Workana](https://www.workana.com) — freelancers argentinos / LATAM
   - [Upwork](https://www.upwork.com) — global, hay muchos Airtable experts
   - [Fiverr](https://www.fiverr.com) — busca "Airtable + Softr setup"
   - [LinkedIn](https://www.linkedin.com/jobs) — postear como job, hay consultores
   - **Bonus:** Airtable Community Hire-a-Pro: https://airtable.com/marketplace/find-an-expert

### Cómo evaluar candidatos (preguntar a 3 antes de elegir)

Preguntas clave en la entrevista (Zoom 15 min):
1. "Mostrame 1-2 casos previos donde armaste algo similar con Airtable + Softr"
2. "¿Cuántas horas vas a tardar para el alcance del brief?"
3. "¿Cobrás monto fijo o por hora?" → preferir **fijo** (menos sorpresas)
4. "¿Cómo me vas a entregar avances?" → preferir entregas semanales con screencast
5. "Si encuentro un bug post-entrega, ¿cómo se resuelve?" → debería tener 1-2 semanas de garantía incluidas

### Tarifas de referencia

| Origen | Tarifa hora promedio | Total proyecto (12-15 hs) |
|--------|----------------------|---------------------------|
| Argentina (Workana) | USD 25-40 | USD 300-600 |
| LATAM (Upwork) | USD 30-50 | USD 400-750 |
| EEUU/Europa (Upwork) | USD 60-100 | USD 800-1.500 |
| Fiverr (paquetes) | — | USD 200-500 |

**Recomendación:** Workana o Fiverr con freelancer argentino. **Presupuesto objetivo: USD 400-700.**

### Forma de pago

- **50% al kick-off** (después de aprobar el schema final en Airtable)
- **50% al go-live** (todos los criterios de aceptación cumplidos)

NO pagues 100% por adelantado. Workana tiene escrow (depósito en garantía) — usalo.

---

## 📅 Cronograma combinado

| Semana | Vos | Freelance | Entregable conjunto |
|--------|-----|-----------|---------------------|
| **1** | Crear cuentas, recibir schema | Setup Airtable: tablas, fórmulas, vistas | Base TCMC funcional con 5 legajos de prueba |
| **2** | (Esperás, revisás avances) | Construir Softr: páginas + permisos | Staging URL navegable por los 3 roles |
| **3** | Branding, copies, templates email | Automations + integración Resend | App con emails enviándose |
| **4** | Testing, dominio, onboarding equipo | Deploy final + handoff de 1 hora | App en producción con dominio propio |

---

## 🚦 Plan B — Si no encontrás freelance

**Pasás al Camino 1 (`06-Camino-1-DIY-Completo.md`).** No es drama. Tarda más (37 hs en vez de 12-15), pero está todo documentado paso a paso.

### Cómo decidir cuándo "rendirte" con el freelance

| Intentos | Acción |
|----------|--------|
| Día 1-3: posteaste el aviso, recibís postulaciones | ✅ Seguí buscando |
| Día 4-7: postulaciones bajas o malas | ⚠️ Considera subir presupuesto USD 100-200 |
| Día 8-10: nadie de calidad | 🔄 Pasá al Camino 1 |
| Día 14: aún no encontraste | 🛑 Definitivamente al Camino 1 |

### Híbrido inverso (Plan C)

Si no encontrás freelance senior pero sí uno junior baratito (USD 200):
- **Vos hacés** Airtable (Semana 1 del Camino 1, ~11 horas)
- **Freelance junior hace solo Softr** (lo más visual) según `03-Softr-Layout.md`
- **Vos** las automations y testing

Costo total ~USD 1.400-1.600.

---

## 📞 Cómo arrancar HOY mismo

### Paso 1 (15 min): Postear el aviso
1. Abrir Workana → https://www.workana.com
2. Crear cuenta (gratis)
3. Click "Publicar un proyecto"
4. Categoría: Programación → Otros
5. Título: `Setup Airtable + Softr para webapp de gestión fintech (12-15hs)`
6. Descripción: copiar de `05-Brief-Freelance-Airtable.docx`
7. Presupuesto: USD 400-700 (rango)
8. Plazo: 7-10 días
9. Publicar

### Paso 2 (en paralelo, 1 hora): Empezar Camino 1 sesión 1A
No esperes pasivo. Mientras llegan postulaciones, vos:
- Creá las cuentas Airtable + Softr (30 min)
- Empezá a crear la primera tabla **Profiles** siguiendo el Camino 1 (30 min)

Si conseguís freelance bueno, le pasás lo que llevás hecho.
Si no, seguís vos solo.

### Paso 3 (días 3-7): Filtrar postulaciones
- Pedí ejemplos previos de trabajo
- Entrevistas cortas con 2-3 candidatos
- Elegir uno con mejor relación calidad/precio

### Paso 4: Kick-off
- Reunión Zoom 30 min para alinear alcance
- Pago del 50%
- Compartir kit completo (`02-Airtable-Schema.md`, `03-Softr-Layout.md`, `04-Plan-Operativo-Semanal.md`)
- Compartir branding (logo, paleta, brandbook)
- Acordar checkpoints semanales

---

## ✅ Criterios de aceptación (qué tiene que entregar el freelance)

Para pagar el segundo 50%:

- [ ] Las 9 tablas en Airtable con todos los campos del schema funcionando
- [ ] Las 5 fórmulas calculadas correctamente (LTV %, cuota PMT, días atraso, estado de pago, ID público)
- [ ] Las 5 automations enviando emails reales (probadas con tu cuenta)
- [ ] Softr conectado y mostrando datos en tiempo real
- [ ] Los 3 roles funcionan con permisos correctos:
  - Cliente loguea y ve SOLO su legajo
  - Asesor loguea y ve SOLO sus asignados
  - Admin loguea y ve todo
- [ ] Form de upload de docs guarda en Airtable Attachment
- [ ] Export CSV/Excel funciona desde cualquier vista
- [ ] Branding aplicado (logo, colores, font Outfit)
- [ ] Dominio `app.tucasamascerca.com.ar` apuntado con SSL
- [ ] Sesión de 1 hora de handoff completada
- [ ] Documentación breve (1-2 páginas) de cualquier customización

---

## 💰 Resumen económico Camino 2

| Concepto | Costo |
|----------|-------|
| Freelance (12-15 hs × USD ~40) | 500-700 |
| Airtable Team (12 meses) | 240 |
| Softr Pro (12 meses) | 588 |
| Framer Pro (12 meses, landing) | 360 |
| Dominio Nic.ar (.com.ar) | 3 |
| Resend (free) | 0 |
| **Total año 1** | **~USD 1.700** |
| Año 2 (solo suscripciones) | USD 1.200 |

vs Espin Labs **USD 27.900 año 1 + USD 7.200 año 2**.

**Ahorro 3 años: ~USD 38.000.**

---

## 🤔 Mi recomendación

**Hacé el "Paso 1+2" hoy mismo:** postear el aviso en Workana Y empezar Semana 1 del Camino 1 en paralelo.

- Si en 10 días aparece un freelance bueno → seguís Camino 2 con lo que ya hiciste.
- Si no aparece → seguís Camino 1 (ya tenés Airtable empezado).

Lo peor que puede pasar es que avances tu propio aprendizaje de Airtable mientras esperás. Win-win.

¿Dale? Si necesitás, te armo el texto exacto del aviso de Workana en 5 minutos.
