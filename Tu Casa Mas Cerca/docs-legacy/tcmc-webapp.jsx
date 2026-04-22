import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Menu, X, LogOut, Settings, Users, FileText, BarChart3, Home, DollarSign, Clock, CheckCircle, AlertCircle, Phone, Search, Plus, Upload, Eye, EyeOff, Mail, MapPin, Smartphone, Lock, User, ArrowRight, TrendingUp, Zap } from 'lucide-react';

// ============================================================================
// SIMULATOR LOGIC (FROM INDEX.HTML)
// ============================================================================

const CONFIG_DEFAULTS = {
  tasasBase: { 12: 0.105, 24: 0.115, 36: 0.125, 48: 0.135, 60: 0.145 },
  maxLTV: 0.35,
  maxLoan: 50000,
};

const calcularBruto = (loan) => {
  const upfront = loan * 0.05;
  const iva = upfront * 0.21;
  return loan + upfront + iva;
};

const calcularCuota = (tasaAnual, meses, montoBruto) => {
  const tm = tasaAnual / 12;
  if (tm === 0) return montoBruto / meses;
  return (montoBruto * (tm * Math.pow(1 + tm, meses))) / (Math.pow(1 + tm, meses) - 1);
};

const calcularTIR = (cuota, meses, prestamo) => {
  const td = (cuota * meses) / prestamo - 1;
  return Math.pow(1 + td, 12 / meses) - 1;
};

// ============================================================================
// LOGO COMPONENT
// ============================================================================

