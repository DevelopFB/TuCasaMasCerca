# Instructivo TCMC — Tu Casa +Cerca

Esta carpeta contiene toda la documentacion necesaria tanto para el uso de la plataforma como para el desarrollador que vaya a implementarla en produccion.

## Contenido

| Archivo | Para quien | Proposito |
|---------|-----------|-----------|
| `01-Instructivo-Formulario.md` | Pancho / Admin de la plataforma | Como editar el formulario de solicitud de credito (paso a paso, sin tocar codigo) |
| `02-Brief-Desarrollador-WEB.md` | Desarrollador | Especificacion completa para la landing page (sitio publico) |
| `03-Brief-Desarrollador-APP.md` | Desarrollador | Especificacion completa para la aplicacion (backoffice + portal cliente) |

## Como entregar al desarrollador

1. **Darle acceso al repo:** https://github.com/DevelopFB/TuCasaMasCerca
2. Indicarle que lea **en este orden:**
   - `Instructivo/02-Brief-Desarrollador-WEB.md` (si contratas solo landing)
   - `Instructivo/03-Brief-Desarrollador-APP.md` (si contratas la app)
   - `TCMC-Spec-Desarrollador.md` (referencia tecnica completa)
3. El **mockup visual** esta en `index.html` — abrirlo en un navegador muestra exactamente como debe quedar.
4. La carpeta `APP/` tiene docs tecnicos previos y una version standalone de referencia.

## Mentalidad de entrega

El objetivo es que el desarrollador **copie/porte lo que ya existe**, no que disene desde cero. Todo el trabajo de UX, algoritmos financieros, flujos, roles y copy ya esta hecho. Solo falta:

1. Dividir `index.html` en componentes React modulares
2. Reemplazar mock data por conexion a base de datos via API
3. Implementar autenticacion real (JWT)
4. Implementar uploads a storage externo (S3 / Supabase Storage)
5. Implementar los triggers de email (SendGrid / Resend)
6. Deploy

**Estimacion total realista:** 80-120 horas de desarrollo profesional para el MVP productivo.
