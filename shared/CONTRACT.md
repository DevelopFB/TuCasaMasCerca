# Contrato Web ↔ App (TCMC)

Este documento define los **puntos de contacto** entre la Landing (sitio publico) y la App (backoffice + portal cliente). Ambos equipos de desarrollo deben respetarlos para que los proyectos puedan avanzar en paralelo sin pisarse.

---

## 1) Handoff "Ingresar" de landing a app

La landing tiene un boton **"Ingresar"** que debe llevar al usuario a la app.

**Contrato:**
- Al hacer click se ejecuta: `window.location.href = APP_URL + '/login'`
- Opcional: si el cliente ya simulo, pasar los valores como query params:
  ```
  https://app.tucasamascerca.com/login?propertyValue=150000&loanAmount=45000&months=36
  ```
- La app lee esos params en `/login` y los guarda en sessionStorage para prellenar el paso 2 de la nueva solicitud despues del registro/login.

**Variable de entorno:**
- Landing: `APP_URL` (ej: `https://app.tucasamascerca.com`)
- App: no necesita saber el dominio de la landing

---

## 2) Captura de lead desde landing

Cuando un usuario completa el simulador y deja su email/telefono, la landing dispara:

**Endpoint:** `POST {APP_URL}/api/leads`

**Body:**
```json
{
  "email": "usuario@email.com",
  "phone": "+54 11 1234-5678",
  "quote": {
    "propertyValue": 150000,
    "loanAmount": 45000,
    "months": 36,
    "cuota": 1234.56,
    "tna": 0.125,
    "bruto": 47722.50
  },
  "source": "landing_simulator",
  "utm": {
    "source": "google",
    "medium": "cpc",
    "campaign": "..."
  }
}
```

**Response:** `201 Created` con `{ "leadId": "lead_xxx" }`

> **Regla CFT:** el CFT **no** viaja en el lead ni se persiste como valor fijo. Se deriva siempre de `cuota`, `months` y `loanAmount` (los inputs del quote) con `calcularCFT` de `/shared/algorithms.js`. Si un consumidor necesita mostrarlo, lo recalcula de esos inputs.

**Errores:**
- `400` si falta email o quote
- `429` si el mismo IP supera 5 leads/min (rate limit)

---

## 3) Config del simulador (tasas dinamicas)

Para que cuando el super_admin cambie tasas en la app, la landing se actualice sola:

**Endpoint:** `GET {APP_URL}/api/config/public`

**Response:**
```json
{
  "tasasBase": {
    "12": 0.095,
    "24": 0.105,
    "36": 0.115,
    "48": 0.125,
    "60": 0.135
  },
  "upfront": 0.05,
  "iva": 0.21,
  "maxLTV": 0.35,
  "maxLoan": 50000,
  "version": 4,
  "updatedAt": "2026-07-30T10:00:00Z"
}
```

**Notas:**
- Los plazos habilitados son exactamente las claves de `tasasBase`. Un plazo que no figure ahi es un **error explicito** (la UI muestra "—"); nunca se cotiza con una tasa fallback.
- Las listas de plazos en la UI se generan con `Object.keys(config.tasasBase)` — agregar un plazo a la config lo hace aparecer solo, sin tocar codigo.
- `upfront` (comision de originacion) e `iva` viajan en la config: si cambian desde el panel de admin, el CFT se recalcula solo.

**Caching:**
- La landing puede cachear la respuesta en `localStorage` por 5 min
- Si la API falla, la landing usa `CONFIG_DEFAULTS` de `/shared/algorithms.js` (valores hardcodeados de fallback)
- **Nunca** romper el simulador por falta de conexion al backend

---

## 4) Algoritmos financieros compartidos

Ambos lados importan los mismos algoritmos desde `/shared/algorithms.js`:

