/**
 * TCMC - Algoritmos financieros compartidos
 *
 * Estos algoritmos son usados tanto por la LANDING (simulador publico)
 * como por la APP (simulador interno, generacion de cronograma, reportes).
 *
 * IMPORTANTE: No modificar sin coordinar con ambos equipos (Web y App).
 * Si se cambia un calculo, debe actualizarse simultaneamente en ambos lados.
 *
 * Uso:
 *   // En vanilla JS (landing):
 *   <script src="../shared/algorithms.js"></script>
 *   const bruto = TCMC.calcularBruto(30000);
 *
 *   // En Node/Next.js (app):
 *   import { calcularBruto } from '../../shared/algorithms.js';
 */

(function (global) {
  'use strict';

  // ============================================================================
  // CONFIG POR DEFECTO (fallback si no se puede consultar /api/config/public)
  // ============================================================================
  const CONFIG_DEFAULTS = {
    tasasBase: {
      12: 0.095,  // 9.5% anual para 12 meses
      24: 0.105,  // 10.5% anual para 24 meses
      36: 0.115,  // 11.5% anual para 36 meses
      48: 0.125,  // 12.5% anual para 48 meses
      60: 0.135   // 13.5% anual para 60 meses
    },
    upfront: 0.05,     // comision de originacion 5% (capitalizada en el bruto)
    iva: 0.21,         // IVA 21% sobre la comision
    maxLTV: 0.35,      // 35% del valor de la propiedad
    maxLoan: 50000     // USD 50.000 maximo
  };

  // ============================================================================
  // ALGORITMOS
  // ============================================================================

  /**
   * Monto bruto = prestamo + comision upfront + IVA sobre la comision.
   * La comision y el IVA salen de la config (nunca hardcodeados).
   */
  function calcularBruto(prestamo, config) {
    const c = config || CONFIG_DEFAULTS;
    const upfront = prestamo * c.upfront;
    const iva = upfront * c.iva;
    return prestamo + upfront + iva;
  }

  /**
   * Cuota mensual (formula PMT)
   */
  function calcularCuota(tasaAnual, meses, bruto) {
    const tm = tasaAnual / 12;
    const num = bruto * tm * Math.pow(1 + tm, meses);
    const den = Math.pow(1 + tm, meses) - 1;
    return num / den;
  }

  /**
   * Tasa mensual que iguala el valor presente de las cuotas al monto recibido.
   * Biseccion. Equivalente a RATE(nper, -pmt, pv) de Excel.
   */
  function tasaMensualEfectiva(montoRecibido, cuotaMensual, meses) {
    if (!(montoRecibido > 0) || !(cuotaMensual > 0) || !(meses > 0)) return NaN;
    if (cuotaMensual * meses <= montoRecibido) return 0;

    let lo = 1e-9, hi = 1.0;
    for (let k = 0; k < 200; k++) {
      const m = (lo + hi) / 2;
      let vp = 0;
      for (let t = 1; t <= meses; t++) vp += cuotaMensual / Math.pow(1 + m, t);
      if (vp > montoRecibido) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
  }

  /**
   * CFT — tasa efectiva anual. Incluye intereses + comision + IVA sobre la comision.
   * NO incluye sellados, escritura ni seguros.
   * REGLA: el CFT nunca se guarda ni se escribe — se deriva siempre de la cuota
   * y del monto recibido. Si tiene que viajar (API/PDF/mail), viaja junto a los
   * inputs que lo generan.
   * @param cuotaMensual  cuota calculada sobre el monto BRUTO
   * @param meses         plazo
   * @param prestamo      monto NETO que recibe el tomador
   */
  function calcularCFT(cuotaMensual, meses, prestamo) {
    const im = tasaMensualEfectiva(prestamo, cuotaMensual, meses);
    return isNaN(im) ? NaN : Math.pow(1 + im, 12) - 1;
  }

  /** TEA de la tasa sola, sin comision. CFT − TEA = cuanto pesa la comision. */
  function calcularTEA(tasaAnual) {
    return Math.pow(1 + tasaAnual / 12, 12) - 1;
  }

  /**
   * Tasa segun plazo (consulta CONFIG).
   * Plazo no habilitado → NaN (error explicito; la UI muestra "—", nunca se
   * cotiza con una tasa fallback silenciosa).
   */
  function getTasaForMonths(meses, config) {
    const c = config || CONFIG_DEFAULTS;
    const tasa = c.tasasBase[meses];
    return typeof tasa === 'number' ? tasa : NaN;
  }

  /**
   * Maximo monto permitido dado valor de propiedad y config
   */
  function maxAllowedLoan(propertyValue, config) {
    const c = config || CONFIG_DEFAULTS;
    const byLTV = Math.floor(propertyValue * c.maxLTV);
    return Math.min(c.maxLoan, byLTV);
  }

  /**
   * Generacion de cronograma de pagos
   * Se ejecuta cuando un legajo pasa a Finalizado con fecha de escritura.
   */
  function generatePaymentSchedule(loanAmount, months, fechaEscritura, tasaAnual, config) {
    const bruto = calcularBruto(loanAmount, config);
    const cuota = calcularCuota(tasaAnual, months, bruto);
    const startDate = new Date(fechaEscritura);
    const payments = [];
    for (let i = 1; i <= months; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      payments.push({
        number: i,
        dueDate: dueDate.toISOString().split('T')[0],
        amount: Math.round(cuota * 100) / 100,
        status: 'Pendiente',
        comprobante: null,
        pagoInfo: null
      });
    }
    return payments;
  }

  /**
   * Estado de un legajo finalizado segun sus cuotas
   *   - Al dia: sin cuotas vencidas no pagadas
   *   - Atraso <=5d: mayor atraso <= 5 dias
   *   - Atraso >5d: mayor atraso > 5 dias
   */
  function getEstadoLoan(loan) {
    const today = new Date();
    const vencidas = (loan.payments || []).filter(function (p) {
      if (p.status === 'Pagado') return false;
      return new Date(p.dueDate) < today;
    });
    if (vencidas.length === 0) return { label: 'Al dia', key: 'aldia', color: 'green' };
    const maxDiasAtraso = Math.max.apply(null, vencidas.map(function (p) {
      return Math.floor((today - new Date(p.dueDate)) / (1000 * 60 * 60 * 24));
    }));
    if (maxDiasAtraso <= 5) return { label: 'Atraso ' + maxDiasAtraso + 'd', key: 'atraso5', color: 'amber' };
    return { label: 'Atraso ' + maxDiasAtraso + 'd', key: 'atraso5plus', color: 'red' };
  }

  /**
   * Formateo de moneda USD (Argentina)
   */
  function formatCurrency(num) {
    return 'USD ' + Number(num).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // ============================================================================
  // EXPORT
  // ============================================================================
  const API = {
    CONFIG_DEFAULTS: CONFIG_DEFAULTS,
    calcularBruto: calcularBruto,
    calcularCuota: calcularCuota,
    tasaMensualEfectiva: tasaMensualEfectiva,
    calcularCFT: calcularCFT,
    calcularTEA: calcularTEA,
    getTasaForMonths: getTasaForMonths,
    maxAllowedLoan: maxAllowedLoan,
    generatePaymentSchedule: generatePaymentSchedule,
    getEstadoLoan: getEstadoLoan,
    formatCurrency: formatCurrency
  };

  // Browser (landing) y Node/ESM (app)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  } else {
    global.TCMC = API;
  }
})(typeof window !== 'undefined' ? window : this);
