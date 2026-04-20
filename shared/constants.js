/**
 * TCMC - Constantes compartidas
 *
 * Tipos de datos, configs iniciales y enums usados tanto por Landing como por App.
 */

(function (global) {
  'use strict';

  // Etapas del workflow (ver Brief APP seccion 5)
  const STAGES_ALL = [
    'Solicitud Inicial',
    'Scoring',
    'Pre Aprobación',
    'Escribanía',
    'Aprobación',
    'Escritura',
    'Finalizado',
    'Rechazado'
  ];

  const STAGES_FLOW = [
    'Solicitud Inicial',
    'Scoring',
    'Pre Aprobación',
    'Escribanía',
    'Aprobación',
    'Escritura'
  ];

  // Colores por etapa (sugerencia de UI)
  const STAGE_COLORS = {
    'Solicitud Inicial': 'slate',
    'Scoring': 'amber',
    'Pre Aprobación': 'blue',
    'Escribanía': 'purple',
    'Aprobación': 'indigo',
    'Escritura': 'cyan',
    'Finalizado': 'green',
    'Rechazado': 'red'
  };

  // Roles del sistema
  const ROLES = ['super_admin', 'red_admin', 'oficina_admin', 'agente', 'cliente'];

  const ROLE_LABELS = {
    super_admin: 'Super Admin',
    red_admin: 'Admin Red',
    oficina_admin: 'Jefe Oficina',
    agente: 'Agente',
    cliente: 'Cliente'
  };

  // Tipos de pregunta disponibles en el ABM Formulario
  const QUESTION_TYPES = [
    { value: 'text', label: 'Texto corto' },
    { value: 'textarea', label: 'Texto largo' },
    { value: 'number', label: 'Numero' },
    { value: 'url', label: 'URL' },
    { value: 'date', label: 'Fecha' },
    { value: 'select', label: 'Desplegable (opciones)' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'boolean', label: 'Si / No' },
    { value: 'file', label: 'Archivo (upload)' },
    { value: 'info', label: 'Info (solo lectura)' }
  ];

  // Estados de documento
  const DOC_STATUSES = ['Pendiente', 'Aprobado', 'Observado', 'No aplica'];

  // Estados de cuota
  const PAYMENT_STATUSES = ['Pendiente', 'Pagado', 'Informado', 'Vencido'];

  // Tipos de notificacion
  const NOTIFICATION_TYPES = {
    NEW_REQUEST: 'new_request',
    STAGE_CHANGE: 'stage_change',
    INFO_REQUEST: 'info_request',
    PAYMENT_DUE: 'payment_due'
  };

  // Form config por defecto (el formulario que viene pre-armado)
  // La APP debe seedear este objeto en la tabla form_config al bootstrap inicial.
  const DEFAULT_FORM_CONFIG = {
    titulo: 'Nueva Solicitud de Crédito',
    steps: [
      {
        id: 'step1',
        titulo: 'Verificación de Identidad',
        hidden: false,
        questions: [
          { id: 'dniFrente', label: 'DNI Frente', type: 'file', required: true, hidden: false, helpText: 'Click para subir imagen' },
          { id: 'dniDorso', label: 'DNI Dorso', type: 'file', required: true, hidden: false, helpText: 'Click para subir imagen' },
          { id: 'selfie', label: 'Verificación por video / Selfie', type: 'info', required: false, hidden: false, helpText: 'Verificación por MetaMap — Próximamente' },
          { id: 'domicilio', label: 'Domicilio', type: 'text', required: true, hidden: false, placeholder: 'Calle, número, departamento, localidad' },
          { id: 'comprobanteDomicilio', label: 'Comprobante de Domicilio', type: 'file', required: true, hidden: false, helpText: 'Ej: factura de servicios' }
        ]
      },
      {
        id: 'step2',
        titulo: 'Datos del Crédito',
        hidden: false,
        questions: [
          { id: 'propertyLink', label: 'Link de Coldwell Banker', type: 'url', required: false, hidden: false, placeholder: 'https://coldwellbanker.com.ar/propiedad/...' },
          { id: 'propertyCode', label: 'Código de propiedad CB', type: 'text', required: false, hidden: false, placeholder: 'Ej: IAP2257755' },
          { id: 'propertyAddress', label: 'Dirección del inmueble', type: 'text', required: true, hidden: false, placeholder: 'Calle, número, piso/depto, localidad, provincia' },
          { id: 'propertyValue', label: 'Precio de venta CB (USD)', type: 'number', required: true, hidden: false, helpText: 'Dato de CB — podés corregirlo si no coincide' },
          { id: 'offeredValue', label: 'Valor ofertado / precio de compra (USD)', type: 'number', required: true, hidden: false, helpText: 'Base para el cálculo del crédito (LTV)' },
          { id: 'loanAmount', label: 'Importe del crédito a solicitar (USD)', type: 'number', required: true, hidden: false },
          { id: 'months', label: 'Plazo', type: 'select', required: true, hidden: false, options: ['12 meses', '24 meses', '36 meses', '48 meses', '60 meses'] },
          { id: 'advisor', label: 'Asesor asignado', type: 'select', required: true, hidden: false, options: ['María Rodríguez', 'Carlos Mendoza', 'Alejandra Gutiérrez'] },
          { id: 'reservaCredito', label: 'Reserva ad Referéndum', type: 'file', required: true, hidden: false }
        ]
      },
      {
        id: 'step3',
        titulo: 'Ingresos y Codeudor',
        hidden: false,
        questions: [
          { id: 'ingresosAnuales', label: 'Ingresos anuales declarados (USD)', type: 'number', required: true, hidden: false },
          { id: 'ingresos', label: 'Declaración de ingresos (archivo)', type: 'file', required: true, hidden: false },
          { id: 'rentaPresunta', label: 'Renta presunta (archivo opcional)', type: 'file', required: false, hidden: false },
          { id: 'hasCodeudor', label: '¿Agregar codeudor?', type: 'boolean', required: false, hidden: false },
          { id: 'codeudorNombre', label: 'Nombre del codeudor', type: 'text', required: false, hidden: false, dependsOn: 'hasCodeudor' },
          { id: 'codeudorApellido', label: 'Apellido del codeudor', type: 'text', required: false, hidden: false, dependsOn: 'hasCodeudor' },
          { id: 'codeudorDni', label: 'DNI del codeudor', type: 'text', required: false, hidden: false, dependsOn: 'hasCodeudor' },
          { id: 'codeudorVinculo', label: 'Vínculo con el codeudor', type: 'select', required: false, hidden: false, options: ['Cónyuge', 'Padre/Madre', 'Hermano/a', 'Hijo/a', 'Otro'], dependsOn: 'hasCodeudor' },
          { id: 'codeudorIngresosAnuales', label: 'Ingresos anuales codeudor (USD)', type: 'number', required: false, hidden: false, dependsOn: 'hasCodeudor' },
          { id: 'codeudorDocs', label: 'Documentos del codeudor', type: 'file', required: false, hidden: false, dependsOn: 'hasCodeudor' }
        ]
      },
      {
        id: 'step4',
        titulo: 'Aceptación de Términos',
        hidden: false,
        questions: [
          { id: 'termsAccepted', label: 'Acepto los términos y condiciones de Tu Casa +Cerca', type: 'checkbox', required: true, hidden: false }
        ]
      }
    ]
  };

  const API = {
    STAGES_ALL: STAGES_ALL,
    STAGES_FLOW: STAGES_FLOW,
    STAGE_COLORS: STAGE_COLORS,
    ROLES: ROLES,
    ROLE_LABELS: ROLE_LABELS,
    QUESTION_TYPES: QUESTION_TYPES,
    DOC_STATUSES: DOC_STATUSES,
    PAYMENT_STATUSES: PAYMENT_STATUSES,
    NOTIFICATION_TYPES: NOTIFICATION_TYPES,
    DEFAULT_FORM_CONFIG: DEFAULT_FORM_CONFIG
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  } else {
    global.TCMC_CONST = API;
  }
})(typeof window !== 'undefined' ? window : this);