const Logo = ({ className = '', size = 32 }) => (
  <svg viewBox="0 0 120 40" className={className} style={{ width: size, height: 'auto' }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="32" fontSize="28" fontFamily="Poppins" fontWeight="600" fill="#0052CC">
      Tu Casa
    </text>
    <circle cx="115" cy="12" r="8" fill="#FF6B35" />
    <path d="M105 8 L115 8 L115 18 L105 18 Z" fill="none" stroke="#0052CC" strokeWidth="1.5" />
  </svg>
);

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_LOANS = [
  {
    id: 'LN001',
    clientName: 'Juan García López',
    email: 'juan.garcia@email.com',
    phone: '+54 11 2345-6789',
    propertyValue: 150000,
    loanAmount: 45000,
    months: 36,
    status: 'Activo',
    createdAt: '2025-10-15',
    dueDate: '2028-10-15',
    broker: 'María Rodríguez',
    location: 'CABA - San Nicolás',
    monthlyPayment: 1350,
    totalPayments: 48600,
    interestRate: 0.125,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-10-16' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-10-17' },
      { name: 'Certificado de Propiedad', status: 'Verificado', uploadedAt: '2025-10-18' },
    ],
    stage: 'Escritura',
    payments: Array.from({ length: 48 }, (_, i) => ({
      number: i + 1,
      dueDate: new Date(2025, 10 + i, 15).toLocaleDateString('es-AR'),
      amount: 1350,
      status: i < 5 ? 'Pagado' : i === 5 ? 'Próximo' : 'Pendiente',
    })),
  },
  {
    id: 'LN002',
    clientName: 'María Fernández Rossi',
    email: 'maria.fernandez@email.com',
    phone: '+54 11 3456-7890',
    propertyValue: 200000,
    loanAmount: 60000,
    months: 48,
    status: 'Aprobado',
    createdAt: '2025-09-20',
    dueDate: '2029-09-20',
    broker: 'Carlos Mendoza',
    location: 'Provincia de Buenos Aires - La Plata',
    monthlyPayment: 1620,
    totalPayments: 77760,
    interestRate: 0.135,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-09-21' },
      { name: 'DNI Dorso', status: 'Verificado', uploadedAt: '2025-09-21' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-09-22' },
      { name: 'Certificado de Propiedad', status: 'Observado', uploadedAt: '2025-09-23' },
    ],
    stage: 'Escritura',
    payments: [],
  },
  {
    id: 'LN003',
    clientName: 'Roberto Martínez Silva',
    email: 'roberto.martinez@email.com',
    phone: '+54 11 4567-8901',
    propertyValue: 120000,
    loanAmount: 35000,
    months: 36,
    status: 'En proceso',
    createdAt: '2025-11-05',
    dueDate: null,
    broker: 'Alejandra Gutiérrez',
    location: 'CABA - Flores',
    monthlyPayment: 1050,
    totalPayments: null,
    interestRate: 0.125,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-11-05' },
      { name: 'Comprobante de Ingresos', status: 'Pendiente', uploadedAt: null },
    ],
    stage: 'Scoring',
    payments: [],
  },
  {
    id: 'LN004',
    clientName: 'Andrea López González',
    email: 'andrea.lopez@email.com',
    phone: '+54 11 5678-9012',
    propertyValue: 180000,
    loanAmount: 50000,
    months: 60,
    status: 'Pendiente',
    createdAt: '2025-11-10',
    dueDate: null,
    broker: 'Paula Ríos',
    location: 'CABA - Chacarita',
    monthlyPayment: 1195,
    totalPayments: null,
    interestRate: 0.145,
    documents: [
      { name: 'DNI Frente', status: 'Pendiente', uploadedAt: null },
    ],
    stage: 'Solicitud Inicial',
    payments: [],
  },
  {
    id: 'LN005',
    clientName: 'Fernando Romero Díaz',
    email: 'fernando.romero@email.com',
    phone: '+54 11 6789-0123',
    propertyValue: 250000,
    loanAmount: 75000,
    months: 48,
    status: 'Rechazado',
    createdAt: '2025-10-01',
    dueDate: null,
    broker: 'Nicolás Peña',
    location: 'Provincia de Buenos Aires - Morón',
    monthlyPayment: 0,
    totalPayments: null,
    interestRate: 0.135,
    documents: [],
    stage: 'Pre Aprobación',
    rejectionReason: 'La relación LTV excede el límite máximo permitido (solicita 30%, máximo 35%)',
    payments: [],
  },
  {
    id: 'LN006',
    clientName: 'Claudia Sánchez Torres',
    email: 'claudia.sanchez@email.com',
    phone: '+54 11 7890-1234',
    propertyValue: 160000,
    loanAmount: 48000,
    months: 36,
    status: 'Activo',
    createdAt: '2025-08-10',
    dueDate: '2028-08-10',
    broker: 'Diego Morales',
    location: 'CABA - Almagro',
    monthlyPayment: 1440,
    totalPayments: 51840,
    interestRate: 0.125,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-08-11' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-08-12' },
      { name: 'Certificado de Propiedad', status: 'Verificado', uploadedAt: '2025-08-13' },
    ],
    stage: 'Aprobación',
    payments: Array.from({ length: 36 }, (_, i) => ({
      number: i + 1,
      dueDate: new Date(2025, 8 + i, 10).toLocaleDateString('es-AR'),
      amount: 1440,
      status: i < 8 ? 'Pagado' : i === 8 ? 'Próximo' : 'Pendiente',
    })),
  },
  {
    id: 'LN007',
    clientName: 'Miguel Ángel Hernández',
    email: 'miguel.hernandez@email.com',
    phone: '+54 11 8901-2345',
    propertyValue: 140000,
    loanAmount: 42000,
    months: 48,
    status: 'Cancelado',
    createdAt: '2024-06-15',
    dueDate: '2028-06-15',
    broker: 'Valentina Costa',
    location: 'CABA - Barracas',
    monthlyPayment: 1130,
    totalPayments: 54240,
    interestRate: 0.135,
    documents: [],
    stage: 'Aprobación',
    payments: Array.from({ length: 48 }, (_, i) => ({
      number: i + 1,
      dueDate: new Date(2024, 6 + i, 15).toLocaleDateString('es-AR'),
      amount: 1130,
      status: 'Pagado',
    })),
  },
  {
    id: 'LN008',
    clientName: 'Gabriela Ruiz Mendez',
    email: 'gabriela.ruiz@email.com',
    phone: '+54 11 9012-3456',
    propertyValue: 190000,
    loanAmount: 55000,
    months: 60,
    status: 'Observado',
    createdAt: '2025-10-25',
    dueDate: null,
    broker: 'Ramón García',
    location: 'Provincia de Buenos Aires - Quilmes',
    monthlyPayment: 1314,
    totalPayments: null,
    interestRate: 0.145,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-10-26' },
      { name: 'Comprobante de Ingresos', status: 'Observado', uploadedAt: '2025-10-27' },
    ],
    stage: 'Pre Aprobación',
    observations: 'Requerida documentación adicional de ingresos complementarios',
    payments: [],
  },
  {
    id: 'LN009',
    clientName: 'Luciano Pérez Acosta',
    email: 'luciano.perez@email.com',
    phone: '+54 11 0123-4567',
    propertyValue: 170000,
    loanAmount: 48000,
    months: 36,
    status: 'Pendiente de liquidación',
    createdAt: '2025-09-30',
    dueDate: '2028-09-30',
    broker: 'Florencia Navarro',
    location: 'CABA - Constitución',
    monthlyPayment: 1440,
    totalPayments: 51840,
    interestRate: 0.125,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-09-30' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-10-01' },
      { name: 'Certificado de Propiedad', status: 'Verificado', uploadedAt: '2025-10-02' },
      { name: 'Acta de Adjudicación', status: 'Verificado', uploadedAt: '2025-10-03' },
    ],
    stage: 'Escribanía',
    payments: [],
  },
  {
    id: 'LN010',
    clientName: 'Marisa González Campos',
    email: 'marisa.gonzalez@email.com',
    phone: '+54 11 1234-5678',
    propertyValue: 220000,
    loanAmount: 65000,
    months: 60,
    status: 'Aprobado',
    createdAt: '2025-10-08',
    dueDate: null,
    broker: 'Sergio Moreno',
    location: 'CABA - San Telmo',
    monthlyPayment: 1554,
    totalPayments: null,
    interestRate: 0.145,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-10-09' },
      { name: 'DNI Dorso', status: 'Verificado', uploadedAt: '2025-10-09' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-10-10' },
      { name: 'Certificado de Propiedad', status: 'Verificado', uploadedAt: '2025-10-11' },
    ],
    stage: 'Escribanía',
    payments: [],
  },
  {
    id: 'LN011',
    clientName: 'Héctor Iglesias Vega',
    email: 'hector.iglesias@email.com',
    phone: '+54 11 2345-6789',
    propertyValue: 130000,
    loanAmount: 38000,
    months: 36,
    status: 'Activo',
    createdAt: '2025-07-20',
    dueDate: '2028-07-20',
    broker: 'Beatriz Salgado',
    location: 'CABA - Palermo',
    monthlyPayment: 1140,
    totalPayments: 41040,
    interestRate: 0.125,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-07-21' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-07-22' },
      { name: 'Certificado de Propiedad', status: 'Verificado', uploadedAt: '2025-07-23' },
    ],
    stage: 'Aprobación',
    payments: Array.from({ length: 36 }, (_, i) => ({
      number: i + 1,
      dueDate: new Date(2025, 7 + i, 20).toLocaleDateString('es-AR'),
      amount: 1140,
      status: i < 12 ? 'Pagado' : i === 12 ? 'Próximo' : 'Pendiente',
    })),
  },
  {
    id: 'LN012',
    clientName: 'Daniela Castillo Romero',
    email: 'daniela.castillo@email.com',
    phone: '+54 11 3456-7890',
    propertyValue: 175000,
    loanAmount: 50000,
    months: 48,
    status: 'En proceso',
    createdAt: '2025-11-02',
    dueDate: null,
    broker: 'Gustavo Rojas',
    location: 'CABA - Recoleta',
    monthlyPayment: 1350,
    totalPayments: null,
    interestRate: 0.135,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-11-02' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-11-03' },
      { name: 'Certificado de Propiedad', status: 'Verificado', uploadedAt: '2025-11-04' },
    ],
    stage: 'Pre Aprobación',
    payments: [],
  },
  {
    id: 'LN013',
    clientName: 'Javier López Blanco',
    email: 'javier.lopez@email.com',
    phone: '+54 11 4567-8901',
    propertyValue: 210000,
    loanAmount: 60000,
    months: 60,
    status: 'Pendiente',
    createdAt: '2025-11-08',
    dueDate: null,
    broker: 'Lorena Fuentes',
    location: 'Provincia de Buenos Aires - San Isidro',
    monthlyPayment: 1434,
    totalPayments: null,
    interestRate: 0.145,
    documents: [
      { name: 'DNI Frente', status: 'Pendiente', uploadedAt: null },
    ],
    stage: 'Solicitud Inicial',
    payments: [],
  },
  {
    id: 'LN014',
    clientName: 'Roxana Díaz Núñez',
    email: 'roxana.diaz@email.com',
    phone: '+54 11 5678-9012',
    propertyValue: 165000,
    loanAmount: 46000,
    months: 36,
    status: 'Activo',
    createdAt: '2025-09-05',
    dueDate: '2028-09-05',
    broker: 'Tomás Carrillo',
    location: 'CABA - Belgrano',
    monthlyPayment: 1380,
    totalPayments: 49680,
    interestRate: 0.125,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-09-06' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-09-07' },
      { name: 'Certificado de Propiedad', status: 'Verificado', uploadedAt: '2025-09-08' },
    ],
    stage: 'Aprobación',
    payments: Array.from({ length: 36 }, (_, i) => ({
      number: i + 1,
      dueDate: new Date(2025, 9 + i, 5).toLocaleDateString('es-AR'),
      amount: 1380,
      status: i < 10 ? 'Pagado' : i === 10 ? 'Próximo' : 'Pendiente',
    })),
  },
  {
    id: 'LN015',
    clientName: 'Verónica Salazar Ponce',
    email: 'veronica.salazar@email.com',
    phone: '+54 11 6789-0123',
    propertyValue: 195000,
    loanAmount: 55000,
    months: 48,
    status: 'Rechazado',
    createdAt: '2025-10-12',
    dueDate: null,
    broker: 'Ignacio Vargas',
    location: 'CABA - Caballito',
    monthlyPayment: 0,
    totalPayments: null,
    interestRate: 0.135,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-10-13' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-10-14' },
    ],
    stage: 'Scoring',
    rejectionReason: 'Score de crédito insuficiente. Se requiere reaseguramiento o incremento de patrimonio',
    payments: [],
  },
  {
    id: 'LN016',
    clientName: 'Oscar Medina Soto',
    email: 'oscar.medina@email.com',
    phone: '+54 11 7890-1234',
    propertyValue: 155000,
    loanAmount: 44000,
    months: 36,
    status: 'Activo',
    createdAt: '2025-08-01',
    dueDate: '2028-08-01',
    broker: 'Patricia Ochoa',
    location: 'CABA - San Cristóbal',
    monthlyPayment: 1320,
    totalPayments: 47520,
    interestRate: 0.125,
    documents: [
      { name: 'DNI Frente', status: 'Verificado', uploadedAt: '2025-08-02' },
      { name: 'Comprobante de Ingresos', status: 'Verificado', uploadedAt: '2025-08-03' },
      { name: 'Certificado de Propiedad', status: 'Verificado', uploadedAt: '2025-08-04' },
    ],
    stage: 'Aprobación',
    payments: Array.from({ length: 36 }, (_, i) => ({
      number: i + 1,
      dueDate: new Date(2025, 8 + i, 1).toLocaleDateString('es-AR'),
      amount: 1320,
      status: i < 14 ? 'Pagado' : i === 14 ? 'Próximo' : 'Pendiente',
    })),
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const formatCurrency = (num) => `USD ${num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pendiente: 'bg-gray-100 text-gray-800',
    'En proceso': 'bg-blue-100 text-blue-800',
    Observado: 'bg-orange-100 text-orange-800',
    Aprobado: 'bg-emerald-100 text-emerald-800',
    'Pendiente de liquidación': 'bg-purple-100 text-purple-800',
    Activo: 'bg-green-600 text-white',
    Rechazado: 'bg-red-100 text-red-800',
    Cancelado: 'bg-slate-100 text-slate-700',
  };

  const config = statusConfig[status] || 'bg-gray-100 text-gray-800';
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config}`}>{status}</span>;
};

