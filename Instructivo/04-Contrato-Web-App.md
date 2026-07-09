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
    "bruto": 47625
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
  "maxLTV": 0.35,
  "maxLoan": 50000,
  "version": 3,
  "updatedAt": "2026-04-20T10:00:00Z"
}
```

**Caching:**
- La landing puede cachear la respuesta en `localStorage` por 5 min
- Si la API falla, la landing usa `CONFIG_DEFAULTS` de `/shared/algorithms.js` (valores hardcodeados de fallback)
- **Nunca** romper el simulador por falta de conexion al backend

---

## 4) Algoritmos financieros compartidos

Ambos lados importan los mismos algoritmos desde `/shared/algorithms.js`:

- `calcularBruto(prestamo)`
- `calcularCuota(tasaAnual, meses, bruto)`
- `calcularTNA(cuotaMensual, meses, prestamo)`
- `getTasaForMonths(meses, config)`
- `maxAllowedLoan(propertyValue, config)`
- `generatePaymentSchedule(loanAmount, months, fechaEscritura, tasaAnual)`
- `getEstadoLoan(loan)`
- `formatCurrency(num)`

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

Version actual: **1.0** (2026-04-20)

Si se cambia algo aca, bumpear la version y avisar a ambos equipos.

| Version | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-04-20 | Contrato inicial |

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
