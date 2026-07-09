# TCMC · Contrato Web ↔ App

**Versión:** 1.0 — 2026-04-20
**Estado:** Productivo
**Propósito:** Definir los puntos de contacto entre la landing pública y la aplicación para que ambos equipos puedan desarrollar en paralelo sin pisarse.

---

## Resumen

La landing (`tucasamascerca.com`) y la app (`app.tucasamascerca.com`) son **dos proyectos independientes** que se comunican únicamente a través de tres puntos de contacto bien definidos:

1. **Redirección "Ingresar"** — la landing manda al usuario a la app.
2. **Captura de leads** — la landing envía leads al backend de la app.
3. **Configuración pública del simulador** — la landing consume las tasas del backend de la app.

Adicionalmente, ambos lados comparten los **mismos algoritmos financieros** vía `/shared/algorithms.js`.

---

## 1. Handoff "Ingresar" de landing a app

La landing tiene un botón **"Ingresar"** que lleva al usuario a la app.

### Comportamiento

```javascript
// En la landing
function handleIngresar() {
  const APP_URL = window.APP_URL || 'https://app.tucasamascerca.com';
  const quote = getCurrentQuote();  // si el usuario ya simuló, mandamos los valores

  const params = quote
    ? `?propertyValue=${quote.propertyValue}&loanAmount=${quote.loanAmount}&months=${quote.months}`
    : '';

  window.location.href = `${APP_URL}/login${params}`;
}
```

### Comportamiento del lado de la app

En `/login` (página pública de la app):
1. Si hay query params (`propertyValue`, `loanAmount`, `months`), guardarlos en `sessionStorage`.
2. Tras el registro/login, prellenar el Step 2 del wizard con esos valores.

### Variables de entorno

- **Landing:** `APP_URL` (ej. `https://app.tucasamascerca.com`).
- **App:** no necesita conocer el dominio de la landing salvo para CORS.

---

## 2. Captura de lead desde la landing

Cuando el usuario completa el simulador y deja su email/teléfono, la landing dispara:

### Endpoint

```http
POST {APP_URL}/api/leads
Content-Type: application/json
```

### Body

```json
{
  "email": "usuario@email.com",
  "phone": "+54 9 11 1234-5678",
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
    "campaign": "primavera_2026"
  }
}
```

### Respuestas

| Código | Significado | Body |
|--------|-------------|------|
| 201 | Creado | `{ "leadId": "lead_xxx" }` |
| 400 | Bad Request | Email faltante o quote malformado |
| 422 | Validación | Campo con formato inválido |
| 429 | Rate Limit | Misma IP supera 5 leads/min |
| 500 | Server Error | Reintentar |

### Rate limiting

- 5 leads/min por IP.
- 100 leads/día por IP.
- Reset cada 24 hs.

### CORS

El backend de la app debe permitir CORS para este endpoint desde:
- `https://tucasamascerca.com`
- `https://staging.tucasamascerca.com`
- `http://localhost:8080` (dev local)
- `http://localhost:3000` (dev local alternativo)

---

## 3. Configuración pública del simulador

Para que la landing tenga siempre las tasas vigentes (sin necesidad de re-deploy cuando el super_admin cambia config en el backoffice):

### Endpoint

```http
GET {APP_URL}/api/config/public
Cache-Control: public, max-age=300
```

### Respuesta

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

### Caching del lado de la landing

```javascript
const CACHE_KEY = 'tcmc_config';
const TTL = 5 * 60 * 1000;  // 5 minutos

async function getConfig() {
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  if (cached && Date.now() - cached.fetchedAt < TTL) {
    return cached.data;
  }

  try {
    const r = await fetch(`${APP_URL}/api/config/public`, { signal: AbortSignal.timeout(2000) });
    const data = await r.json();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt: Date.now() }));
    return data;
  } catch (e) {
    return cached?.data || CONFIG_DEFAULTS;
  }
}
```

### Fallback

Si la API falla o tarda más de 2 segundos, la landing usa `CONFIG_DEFAULTS` (valores hardcodeados en `/shared/algorithms.js`):

```javascript
const CONFIG_DEFAULTS = {
  tasasBase: { 12: 0.095, 24: 0.105, 36: 0.115, 48: 0.125, 60: 0.135 },
  maxLTV: 0.35,
  maxLoan: 50000
};
```

**Regla:** nunca romper el simulador por falta de conexión al backend.

---

## 4. Algoritmos financieros compartidos

Ambos lados importan los mismos algoritmos desde `/shared/algorithms.js`:

```
calcularBruto(prestamo)
calcularCuota(tasaAnual, meses, bruto)
calcularTNA(cuotaMensual, meses, prestamo)
getTasaForMonths(meses, config)
maxAllowedLoan(propertyValue, config)
generatePaymentSchedule(loanAmount, months, fechaEscritura, tasaAnual)
getEstadoLoan(loan)
formatCurrency(num)
```

### Regla de modificación

Si alguno de los equipos necesita modificar un cálculo:

1. Crear issue con label `breaking-change` (o equivalente en GitLab/Bitbucket).
2. Avisar al otro equipo por canal acordado (Slack, email).
3. Bumpear la versión del archivo (comentario al inicio).
4. **Ambos equipos** testean antes de mergear.
5. Coordinar deploy simultáneo si afecta usuarios activos.

---

## 5. Dominios y CORS

| Componente | Producción | Staging |
|------------|-----------|---------|
| Landing | `https://tucasamascerca.com` | `https://staging.tucasamascerca.com` |
| App | `https://app.tucasamascerca.com` | `https://staging-app.tucasamascerca.com` |

### CORS del backend de la app

```javascript
const allowedOrigins = [
  'https://tucasamascerca.com',
  'https://staging.tucasamascerca.com',
  'http://localhost:8080',
  'http://localhost:3000',
];

// Solo aplica a /api/leads y /api/config/public
// El resto de la API requiere auth con cookie/JWT
```

---

## 6. Versionado del contrato

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-04-20 | Contrato inicial |

Si se modifica algún endpoint o estructura, bumpear versión y avisar a ambos equipos.

---

## 7. FAQ

**¿La landing puede consultar la DB directamente?**
No. Únicamente los dos endpoints públicos. Cualquier otro acceso requiere autenticación con cookie/JWT desde la app.

**¿Qué pasa si la app aún no está deployada?**
La landing funciona standalone con `CONFIG_DEFAULTS`. El botón "Ingresar" puede mostrar "Próximamente" hasta que la app esté online.

**¿Pueden ambos equipos deployar al mismo tiempo?**
Sí. Son deploys independientes (Vercel/Netlify separados). No hay dependencia temporal salvo cuando se cambia el contrato.

**¿Cómo sabe el equipo de la app que la landing ya envía leads?**
Implementa `POST /api/leads` según esta spec. Puede testear con curl/Postman sin necesidad de tener la landing corriendo.

**¿Y si cambia el modelo de Lead en el futuro?**
Mantener backward compatibility. Agregar campos es OK. Cambiar tipos o eliminar campos es **breaking change** y requiere versionado del endpoint (ej. `/api/v2/leads`).

**¿La landing puede leer notificaciones, legajos, pagos?**
No. La landing es 100% pública. Si necesita mostrar datos privados (ej. "Tu solicitud está en Escribanía"), eso ocurre dentro del dominio de la app después de login.

---

*Fin del contrato. Versión 1.0 — Abril 2026.*
