# Instructivo — Editor de Formulario de Crédito

Este documento explica cómo editar el formulario que completan los clientes cuando solicitan un crédito, **sin necesidad de tocar código**.

---

## 1. ¿Dónde encuentro el editor?

1. Ingresá a la plataforma con tu usuario **Super Admin**
2. En el menú lateral izquierdo, hacé clic en **"ABM Formulario"** (ícono de documento 📄)
3. Se abre el editor con los 4 pasos actuales ya cargados

> **Importante:** Solo el rol Super Admin tiene acceso a este módulo.

---

## 2. Estructura del formulario

El formulario tiene dos niveles:

- **Pasos** (grandes secciones): ejemplo, "Verificación de Identidad", "Datos del Crédito"
- **Preguntas** (dentro de cada paso): ejemplo, "DNI Frente", "Monto del crédito"

El cliente ve el formulario **paso a paso**, con botones "Siguiente" entre cada uno.

---

## 3. Operaciones sobre un PASO

Cada paso aparece como una tarjeta plegable en el editor. En el encabezado de cada paso tenés estos botones:

| Botón | Qué hace |
|-------|----------|
| **Número circular** | Click para expandir/contraer el paso |
| **Texto del título** | Click sobre el título para editarlo in-line |
| **↑ ↓** | Mueve el paso hacia arriba o abajo |
| **👁️ / 🚫** | Oculta o muestra el paso (NO lo elimina) |
| **✕** | Elimina el paso (pide confirmación) |
| **⌃ ⌄** | Expande/contrae el paso |

### 3.1 Agregar un paso nuevo

Al final del listado hay un botón grande **"+ Agregar paso nuevo"**. Se crea con título "Nuevo paso" — hacé click en el título para renombrarlo.

### 3.2 Ocultar un paso (útil para pausar sin perder config)

Click en el ícono de ojo. El paso queda en gris con etiqueta "OCULTO" y el cliente no lo ve. Podés volver a activarlo cuando quieras.

---

## 4. Operaciones sobre una PREGUNTA

Dentro de un paso expandido, cada pregunta aparece como una fila. Al hacer click en la pregunta se abre el panel de edición.

### 4.1 Campos de una pregunta

| Campo | Descripción |
|-------|-------------|
| **Texto de la pregunta** | Lo que lee el cliente. Ejemplo: "¿Cuál es tu ingreso mensual?" |
| **Tipo de respuesta** | Ver tabla en sección 5 |
| **ID interno** | Identificador único usado por el sistema. No debe tener espacios ni acentos. Ejemplo: `ingresoMensual` |
| **Placeholder / Texto de ayuda** | Texto gris que aparece dentro del campo o debajo |
| **Opciones** | Solo si el tipo es "Desplegable". Una opción por línea |
| **Mostrar solo si (dependencia)** | ID de otra pregunta Sí/No que debe estar activada. Ver sección 6 |
| **Requerida** | El cliente no puede avanzar sin responder |
| **Ocultar al cliente** | Quita la pregunta del formulario sin eliminarla |

### 4.2 Acciones rápidas en la fila (sin abrir el editor)

| Ícono | Acción |
|-------|--------|
| ↑ ↓ | Reordenar la pregunta dentro del paso |
| 👁️ | Ocultar / mostrar |
| ✕ | Eliminar (con confirmación) |

### 4.3 Agregar pregunta

Al final de cada paso hay un botón **"+ Agregar pregunta"**. Se crea con placeholder "Nueva pregunta" — click para editarla.

---

## 5. Tipos de respuesta disponibles

| Tipo | Cuándo usarlo | Ejemplo |
|------|---------------|---------|
| **Texto corto** | Respuestas cortas de 1 línea | Nombre, dirección, código |
| **Texto largo** | Respuestas de varias líneas | Comentarios, observaciones |
| **Número** | Valores numéricos | Monto en USD, cantidad de hijos |
| **URL** | Links web | Link de propiedad Coldwell Banker |
| **Fecha** | Selector de fecha | Fecha de nacimiento, fecha tentativa de escritura |
| **Desplegable** | Elegir una opción de una lista cerrada | Plazo, asesor, tipo de vínculo |
| **Checkbox** | Casilla booleana (una sola) | Aceptación de términos |
| **Sí / No** | Switch booleano visible | ¿Tiene codeudor? |
| **Archivo** | Upload de PDF/imagen | DNI, comprobantes |
| **Info** | Texto informativo de solo lectura | Disclaimers, avisos |

---

## 6. Dependencias — Cómo funciona el "codeudor"

Las dependencias permiten que una pregunta **aparezca solo si** otra pregunta está activada. Esto evita formularios gigantes con campos innecesarios.

### 6.1 Caso real: codeudor

Queremos que las preguntas del codeudor (nombre, DNI, vínculo, etc.) aparezcan **solo si** el cliente dice que tiene codeudor.

**Paso 1 — La pregunta "padre" debe ser de tipo Sí/No**

En el paso "Ingresos y Codeudor" hay una pregunta así:

- Texto: "¿Agregar codeudor?"
- Tipo: **Sí / No**
- ID interno: `hasCodeudor`
- Requerida: No

**Paso 2 — Las preguntas "hijas" declaran su dependencia**

Cada pregunta del codeudor tiene el campo **"Mostrar solo si (dependencia)"** con el valor `hasCodeudor`:

| Pregunta | Campo "Mostrar solo si" |
|----------|-------------------------|
| Nombre del codeudor | `hasCodeudor` |
| Apellido del codeudor | `hasCodeudor` |
| DNI del codeudor | `hasCodeudor` |
| Vínculo con el codeudor | `hasCodeudor` |
| Ingresos anuales codeudor | `hasCodeudor` |
| Documentos del codeudor | `hasCodeudor` |

