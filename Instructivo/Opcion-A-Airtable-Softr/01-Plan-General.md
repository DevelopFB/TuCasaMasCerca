# Plan General — Opción A: Airtable + Softr

## Resumen ejecutivo

Reemplazar la propuesta de USD 27.900 de Espin Labs por un MVP no-code que cubre el 80% de la funcionalidad operativa real, con USD 1.200/año de operación y armado en 4 semanas.

---

## Qué se construye

### Backend / Base de datos
**Plataforma: Airtable**
- 9 tablas relacionadas (Profiles, Legajos, Documentos, Cuotas, Pagos, Leads, etc.)
- Vistas filtradas por rol y por etapa
- Automatizaciones (enviar email al cambiar estado, notificar al asesor cuando se sube un doc, etc.)
- Export nativo a CSV/Excel
- Backup automático diario (snapshots)
- Adjuntos: cada legajo tiene su carpeta virtual con DNI, comprobantes, escritura, hipoteca

### Frontend / Portal y backoffice
**Plataforma: Softr**
- Login con roles (Cliente / Asesor / Admin)
- **Portal Cliente:** Mi solicitud, Mis pagos, Subir documentos, Soporte
- **Portal Asesor:** Mis legajos asignados, Pipeline, Cargar observaciones
- **Portal Admin:** Todos los legajos, Cobranzas, Reportes, ABM usuarios, Leads del simulador
- Notificaciones por email automáticas
- Branding parcial (logo, colores, tipografía Outfit)

### Landing pública (separada)
**Plataforma: Framer** (ya planificado en Kit-Portado-Landing)
- Simulador + captura de leads → escribe directo en Airtable vía Webhook

---

## Stack completo año 1

| Componente | Herramienta | Plan | USD/mes |
|------------|-------------|------|---------|
| Base de datos + automatizaciones | Airtable | **Team** | 20 |
| Frontend backoffice + portal | Softr | **Professional** | 49 |
| Landing pública | Framer | Pro | 30 |
| Emails transaccionales | Resend | Free (hasta 3k/mes) | 0 |
| Storage docs adicional (opcional) | Google Drive / Cloudinary | Free tier | 0 |
| Backup mensual a Excel | Script Airtable (Make/Zapier free) | Free | 0 |
| Dominio principal | Nic.ar | .com.ar | 0,25 |
| **TOTAL MENSUAL** | | | **~100** |
| **TOTAL ANUAL** | | | **~1.200** |

### Costos one-shot (opcionales)
- Freelance Airtable expert para acelerar setup (8-15 hs): USD 200-500
- Diseñador para customizar Softr branding más allá del default: USD 150-300

**Inversión total año 1 (con todo el freelance):** USD 1.700-2.000

---

## Comparativo con Espin Labs

| Concepto | Espin Labs | Opción A | Ahorro |
|----------|-----------|----------|--------|
| Desarrollo inicial | 22.500 | 0-500 | 22.000+ |
| Mantenimiento año 1 (3 meses) | 5.400 | 1.200 | 4.200 |
| **Total año 1** | **27.900** | **~1.500** | **~26.400** |
| Año 2 (solo mantenimiento) | 7.200 | 1.200 | 6.000 |
| Año 3 | 7.200 | 1.200 | 6.000 |
| **Total 3 años** | **42.300** | **3.900** | **38.400** |

---

## Qué hace la Opción A vs qué NO hace

### ✅ Sí hace (igual o mejor que custom)
- Gestión de legajos completa (CRUD, estados, asignación a asesor)
- Portal cliente para ver su solicitud y subir documentos
- Backoffice multirol con permisos por rol
- Workflow operativo (Solicitud → Scoring → Pre-aprobación → ... → Finalizado)
- Repositorio de documentos por legajo (DNI, comprobantes, escritura)
- Cronograma de pagos automático
- Notificaciones por email
- Reportes básicos exportables (Excel/CSV/PDF)
- Captura de leads del simulador
- Backup automático diario
- Auditoría de cambios (Airtable graba quién cambió qué)