const StageBadge = ({ stage }) => {
  const stageConfig = {
    'Solicitud Inicial': 'bg-slate-200 text-slate-800',
    'Scoring': 'bg-blue-200 text-blue-800',
    'Pre Aprobación': 'bg-cyan-200 text-cyan-800',
    'Escribanía': 'bg-purple-200 text-purple-800',
    'Aprobación': 'bg-green-200 text-green-800',
    'Escritura': 'bg-emerald-200 text-emerald-800',
  };

  const config = stageConfig[stage] || 'bg-gray-200 text-gray-800';
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config}`}>{stage}</span>;
};

const TextField = ({ label, type = 'text', value, onChange, placeholder, required = false, disabled = false }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
    />
  </div>
);

// ============================================================================
// LANDING PAGE
// ============================================================================

const LandingPage = ({ onNavigate, config }) => {
  const [loan, setLoan] = useState(30000);
  const [months, setMonths] = useState(36);
  const [property, setProperty] = useState(100000);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const montoBruto = useMemo(() => calcularBruto(loan), [loan]);
  const cuota = useMemo(() => calcularCuota(config.tasasBase[months], months, montoBruto), [loan, months, montoBruto, config.tasasBase]);
  const tir = useMemo(() => calcularTIR(cuota, months, loan), [cuota, months, loan]);
  const ltv = useMemo(() => (loan / property) * 100, [loan, property]);
  const maxAllowedLoan = useMemo(() => Math.min(property * config.maxLTV, config.maxLoan), [property, config.maxLTV, config.maxLoan]);

  const faqItems = [
    {
      question: '¿Cuál es el monto máximo que puedo solicitar?',
      answer: 'El monto máximo es hasta USD 50.000 o el 35% del valor de tu propiedad, lo que sea menor.',
    },
    {
      question: '¿Cuáles son los plazos disponibles?',
      answer: 'Ofrecemos plazos de 12, 24, 36, 48 y 60 meses según tus necesidades.',
    },
    {
      question: '¿Qué documentación necesito?',
      answer: 'DNI, comprobante de ingresos, certificado de propiedad y documentación tributaria básica.',
    },
    {
      question: '¿Cuánto tiempo tarda el proceso de aprobación?',
      answer: 'Entre 5 y 10 días hábiles desde que presentas la documentación completa.',
    },
    {
      question: '¿Hay comisiones escondidas?',
      answer: 'No. El 5% de comisión de originación se suma al préstamo y se paga en cuotas.',
    },
  ];

  const rateExamples = [
    { months: 12, rate: config.tasasBase[12], monthlyPayment: calcularCuota(config.tasasBase[12], 12, calcularBruto(30000)), totalPayment: calcularCuota(config.tasasBase[12], 12, calcularBruto(30000)) * 12 },
    { months: 24, rate: config.tasasBase[24], monthlyPayment: calcularCuota(config.tasasBase[24], 24, calcularBruto(30000)), totalPayment: calcularCuota(config.tasasBase[24], 24, calcularBruto(30000)) * 24 },
    { months: 36, rate: config.tasasBase[36], monthlyPayment: calcularCuota(config.tasasBase[36], 36, calcularBruto(30000)), totalPayment: calcularCuota(config.tasasBase[36], 36, calcularBruto(30000)) * 36 },
    { months: 48, rate: config.tasasBase[48], monthlyPayment: calcularCuota(config.tasasBase[48], 48, calcularBruto(30000)), totalPayment: calcularCuota(config.tasasBase[48], 48, calcularBruto(30000)) * 48 },
    { months: 60, rate: config.tasasBase[60], monthlyPayment: calcularCuota(config.tasasBase[60], 60, calcularBruto(30000)), totalPayment: calcularCuota(config.tasasBase[60], 60, calcularBruto(30000)) * 60 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo className="h-8" />
          <div className="flex gap-4">
            <button onClick={() => onNavigate('login')} className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition">
              Ingresar
            </button>
            <button onClick={() => onNavigate('register')} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Registrarse
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Financiá tu casa más cerca</h1>
            <p className="text-xl text-blue-100">Préstamos rápidos, seguros y transparentes para tu hogar</p>
          </div>

          {/* Simulator */}
          <div className="bg-white rounded-xl shadow-2xl p-8 text-gray-800 mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Simulador de Préstamos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Valor de la propiedad: {formatCurrency(property)}</label>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  step="5000"
                  value={property}
                  onChange={(e) => setProperty(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monto a solicitar: {formatCurrency(loan)}</label>
                <input
                  type="range"
                  min="5000"
                  max={maxAllowedLoan}
                  step="1000"
                  value={loan}
                  onChange={(e) => setLoan(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Plazo (meses)</label>
                <select value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value={12}>12 meses</option>
                  <option value={24}>24 meses</option>
                  <option value={36}>36 meses</option>
                  <option value={48}>48 meses</option>
                  <option value={60}>60 meses</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">LTV</p>
                  <p className={`text-2xl font-bold ${ltv <= 35 ? 'text-green-600' : 'text-red-600'}`}>{ltv.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Cuota Mensual</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(cuota)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Total a Pagar</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(cuota * months)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">TIR</p>
                  <p className="text-2xl font-bold text-gray-800">{(tir * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <button onClick={() => onNavigate('register')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Solicitar Préstamo
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cómo funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: 1, title: 'Simula', desc: 'Calcula tu cuota mensual en segundos' },
              { step: 2, title: 'Solicita', desc: 'Completa tu solicitud en línea' },
              { step: 3, title: 'Documenta', desc: 'Carga tus documentos de forma segura' },
              { step: 4, title: 'Aprueba', desc: 'Recibe respuesta en 5-10 días' },
              { step: 5, title: 'Recibe', desc: 'Obtén el dinero en tu cuenta' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-block w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-xl mb-4">{item.step}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rate Table */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tasas de Referencia (para USD 30.000)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-3">Plazo</th>
                  <th className="px-6 py-3">Tasa Anual</th>
                  <th className="px-6 py-3">Cuota Mensual</th>
                  <th className="px-6 py-3">Total a Pagar</th>
                </tr>
              </thead>
              <tbody>
                {rateExamples.map((item) => (
                  <tr key={item.months} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4 font-semibold">{item.months} meses</td>
                    <td className="px-6 py-4">{(item.rate * 100).toFixed(2)}%</td>
                    <td className="px-6 py-4 text-blue-600 font-semibold">{formatCurrency(item.monthlyPayment)}</td>
                    <td className="px-6 py-4">{formatCurrency(item.totalPayment)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-left">{item.question}</span>
                  <ChevronDown className={`transition-transform ${expandedFAQ === idx ? 'rotate-180' : ''}`} size={20} />
                </button>
                {expandedFAQ === idx && <div className="px-6 py-4 bg-gray-50 border-t text-gray-700">{item.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para financiar tu casa?</h2>
          <p className="text-lg mb-8 text-blue-100">Comienza ahora y obtén una respuesta en 5-10 días hábiles</p>
          <button onClick={() => onNavigate('register')} className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition inline-flex items-center gap-2">
            Iniciar Solicitud <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 Tu Casa +Cerca. Todos los derechos reservados. | Contacto: info@tucasa.local</p>
        </div>
      </footer>
    </div>
  );
};

// ============================================================================
// LOGIN PAGE
// ============================================================================

const LoginPage = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoUsers = [
    { email: 'admin@tcmc.local', password: 'Admin123!', role: 'backoffice', name: 'Admin' },
    { email: 'advisor@tcmc.local', password: 'Advisor123!', role: 'broker', name: 'Asesor' },
    { email: 'client@tcmc.local', password: 'Client123!', role: 'cliente', name: 'Cliente' },
  ];

  const doLogin = () => {
    setError('');
    if (!email || !password) {
      setError('Completá email y contraseña');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = demoUsers.find((u) => u.email === email && u.password === password);
      if (user) {
        onLogin({ name: user.name, email: user.email, role: user.role });
      } else {
        setError('Email o contraseña inválidos');
      }
      setLoading(false);
    }, 400);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    doLogin();
  };

  const quickLogin = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError('');
    setLoading(true);
    setTimeout(() => {
      onLogin({ name: demoUser.name, email: demoUser.email, role: demoUser.role });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        {/* Left branding */}
        <div className="hidden md:flex flex-col justify-center items-center text-white p-12">
          <Logo className="h-16 mb-8" />
          <h1 className="text-4xl font-bold mb-4 text-center">Tu Casa +Cerca</h1>
          <p className="text-lg text-blue-100 text-center">Financiamiento rápido y seguro para tu hogar</p>
        </div>

        {/* Right form */}
        <div className="flex flex-col justify-center items-center p-8 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Ingresar</h2>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">{error}</div>}

            <form onSubmit={handleLogin}>
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && doLogin()}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>Recuérdame</span>
                </label>
                <button type="button" className="text-blue-600 hover:underline">
                  Olvidé mi contraseña
                </button>
              </div>

              <button type="button" onClick={doLogin} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <div className="mt-6 border-t pt-6">
              <p className="text-sm text-gray-600 mb-3">Acceso rápido demo:</p>
              <div className="space-y-2">
                {demoUsers.map((u) => (
                  <button key={u.email} onClick={() => quickLogin(u)} className="w-full flex justify-between items-center px-4 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg text-sm transition">
                    <span className="font-mono text-gray-700">{u.email}</span>
                    <span className="text-blue-600 font-semibold text-xs uppercase">{u.role === 'backoffice' ? 'Back Office' : u.role === 'broker' ? 'Broker' : 'Cliente'}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              ¿Aún no tienes cuenta?{' '}
              <button onClick={() => onNavigate('register')} className="text-blue-600 font-semibold hover:underline">
                Registrarse
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// REGISTER PAGE
// ============================================================================

const RegisterPage = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.surname.trim()) newErrors.surname = 'El apellido es requerido';
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onLogin({ name: formData.name, email: formData.email, role: 'cliente' });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="hidden md:flex flex-col justify-center items-center text-white p-12">
          <Logo className="h-16 mb-8" />
          <h1 className="text-4xl font-bold mb-4 text-center">Únete a Tu Casa +Cerca</h1>
          <p className="text-lg text-blue-100 text-center">Accede a financiamiento transparente para tu hogar</p>
        </div>

        <div className="flex flex-col justify-center items-center p-8 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Crear Cuenta</h2>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Nombre"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Juan"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

              <TextField
                label="Apellido"
                value={formData.surname}
                onChange={(e) => handleChange('surname', e.target.value)}
                placeholder="García"
                required
              />
              {errors.surname && <p className="text-red-500 text-sm mb-2">{errors.surname}</p>}

              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="tu@email.com"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

              <TextField
                label="Teléfono"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+54 11 2345-6789"
                required
              />
              {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

              <TextField
                label="Confirmar Contraseña"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>}

              <div className="mb-6">
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input type="checkbox" required className="mt-1" />
                  <span>
                    Acepto los{' '}
                    <button type="button" className="text-blue-600 hover:underline">
                      términos y condiciones
                    </button>
                  </span>
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => onNavigate('login')} className="text-blue-600 font-semibold hover:underline">
                Ingresar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SIDEBAR NAVIGATION
// ============================================================================

const Sidebar = ({ role, view, onViewChange, onLogout, onRoleSwitch, user }) => {
  const clientNavigation = [
    { id: 'dashboard', label: 'Simulador', icon: Home },
    { id: 'nueva-solicitud', label: 'Nueva Solicitud', icon: Plus },
    { id: 'mi-solicitud', label: 'Mi Solicitud', icon: FileText },
    { id: 'pagos', label: 'Mis Pagos', icon: DollarSign },
    { id: 'soporte', label: 'Soporte', icon: Phone },
  ];

  const brokerNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'mis-clientes', label: 'Mis Clientes', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'docs', label: 'Documentos', icon: FileText },
  ];

  const backofficeNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'legajos', label: 'Gestión de Legajos', icon: FileText },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
    { id: 'config', label: 'Configuración', icon: Settings },
  ];

  const navigation = role === 'cliente' ? clientNavigation : role === 'broker' ? brokerNavigation : backofficeNavigation;

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <Logo className="h-8 mb-4" />
        <div className="text-xs text-slate-400">
          <p className="font-semibold">{user?.name}</p>
          <p>{user?.email}</p>
        </div>
      </div>

      {/* Role Switcher (Demo) */}
      <div className="p-4 border-b border-slate-700">
        <label className="text-xs font-semibold text-slate-400 uppercase block mb-2">Cambiar Rol (Demo)</label>
        <select
          value={role}
          onChange={(e) => onRoleSwitch(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-slate-800 text-white rounded border border-slate-700 focus:outline-none"
        >
          <option value="cliente">Cliente</option>
          <option value="broker">Asesor</option>
          <option value="backoffice">Back Office</option>
        </select>
      </div>

      <nav className="flex-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                view === item.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// DASHBOARD - CLIENTE
// ============================================================================

const ClienteDashboard = ({ view, onViewChange, config, loans, onUpdateConfig }) => {
  const [showNewSolicitud, setShowNewSolicitud] = useState(false);
  const [solicitudData, setSolicitudData] = useState({ propertyValue: 100000, loanAmount: 30000, months: 36 });
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [expandedPayment, setExpandedPayment] = useState(null);

  // Simulator state
  const [loan, setLoan] = useState(30000);
  const [months, setMonths] = useState(36);
  const [property, setProperty] = useState(100000);

  const montoBruto = useMemo(() => calcularBruto(loan), [loan]);
  const cuota = useMemo(() => calcularCuota(config.tasasBase[months], months, montoBruto), [loan, months, montoBruto, config.tasasBase]);
  const tir = useMemo(() => calcularTIR(cuota, months, loan), [cuota, months, loan]);
  const ltv = useMemo(() => (loan / property) * 100, [loan, property]);
  const maxAllowedLoan = useMemo(() => Math.min(property * config.maxLTV, config.maxLoan), [property, config.maxLTV, config.maxLoan]);

  if (view === 'dashboard') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Simulador de Préstamos</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-8">Calcula tu cuota mensual</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Valor de la propiedad: {formatCurrency(property)}</label>
              <input
                type="range"
                min="50000"
                max="500000"
                step="5000"
                value={property}
                onChange={(e) => setProperty(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Monto a solicitar: {formatCurrency(loan)}</label>
              <input
                type="range"
                min="5000"
                max={maxAllowedLoan}
                step="1000"
                value={loan}
                onChange={(e) => setLoan(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Plazo (meses)</label>
              <select value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value={12}>12 meses</option>
                <option value={24}>24 meses</option>
                <option value={36}>36 meses</option>
                <option value={48}>48 meses</option>
                <option value={60}>60 meses</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">LTV</p>
                <p className={`text-2xl font-bold ${ltv <= 35 ? 'text-green-600' : 'text-red-600'}`}>{ltv.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Cuota Mensual</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(cuota)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Total a Pagar</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(cuota * months)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">TIR</p>
                <p className="text-2xl font-bold text-gray-800">{(tir * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowNewSolicitud(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Solicitar con estos parámetros
          </button>
        </div>
      </div>
    );
  }

  if (view === 'nueva-solicitud') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Nueva Solicitud</h1>

        {showNewSolicitud && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-8">
              <h2 className="text-2xl font-bold mb-6">Crear Nueva Solicitud</h2>

              <div className="space-y-4">
                <TextField
                  label="Valor de la propiedad"
                  type="number"
                  value={solicitudData.propertyValue}
                  onChange={(e) => setSolicitudData({ ...solicitudData, propertyValue: Number(e.target.value) })}
                  required
                />

                <TextField
                  label="Monto a solicitar"
                  type="number"
                  value={solicitudData.loanAmount}
                  onChange={(e) => setSolicitudData({ ...solicitudData, loanAmount: Number(e.target.value) })}
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plazo (meses)</label>
                  <select
                    value={solicitudData.months}
                    onChange={(e) => setSolicitudData({ ...solicitudData, months: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={12}>12 meses</option>
                    <option value={24}>24 meses</option>
                    <option value={36}>36 meses</option>
                    <option value={48}>48 meses</option>
                    <option value={60}>60 meses</option>
                  </select>
                </div>

                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Tengo co-deudor</span>
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Confirmo ingresos verables</span>
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" required />
                  <span className="text-sm">Acepto términos y condiciones</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowNewSolicitud(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button onClick={() => setShowNewSolicitud(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Solicitar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Aún no has creado ninguna solicitud. Haz clic en "Nueva Solicitud" para comenzar.</p>
          <button onClick={() => setShowNewSolicitud(true)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Crear Solicitud
          </button>
        </div>
      </div>
    );
  }

  if (view === 'mi-solicitud') {
    const clientLoans = loans.filter((l) => l.status !== 'Cancelado');

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mi Solicitud</h1>

        {clientLoans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">No tienes solicitudes registradas.</p>
          </div>
        ) : (
          clientLoans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{loan.clientName}</h3>
                  <p className="text-gray-600">{loan.location}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={loan.status} />
                  <p className="text-sm text-gray-500 mt-1">{loan.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Monto Solicitado</p>
                  <p className="text-lg font-semibold">{formatCurrency(loan.loanAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Plazo</p>
                  <p className="text-lg font-semibold">{loan.months} meses</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Cuota Mensual</p>
                  <p className="text-lg font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Etapa</p>
                  <StageBadge stage={loan.stage} />
                </div>
              </div>

              {loan.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-red-800">Motivo del Rechazo:</p>
                  <p className="text-sm text-red-700">{loan.rejectionReason}</p>
                </div>
              )}

              {loan.observations && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-orange-800">Observaciones:</p>
                  <p className="text-sm text-orange-700">{loan.observations}</p>
                </div>
              )}

              {/* Stage timeline */}
              <div className="mb-6">
                <p className="font-semibold mb-4">Estado de Solicitud</p>
                <div className="space-y-3">
                  {['Solicitud Inicial', 'Scoring', 'Pre Aprobación', 'Escribanía', 'Aprobación', 'Escritura'].map((stg, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          ['Solicitud Inicial', 'Scoring', 'Pre Aprobación', 'Escribanía', 'Aprobación', 'Escritura'].indexOf(loan.stage) >= idx
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium">{stg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="mb-6">
                <p className="font-semibold mb-4">Documentación</p>
                <div className="space-y-2">
                  {loan.documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">{doc.name}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${doc.status === 'Verificado' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {loan.status !== 'Rechazado' && (
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                  {loan.status === 'Aprobado' ? 'Aceptar Oferta' : 'Subir Documentos'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  if (view === 'pagos') {
    const activeLoans = loans.filter((l) => l.status === 'Activo' && l.payments.length > 0);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mis Pagos</h1>

        {activeLoans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">No tienes pagos programados.</p>
          </div>
        ) : (
          activeLoans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{loan.clientName}</h3>
                    <p className="text-sm text-gray-600">Préstamo {loan.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-600">Próximo Pago:</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(loan.monthlyPayment)}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Cuota</th>
                      <th className="px-6 py-3 text-left font-semibold">Vencimiento</th>
                      <th className="px-6 py-3 text-right font-semibold">Monto</th>
                      <th className="px-6 py-3 text-center font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loan.payments.slice(0, 5).map((payment, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedPayment(expandedPayment === `${loan.id}-${idx}` ? null : `${loan.id}-${idx}`)}>
                        <td className="px-6 py-4 font-semibold">{payment.number}</td>
                        <td className="px-6 py-4">{payment.dueDate}</td>
                        <td className="px-6 py-4 text-right">{formatCurrency(payment.amount)}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              payment.status === 'Pagado'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'Próximo'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {loan.payments.length > 5 && <div className="px-6 py-4 text-center text-sm text-gray-600">+{loan.payments.length - 5} cuotas más</div>}
            </div>
          ))
        )}
      </div>
    );
  }

  if (view === 'soporte') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Centro de Soporte</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Phone className="text-blue-600 mb-3" size={32} />
            <h3 className="text-lg font-bold mb-2">Teléfono</h3>
            <p className="text-gray-600 mb-4">Llámanos de lunes a viernes, 9 a 18 hs</p>
            <p className="font-bold text-lg">+54 11 XXXX-XXXX</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Mail className="text-blue-600 mb-3" size={32} />
            <h3 className="text-lg font-bold mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Escribinos y responderemos en 24 hs</p>
            <p className="font-bold text-lg">soporte@tucasa.local</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Preguntas Frecuentes</h3>
          <ul className="space-y-3 text-gray-700">
            <li>- ¿Cómo puedo verificar el estado de mi solicitud?</li>
            <li>- ¿Puedo cambiar el plazo de mi préstamo?</li>
            <li>- ¿Cómo realizo mis pagos mensuales?</li>
            <li>- ¿Puedo hacer un pago anticipado sin penalidad?</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

// ============================================================================
// DASHBOARD - BROKER
// ============================================================================

const BrokerDashboard = ({ view, onViewChange, loans }) => {
  const brokerLoans = loans.filter((l) => l.broker === 'María Rodríguez');
  const activeCount = brokerLoans.filter((l) => l.status === 'Activo').length;
  const managedVolume = brokerLoans.reduce((sum, l) => sum + l.loanAmount, 0);
  const estimatedCommission = managedVolume * 0.02;

  if (view === 'dashboard') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard de Asesor</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm uppercase font-semibold">Préstamos Activos</p>
                <p className="text-3xl font-bold mt-2">{activeCount}</p>
              </div>
              <Zap className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm uppercase font-semibold">Volumen Administrado</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(managedVolume)}</p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm uppercase font-semibold">Comisiones Estimadas</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(estimatedCommission)}</p>
              </div>
              <TrendingUp className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Resumen de Cartera</h2>
          <div className="space-y-2">
            <p className="text-gray-700">Total de clientes: <span className="font-bold">{brokerLoans.length}</span></p>
            <p className="text-gray-700">En proceso: <span className="font-bold">{brokerLoans.filter((l) => l.status === 'En proceso').length}</span></p>
            <p className="text-gray-700">Aprobados: <span className="font-bold">{brokerLoans.filter((l) => l.status === 'Aprobado').length}</span></p>
            <p className="text-gray-700">Activos: <span className="font-bold">{activeCount}</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'mis-clientes') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mis Clientes</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Cliente</th>
                <th className="px-6 py-3 text-left font-semibold">Monto</th>
                <th className="px-6 py-3 text-left font-semibold">Plazo</th>
                <th className="px-6 py-3 text-center font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {brokerLoans.map((loan) => (
                <tr key={loan.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{loan.clientName}</p>
                      <p className="text-xs text-gray-500">{loan.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatCurrency(loan.loanAmount)}</td>
                  <td className="px-6 py-4">{loan.months} meses</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={loan.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === 'pipeline') {
    const stages = ['Solicitud Inicial', 'Scoring', 'Pre Aprobación', 'Escribanía', 'Aprobación', 'Escritura'];
    const stageCounts = stages.map((stage) => brokerLoans.filter((l) => l.stage === stage).length);
    const maxCount = Math.max(...stageCounts);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Pipeline de Solicitudes</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {stages.map((stage, idx) => (
              <div key={stage}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-700">{stage}</p>
                  <p className="text-sm font-bold text-blue-600">{stageCounts[idx]} solicitudes</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(stageCounts[idx] / (maxCount || 1)) * 100}%` }}
                  >
                    {stageCounts[idx] > 0 && stageCounts[idx]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'docs') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Documentos</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Documentos Pendientes</h2>
          <div className="space-y-3">
            {brokerLoans
              .flatMap((loan) => loan.documents.filter((d) => d.status === 'Pendiente').map((d) => ({ ...d, loanId: loan.id, clientName: loan.clientName })))
              .map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{doc.name}</p>
                    <p className="text-sm text-gray-600">{doc.clientName} ({doc.loanId})</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Solicitar</button>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ============================================================================
// DASHBOARD - BACKOFFICE
// ============================================================================

const BackofficeDashboard = ({ view, onViewChange, loans, config, onUpdateConfig }) => {
  const activeLoans = loans.filter((l) => l.status === 'Activo').length;
  const totalVolume = loans.reduce((sum, l) => sum + l.loanAmount, 0);
  const pendingLoans = loans.filter((l) => ['Pendiente', 'En proceso', 'Observado'].includes(l.status)).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedReport, setSelectedReport] = useState('unconfirmed');
  const [editingConfig, setEditingConfig] = useState(null);
  const [configForm, setConfigForm] = useState(config);

  if (view === 'dashboard') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Back Office</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm uppercase font-semibold">Préstamos Activos</p>
            <p className="text-3xl font-bold mt-2">{activeLoans}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm uppercase font-semibold">Volumen Total</p>
            <p className="text-3xl font-bold mt-2">{formatCurrency(totalVolume)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <p className="text-gray-600 text-sm uppercase font-semibold">Pendientes de Revisión</p>
            <p className="text-3xl font-bold mt-2">{pendingLoans}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Solicitudes por Estado</h2>
            <div className="space-y-3">
              {['Pendiente', 'En proceso', 'Observado', 'Aprobado', 'Activo', 'Rechazado', 'Cancelado'].map((status) => (
                <div key={status} className="flex justify-between items-center">
                  <p className="text-gray-700">{status}</p>
                  <p className="font-bold text-blue-600">{loans.filter((l) => l.status === status).length}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Alertas</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <AlertCircle className="text-orange-600" size={18} />
                <span>{loans.filter((l) => l.status === 'Observado').length} solicitudes con observaciones</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="text-blue-600" size={18} />
                <span>{loans.filter((l) => l.status === 'Pendiente').length} solicitudes pendientes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={18} />
                <span>{loans.filter((l) => l.status === 'Aprobado').length} aprobadas sin desembolsar</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'legajos') {
    const filteredLoans = loans.filter(
      (l) =>
        l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Legajos</h1>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex gap-2">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por cliente, ID o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
          </div>
        </div>

        {selectedLoan ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button onClick={() => setSelectedLoan(null)} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Volver
            </button>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Cliente</p>
                <p className="text-xl font-bold">{selectedLoan.clientName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Préstamo ID</p>
                <p className="text-xl font-bold">{selectedLoan.id}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Monto</p>
                <p className="text-xl font-bold">{formatCurrency(selectedLoan.loanAmount)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Estado</p>
                <StatusBadge status={selectedLoan.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-bold mb-3">Datos del Cliente</h3>
                <div className="space-y-2 text-sm">
                  <p>Email: {selectedLoan.email}</p>
                  <p>Teléfono: {selectedLoan.phone}</p>
                  <p>Propiedad: {selectedLoan.location}</p>
                  <p>Valor Propiedad: {formatCurrency(selectedLoan.propertyValue)}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-bold mb-3">Documentos</h3>
                <div className="space-y-2 text-sm">
                  {selectedLoan.documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{doc.name}</span>
                      <span className={`text-xs font-bold ${doc.status === 'Verificado' ? 'text-green-600' : 'text-orange-600'}`}>{doc.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left font-semibold">Monto</th>
                  <th className="px-6 py-3 text-left font-semibold">Estado</th>
                  <th className="px-6 py-3 text-center font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{loan.clientName}</p>
                        <p className="text-xs text-gray-500">{loan.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{formatCurrency(loan.loanAmount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => setSelectedLoan(loan)} className="px-4 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (view === 'reportes') {
    const reports = {
      unconfirmed: loans.filter((l) => ['Pendiente', 'En proceso'].includes(l.status)),
      duedates: loans.filter((l) => l.dueDate).map((l) => ({ ...l, daysUntilDue: 30 })),
      pipeline: loans,
      trust: loans.filter((l) => l.status === 'Pendiente de liquidación'),
    };

    const currentReport = reports[selectedReport] || [];

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reportes</h1>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'unconfirmed', label: 'Pagos No Confirmados' },
            { key: 'duedates', label: 'Vencimientos' },
            { key: 'pipeline', label: 'Pipeline Completo' },
            { key: 'trust', label: 'Posición Fiduciaria' },
          ].map((report) => (
            <button
              key={report.key}
              onClick={() => setSelectedReport(report.key)}
              className={`px-4 py-2 rounded font-semibold text-sm transition ${
                selectedReport === report.key ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {report.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Cliente</th>
                <th className="px-6 py-3 text-left font-semibold">Monto</th>
                <th className="px-6 py-3 text-left font-semibold">Estado</th>
                <th className="px-6 py-3 text-left font-semibold">Etapa</th>
              </tr>
            </thead>
            <tbody>
              {currentReport.map((loan) => (
                <tr key={loan.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{loan.clientName}</td>
                  <td className="px-6 py-4">{formatCurrency(loan.loanAmount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={loan.status} />
                  </td>
                  <td className="px-6 py-4">
                    <StageBadge stage={loan.stage} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === 'config') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Parámetros de Préstamo</h2>

          {!editingConfig ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border rounded-lg p-4">
                  <p className="text-gray-600 text-sm">LTV Máximo</p>
                  <p className="text-3xl font-bold">{(config.maxLTV * 100).toFixed(0)}%</p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Préstamo Máximo</p>
                  <p className="text-3xl font-bold">{formatCurrency(config.maxLoan)}</p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Tasas Configuradas</p>
                  <p className="text-3xl font-bold">{Object.keys(config.tasasBase).length}</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4">Tasas de Referencia</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(config.tasasBase).map(([meses, tasa]) => (
                  <div key={meses} className="border rounded-lg p-4 text-center">
                    <p className="text-gray-600 text-sm">{meses} meses</p>
                    <p className="text-2xl font-bold text-blue-600">{(tasa * 100).toFixed(2)}%</p>
                  </div>
                ))}
              </div>

              <button onClick={() => setEditingConfig(true)} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                Editar Configuración
              </button>
            </>
          ) : (
            <>
              <div className="space-y-6 mb-6">
                <TextField
                  label="LTV Máximo (como decimal, ej: 0.35)"
                  type="number"
                  step="0.01"
                  value={configForm.maxLTV}
                  onChange={(e) => setConfigForm({ ...configForm, maxLTV: Number(e.target.value) })}
                />

                <TextField
                  label="Préstamo Máximo (USD)"
                  type="number"
                  value={configForm.maxLoan}
                  onChange={(e) => setConfigForm({ ...configForm, maxLoan: Number(e.target.value) })}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Tasas por Plazo</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(configForm.tasasBase).map(([meses, tasa]) => (
                      <div key={meses}>
                        <label className="text-xs text-gray-600">{meses} meses</label>
                        <input
                          type="number"
                          step="0.001"
                          value={tasa}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              tasasBase: { ...configForm.tasasBase, [meses]: Number(e.target.value) },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onUpdateConfig(configForm);
                    setEditingConfig(false);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                >
                  Guardar Cambios
                </button>
                <button onClick={() => setEditingConfig(false)} className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold">
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('cliente');
  const [view, setView] = useState('dashboard');
  const [config, setConfig] = useState(CONFIG_DEFAULTS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loans, setLoans] = useState(MOCK_LOANS);

  const handleNavigate = (newPage) => {
    setPage(newPage);
    setView('dashboard');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setRole(userData.role);
    setPage('app');
    setView('dashboard');
  };

  const handleLogout = () => {
    setPage('landing');
    setUser(null);
    setView('dashboard');
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setView('dashboard');
  };

  const handleUpdateConfig = (newConfig) => {
    setConfig(newConfig);
  };

  // Landing Page
  if (page === 'landing') {
    return <LandingPage onNavigate={handleNavigate} config={config} />;
  }

  // Login Page
  if (page === 'login') {
    return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  // Register Page
  if (page === 'register') {
    return <RegisterPage onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  // Dashboard
  if (page === 'app') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar role={role} view={view} onViewChange={setView} onLogout={handleLogout} onRoleSwitch={handleRoleSwitch} user={user} />

        <div className="ml-64 flex-1 overflow-auto">
          <div className="p-8">
            {role === 'cliente' && <ClienteDashboard view={view} onViewChange={setView} config={config} loans={loans} onUpdateConfig={handleUpdateConfig} />}

            {role === 'broker' && <BrokerDashboard view={view} onViewChange={setView} loans={loans} />}

            {role === 'backoffice' && <BackofficeDashboard view={view} onViewChange={setView} loans={loans} config={config} onUpdateConfig={handleUpdateConfig} />}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