**Resultado:** cuando el cliente tilda "Sí" en "¿Agregar codeudor?", aparecen las 6 preguntas. Si destilda, se ocultan.

### 6.2 Cómo agregar una nueva dependencia

Supongamos que querés agregar una pregunta "¿Tiene trabajo en relación de dependencia?" y si dice que sí, preguntar por la empresa:

1. Creá la pregunta padre:
   - Texto: "¿Tiene trabajo en relación de dependencia?"
   - Tipo: **Sí / No**
   - ID interno: `tieneTrabajoDependencia` *(anotá este ID)*

2. Creá la pregunta hija:
   - Texto: "Nombre de la empresa"
   - Tipo: Texto corto
   - ID interno: `empresaTrabajo`
   - En **"Mostrar solo si"**: escribí `tieneTrabajoDependencia`

3. Guardá. La pregunta "Nombre de la empresa" solo aparece si el cliente activa "Sí".

### 6.3 Reglas importantes sobre dependencias

- La pregunta padre **debe** ser del tipo **Sí/No** (boolean).
- El ID en el campo "Mostrar solo si" debe coincidir **exactamente** con el ID interno de la pregunta padre (respeta mayúsculas).
- No anidamos: una pregunta hija no puede ser padre de otra (por ahora).
- Si ocultás la pregunta padre, las hijas tampoco aparecen.

---

## 7. Pedir documentación extra

Para agregar un nuevo documento que el cliente debe subir:

1. Abrí el paso donde corresponde (ej: "Verificación de Identidad" o "Ingresos y Codeudor")
2. Click en **"+ Agregar pregunta"**
3. Configurá:
   - Texto: "Constancia de CUIT"
   - Tipo: **Archivo (upload)**
   - ID interno: `constanciaCuit`
   - Placeholder: "PDF o imagen"
   - Requerida: Sí (si es obligatorio) o No (si es opcional)
4. Guardá

El cliente verá un cuadro de subida de archivos con tu nuevo label.

---

## 8. Guardar, deshacer, restaurar

### 8.1 Guardar cambios
- El botón **"Guardar cambios"** (arriba a la derecha) se activa cuando hay modificaciones.
- Al guardarlo, los cambios se aplican a las **nuevas solicitudes**. Las solicitudes ya iniciadas conservan el formulario con el que empezaron.

### 8.2 Restaurar por defecto
- El botón **"Restaurar por defecto"** vuelve al formulario original de fábrica (los 4 pasos que vinieron pre-cargados).
- Pide confirmación antes de reemplazar todo.

### 8.3 ¿Puedo deshacer?
- Mientras no hayas apretado "Guardar cambios", los cambios viven solo en tu pantalla. Recargá la página y se pierden (vuelve a lo último guardado).
- Después de guardar, en producción el sistema mantiene versionado (cada cambio queda registrado). Si querés volver a una versión anterior, pedíselo al desarrollador o restaurá por defecto.

---

## 9. Vista previa

Abajo de todos los pasos hay una sección **"Vista previa — Lo que verá el cliente"** que muestra en tiempo real cómo va quedando el formulario desde la óptica del cliente. Es útil para revisar antes de guardar.

---

## 10. Buenas prácticas

- **Pensá antes de eliminar.** Si dudás, usá "Ocultar" en vez de eliminar. Los datos de las solicitudes antiguas pueden romperse si eliminás preguntas con ID usado.
- **IDs descriptivos.** Usá IDs en camelCase tipo `fechaNacimiento`, no `campo1`. Ayuda al desarrollador y al backend.
- **Requerida solo si es crítico.** No pongas todo como requerido — frustra al cliente. Solo lo legalmente necesario.
- **Agrupá por contexto.** Preguntas relacionadas en el mismo paso. No mezcles datos personales con documentos.
- **Máximo 10-12 preguntas por paso.** Si un paso se hace muy largo, dividilo.
- **Testeá.** Cerrá el editor, entrá como cliente (`client@tcmc.local` / `Client123!`), hacé clic en "Nueva Solicitud" y recorré el formulario completo.

---

## 11. Ejemplo práctico: agregar paso de "Referencias bancarias"

Supongamos que querés agregar un nuevo paso antes de "Aceptación de Términos" para pedir referencias bancarias.

**Paso 1 — Crear el paso**
- Click en "+ Agregar paso nuevo"
- Click en el título y renombrar a "Referencias Bancarias"
- Usar las flechas ↑↓ para moverlo antes de "Aceptación de Términos"

**Paso 2 — Agregar preguntas**

1. "Banco principal" — Texto corto — ID: `bancoPrincipal`
2. "Número de cuenta" — Texto corto — ID: `numeroCuenta`
3. "¿Tiene otra cuenta bancaria?" — Sí/No — ID: `tieneSegundoBanco`
4. "Banco secundario" — Texto corto — ID: `bancoSecundario` — Mostrar solo si: `tieneSegundoBanco`
5. "Resumen bancario (últimos 3 meses)" — Archivo — ID: `resumenBancario3m` — Requerida: Sí

**Paso 3 — Guardar**
- Click en "Guardar cambios"
- Probar como cliente

Listo. En pocos minutos agregaste un paso completo sin tocar código.

---

## 12. Si algo no funciona

- **"Guardar cambios" está deshabilitado:** significa que no hay cambios sin guardar. Hacé alguna edición y se activa.
- **La pregunta hija no aparece:** revisá que el ID en "Mostrar solo si" sea **idéntico** al ID de la pregunta padre (case-sensitive, sin espacios).
- **El cliente no ve los cambios:** los cambios aplican solo a solicitudes NUEVAS, no a las que están en curso. Probá creando una solicitud nueva.
- **Se rompió algo:** botón "Restaurar por defecto" vuelve todo a fábrica.