### ❌ No hace (o limitaciones)
- Branding 100% custom de la app interna (Softr tiene plantillas; podés cambiar colores/logo/fuente pero la estructura es de Softr)
- App móvil nativa (es web responsive)
- Notificaciones push en tiempo real (solo email)
- Integraciones complejas con APIs externas (CB API, MetaMap) — esto requiere Zapier/Make pago si lo necesitás
- Firma digital embebida (cliente sube PDF firmado)
- Pagos online (cobranza es por mail/transferencia, la app solo registra)
- BI avanzado (para eso conectás Airtable → Google Sheets → Looker Studio, todo free)

---

## Cómo te protegés de "voltear la web" o copia

### Para la landing pública (Framer)
- Framer tiene HTTPS, CDN global, anti-DDoS nativo
- El código JS del simulador no es secreto: cualquiera puede copiarlo de cualquier landing similar. **Lo diferencial es el producto financiero y la red CB**, no el frontend.
- Tu simulador devuelve cuotas. Si un competidor lo replica visualmente, igual no tiene tu tasa, tu producto, ni tu canal de distribución.

### Para la app interna (Softr + Airtable)
- Acceso solo con email registrado y aprobado por admin
- Roles estrictos: cliente solo ve su legajo, asesor solo los asignados, admin todo
- Airtable tiene 2FA obligatorio para editores
- Softr permite IP whitelist (limitar acceso solo desde IPs argentinas o de oficinas CB)
- Auditoría: cada cambio queda registrado con timestamp + usuario
- Backup diario automático
- Compliance: GDPR-compliant ambos servicios (datos en servidores certificados SOC 2)

### Riesgo real
A tu escala (100 op/año, pocos clientes simultáneos) **no sos target de atacantes serios**. El riesgo más alto es:
- Empleado interno mal intencionado → mitigás con auditoría + roles estrictos
- Competidor que copia features visuales → no podés evitarlo (es web pública), pero no afecta tu negocio

---

## Roadmap de migración

Si crecés mucho, esta es la ruta natural de evolución:

```
HOY (100 op/año)
├── Landing: Framer
├── App: Softr + Airtable
└── Costo: USD 100/mes

AÑO 1-2 (300-500 op/año)
├── Landing: Framer (sin cambios)
├── App: Migrar Airtable → Supabase (DB profesional)
│        Mantener Softr como frontend (conecta a Supabase via API)
└── Costo: USD 150-200/mes

AÑO 2-3 (1.000+ op/año, ronda inversión)
├── Landing: Framer o Next.js custom
├── App: Frontend custom (Next.js) + Supabase
│        Contratar dev in-house o agencia
└── Costo: USD 300-500/mes + USD 30-50k dev one-shot
```

**Lo importante:** los datos en Airtable son exportables. Migrar a Supabase es ~20 horas de dev. **No quedás encerrado en la herramienta.**

---

## Decisión final

### Recomendación
**Arrancar con Opción A.** Validar el negocio 6-12 meses. Si crecés, migrás. Si no funciona el producto, perdiste USD 1.200 en lugar de USD 27.900.

### Cuándo NO te conviene Opción A
- Si ya tenés cerrado un acuerdo con un inversor que exige plataforma custom
- Si vas a procesar >300 operaciones/año desde el primer trimestre
- Si necesitás integraciones con APIs financieras críticas desde el lanzamiento
- Si tu equipo no tiene NADIE que pueda mantener Airtable (pero es muy fácil, no es excusa real)

---

## Próximos pasos si aprobás

1. **Hoy:** Crear cuenta Airtable + Softr (gratis para probar)
2. **Mañana:** Importar el schema de `02-Airtable-Schema.md`
3. **Esta semana:** Cargar 5-10 legajos de prueba con datos reales
4. **Próxima semana:** Configurar Softr con `03-Softr-Layout.md`
5. **Semana 3:** Automatizaciones + emails + testing
6. **Semana 4:** Onboarding a Marketing + go-live con primeros clientes reales

Detalle día-por-día en `04-Plan-Operativo-Semanal.md`.