- `calcularBruto(prestamo, config)` — comision e IVA salen de la config
- `calcularCuota(tasaAnual, meses, bruto)`
- `tasaMensualEfectiva(montoRecibido, cuotaMensual, meses)` — biseccion, equivalente a `RATE(nper, -pmt, pv)` de Excel
- `calcularCFT(cuotaMensual, meses, prestamo)` — tasa efectiva anual sobre los flujos reales del tomador (recibe el neto, paga cuota del bruto)
- `calcularTEA(tasaAnual)` — TEA de la tasa sola; `CFT − TEA` = cuanto pesa la comision
- `getTasaForMonths(meses, config)` — plazo no habilitado → `NaN` (nunca fallback)
- `maxAllowedLoan(propertyValue, config)`
- `generatePaymentSchedule(loanAmount, months, fechaEscritura, tasaAnual, config)`
- `getEstadoLoan(loan)`
- `formatCurrency(num)`

> `calcularTNA` fue **eliminada** (anualizaba una tasa directa sobre el capital original: no es una tasa y daba un CFT menor a la propia TNA). No existe alias: cualquier consumidor que la llame debe romper en build, no seguir mostrando un numero equivocado.

**Regla que no se puede romper:** el CFT nunca se cachea en DB, nunca se devuelve por API como valor fijo, y nunca se escribe en un PDF/mail sin sus inputs. Se deriva siempre de la cuota y del monto recibido; si viaja, viaja junto a los inputs que lo generan.

**Test de control obligatorio:** con la comision en cero, `calcularCFT` tiene que dar exactamente `calcularTEA(tasaNominal)` en los cinco plazos (9,9248% / 11,0203% / 12,1259% / 13,2416% / 14,3674%). Cualquier implementacion basada en una tasa directa anualizada falla este test.

**Regla:** si alguno de los equipos necesita **modificar** un calculo, debe:
1. Crear issue en GitHub con label `breaking-change`
2. Avisar al otro equipo
3. Actualizar la version del archivo (comentario al inicio)
4. Ambos equipos testean antes de mergear

---

## 5) Dominios y CORS

| Proyecto | Dominio productivo | Dominio staging |
|----------|-------------------|-----------------|
| Landing | `https://tucasamascerca.com` | `https://staging.tucasamascerca.com` |
| App | `https://app.tucasamascerca.com` | `https://staging-app.tucasamascerca.com` |

**CORS del backend de la app:**
```javascript
// Next.js config o Supabase CORS settings
const allowedOrigins = [
  'https://tucasamascerca.com',
  'https://staging.tucasamascerca.com',
  'http://localhost:3000',         // dev local landing
  'http://localhost:8080'          // dev local landing (otro puerto comun)
];
```

Solo los endpoints publicos (`/api/leads`, `/api/config/public`) deben estar disponibles cross-origin. El resto de la API requiere autenticacion con cookie/JWT.

---

## 6) Versionado del contrato

Version actual: **1.1** (2026-07-30)

Si se cambia algo aca, bumpear la version y avisar a ambos equipos.

| Version | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-04-20 | Contrato inicial |
| 1.1 | 2026-07-30 | CFT correcto (TIR de flujos reales, biseccion); se elimina `calcularTNA` sin alias; `upfront`/`iva` pasan a config; plazos sin tasa → error explicito; regla "el CFT nunca se persiste" |

---

## 7) Preguntas frecuentes

**¿La landing puede consultar la DB directamente?**
No. Solo los dos endpoints publicos (`/api/leads` y `/api/config/public`). Nada mas.

**¿Y si la app todavia no esta deployada?**
La landing funciona standalone con `CONFIG_DEFAULTS`. El boton "Ingresar" puede mostrar "Proximamente" hasta que la app este online.

**¿Pueden los dos equipos deployar al mismo tiempo?**
Si. Son deploys totalmente independientes (Vercel/Netlify separados). No hay dependencia temporal.

**¿Como sabe el dev de la app que la landing ya envia leads?**
Implementa el endpoint `POST /api/leads` segun esta spec. Puede testear con `curl` o Postman sin necesidad de que la landing este corriendo.

**¿Y si cambia el modelo de datos de Lead en el futuro?**
Mantener backward compatibility con version del contrato. Agregar campos es OK, cambiar tipos o eliminar campos es breaking change.
