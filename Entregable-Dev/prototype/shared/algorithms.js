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
    maxLTV: 0.35,      // 35% del valor de la propiedad
    maxLoan: 50000     // USD 50.000 maximo
  };

  // ============================================================================
  // ALGORITMOS
  // ============================================================================

  /**
   * Monto bruto = prestamo + 5% upfront + 21% IVA sobre upfront
   */
  function calcularBruto(prestamo) {
    const upfront = prestamo * 0.05;
    const iva = upfront * 0.21;
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
   * TNA aproximada (anualizada compuesta)
   */
  function calcularTNA(cuotaMensual, meses, prestamo) {
    const td = (cuotaMensual * meses) / prestamo - 1;
    return Math.pow(1 + td, 12 / meses) - 1;
  }

  /**
   * Tasa segun plazo (consulta CONFIG)
   */
  function getTasaForMonths(meses, config) {
    const c = config || CONFIG_DEFAULTS;
    return c.tasasBase[meses] || 0.125;
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
  function generatePaymentSchedule(loanAmount, months, fechaEscritura, tasaAnual) {
    const bruto = calcularBruto(loanAmount);
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
    calcularTNA: calcularTNA,
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
