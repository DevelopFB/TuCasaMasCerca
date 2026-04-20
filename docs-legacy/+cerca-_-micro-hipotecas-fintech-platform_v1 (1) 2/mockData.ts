
import { LoanRecord } from './types';

export const MOCK_PROPERTIES = [
  { id: 'PROP-001', direccion: 'Av. Libertador 2400, Piso 5', valor: 120000, oficina: 'Belgrano' },
  { id: 'PROP-002', direccion: 'Juramento 1500, PB', valor: 85000, oficina: 'Belgrano' },
  { id: 'PROP-003', direccion: 'Olivos, Calle Corrientes 400', valor: 210000, oficina: 'Norte' },
  { id: 'PROP-004', direccion: 'Puerto Madero, Dock 3', valor: 350000, oficina: 'Puerto Madero' },
  { id: 'PROP-005', direccion: 'Caballito, Av. Rivadavia 5000', valor: 95000, oficina: 'Central' },
];

export const MOCK_LOANS: LoanRecord[] = [
  // --- PENDIENTE (2 Casos) ---
  {
    id: '1',
    nroLegajo: 'LEG-2024-001',
    fechaSolicitud: '2024-06-01',
    cliente: 'Sofía Martínez',
    montoSolicitado: 25000,
    valorInmueble: 90000,
    oficina: 'Central',
    broker: 'Maria Gonzalez',
    estado: 'Pendiente',
    detalles: {
      dni: '27-11223344-5',
      email: 'sofia.m@email.com',
      telefono: '+54 11 1122-3344',
      documentacion: [
        { nombre: 'DNI Frontal', estado: 'Cargado' },
        { nombre: 'Recibo de Sueldo', estado: 'Faltante' }
      ]
    }
  },
  {
    id: '2',
    nroLegajo: 'LEG-2024-002',
    fechaSolicitud: '2024-06-02',
    cliente: 'Lucas Ferrari',
    montoSolicitado: 40000,
    valorInmueble: 150000,
    oficina: 'Recoleta',
    broker: 'Sin Broker',
    estado: 'Pendiente',
    detalles: {
      dni: '20-55667788-9',
      email: 'lucas.f@email.com',
      telefono: '+54 11 9988-7766',
      documentacion: [
        { nombre: 'DNI Frontal', estado: 'Cargado' },
        { nombre: 'Escritura', estado: 'Cargado' }
      ]
    }
  },

  // --- EN PROCESO (2 Casos) ---
  {
    id: '3',
    nroLegajo: 'LEG-2024-003',
    fechaSolicitud: '2024-05-28',
    cliente: 'Mariana López',
    montoSolicitado: 15000,
    valorInmueble: 60000,
    oficina: 'Central',
    broker: 'Carlos Ruiz',
    estado: 'En proceso',
    detalles: {
      dni: '27-99887766-1',
      email: 'mariana.l@email.com',
      telefono: '+54 11 5544-3322',
      documentacion: [
        { nombre: 'DNI Frontal', estado: 'Cargado' },
        { nombre: 'Informe de Dominio', estado: 'Cargado' }
      ]
    }
  },
  {
    id: '4',
    nroLegajo: 'LEG-2024-004',
    fechaSolicitud: '2024-05-29',
    cliente: 'Esteban Quito',
    montoSolicitado: 30000,
    valorInmueble: 110000,
    oficina: 'Belgrano',
    broker: 'Roberto Gomez',
    estado: 'En proceso',
    detalles: {
      dni: '20-44332211-0',
      email: 'esteban.q@email.com',
      telefono: '+54 11 6677-8899',
      documentacion: [
        { nombre: 'DNI Frontal', estado: 'Cargado' },
        { nombre: 'Tasación', estado: 'Cargado' }
      ]
    }
  },

  // --- OBSERVADO (2 Casos) ---
  {
    id: '5',
    nroLegajo: 'LEG-2024-005',
    fechaSolicitud: '2024-05-20',
    cliente: 'Julián Weich',
    montoSolicitado: 50000,
    valorInmueble: 200000,
    oficina: 'San Isidro',
    broker: 'Ricardo Perez',
    estado: 'Observado',
    detalles: {
      dni: '20-11112222-3',
      email: 'julian.w@email.com',
      telefono: '+54 11 3333-4444',
      documentacion: [
        { nombre: 'DNI Frontal', estado: 'Cargado' },
        { nombre: 'Informe Veraz', estado: 'Observado' } // Observación aquí
      ]
    }
  },
  {
    id: '6',
    nroLegajo: 'LEG-2024-006',
    fechaSolicitud: '2024-05-21',
    cliente: 'Ana Karenina',
    montoSolicitado: 20000,
    valorInmueble: 70000,
    oficina: 'Central',
    broker: 'Sin Broker',
    estado: 'Observado',
    detalles: {
      dni: '27-55556666-7',
      email: 'ana.k@email.com',
      telefono: '+54 11 7777-8888',
      documentacion: [
        { nombre: 'Título de Propiedad', estado: 'Observado' },
        { nombre: 'DNI Dorso', estado: 'Cargado' }
      ]
    }
  },

  // --- APROBADO (2 Casos) ---
  {
    id: '7',
    nroLegajo: 'LEG-2024-007',
    fechaSolicitud: '2024-05-15',
    cliente: 'Roberto Gómez',
    montoSolicitado: 18000,
    montoAprobado: 18000,
    valorInmueble: 80000,
    oficina: 'Palermo',
    broker: 'Julio Sosa',
    estado: 'Aprobado',
    ofertaAceptada: false, // Esperando aceptación del cliente
    detalles: {
      dni: '20-99990000-1',
      email: 'roberto.g@email.com',
      telefono: '+54 11 2222-3333',
      documentacion: [
        { nombre: 'DNI Frontal', estado: 'Cargado' },
        { nombre: 'Aprobación Crediticia', estado: 'Cargado' }
      ]
    }
  },
  {
    id: '8',
    nroLegajo: 'LEG-2024-008',
    fechaSolicitud: '2024-05-16',
    cliente: 'Laura Pausini',
    montoSolicitado: 35000,
    montoAprobado: 32000, // Monto ajustado
    valorInmueble: 120000,
    oficina: 'Central',
    broker: 'Carlos Ruiz',
    estado: 'Aprobado',
    ofertaAceptada: true, // Cliente aceptó, falta pasar a liquidación
    detalles: {
      dni: '27-12341234-5',
      email: 'laura.p@email.com',
      telefono: '+54 11 4321-4321',
      documentacion: [
        { nombre: 'DNI Frontal', estado: 'Cargado' },
        { nombre: 'Aprobación Técnica', estado: 'Cargado' }
      ]
    }
  },

  // --- RECHAZADO (2 Casos) ---
  {
    id: '9',
    nroLegajo: 'LEG-2024-009',
    fechaSolicitud: '2024-05-10',
    cliente: 'Pedro Picapiedra',
    montoSolicitado: 60000,
    valorInmueble: 100000, // LTV muy alto (60%)
    oficina: 'Central',
    broker: 'Sin Broker',
    estado: 'Rechazado',
    detalles: {
      dni: '20-00000001-9',
      email: 'pedro.p@email.com',
      telefono: '+54 11 0000-0001',
      documentacion: [
        { nombre: 'Informe de Riesgo', estado: 'Cargado' }
      ]
    }
  },
  {
    id: '10',
    nroLegajo: 'LEG-2024-010',
    fechaSolicitud: '2024-05-11',
    cliente: 'Vilma Palma',
    montoSolicitado: 10000,
    valorInmueble: 30000, // Propiedad de bajo valor
    oficina: 'Recoleta',
    broker: 'Roberto Gomez',
    estado: 'Rechazado',
    detalles: {
      dni: '27-00000002-8',
      email: 'vilma.p@email.com',
      telefono: '+54 11 0000-0002',
      documentacion: [
        { nombre: 'Tasación', estado: 'Cargado' }
      ]
    }
  },

  // --- PENDIENTE DE LIQUIDACIÓN (2 Casos) ---
  {
    id: '11',
    nroLegajo: 'LEG-2024-011',
    fechaSolicitud: '2024-05-05',
    cliente: 'Diego Maradona',
    montoSolicitado: 45000,
    montoAprobado: 45000,
    valorInmueble: 200000,
    oficina: 'Central',
    broker: 'Maria Gonzalez',
    estado: 'Pendiente de liquidación',
    ofertaAceptada: true,
    detalles: {
      dni: '20-10101010-0',
      email: 'diego.m@email.com',
      telefono: '+54 11 1010-1010',
      documentacion: [
        { nombre: 'Borrador Escritura', estado: 'Cargado' },
        { nombre: 'Seguro de Vida', estado: 'Cargado' }
      ]
    }
  },
  {
    id: '12',
    nroLegajo: 'LEG-2024-012',
    fechaSolicitud: '2024-05-06',
    cliente: 'Lionel Messi',
    montoSolicitado: 50000,
    montoAprobado: 50000,
    valorInmueble: 250000,
    oficina: 'San Isidro',
    broker: 'Fernanda Diaz',
    estado: 'Pendiente de liquidación',
    ofertaAceptada: true,
    detalles: {
      dni: '20-10101010-1',
      email: 'lio.m@email.com',
      telefono: '+54 11 1010-1011',
      documentacion: [
        { nombre: 'Fecha de Firma', estado: 'Cargado' },
        { nombre: 'CBU Destino', estado: 'Cargado' }
      ]
    }
  },

  // --- ACTIVO (2 Casos) ---
  {
    id: '13',
    nroLegajo: 'LEG-2024-013',
    fechaSolicitud: '2024-01-15',
    cliente: 'Carlos Gomez',
    montoSolicitado: 18000,
    montoAprobado: 18000,
    valorInmueble: 60000,
    oficina: 'Central',
    broker: 'Carlos Ruiz',
    estado: 'Activo',
    liquidacion: {
        fechaEscritura: '2024-02-01',
        montoDesembolsado: 18000,
        cantidadCuotas: 24,
        montoPrimerCuota: 840,
        escribano: 'Dra. Lopez'
    },
    pagos: [
        { numero: 1, vencimiento: '2024-03-10', monto: 840, estado: 'Pagado', fechaPago: '2024-03-05', comprobante: 'transfer_01.pdf' },
        { numero: 2, vencimiento: '2024-04-10', monto: 840, estado: 'Pagado', fechaPago: '2024-04-08', comprobante: 'transfer_02.pdf' },
        { numero: 3, vencimiento: '2024-05-10', monto: 840, estado: 'Pendiente' },
        { numero: 4, vencimiento: '2024-06-10', monto: 840, estado: 'Pendiente' }
    ],
    detalles: {
      dni: '20-33445566-9',
      email: 'carlos.gomez@email.com',
      telefono: '+54 11 4455-6677',
      documentacion: [
        { nombre: 'Escritura', estado: 'Cargado' },
        { nombre: 'Mutuo', estado: 'Cargado' }
      ]
    }
  },
  {
    id: '14',
    nroLegajo: 'LEG-2024-014',
    fechaSolicitud: '2023-11-20',
    cliente: 'Gabriela Sabatini',
    montoSolicitado: 22000,
    montoAprobado: 22000,
    valorInmueble: 90000,
    oficina: 'Central',
    broker: 'Sin Broker',
    estado: 'Activo',
    liquidacion: {
        fechaEscritura: '2023-12-15',
        montoDesembolsado: 22000,
        cantidadCuotas: 12,
        montoPrimerCuota: 1950,
        escribano: 'Dr. Bilardo'
    },
    pagos: [
        { numero: 1, vencimiento: '2024-01-10', monto: 1950, estado: 'Pagado', fechaPago: '2024-01-08' },
        { numero: 2, vencimiento: '2024-02-10', monto: 1950, estado: 'Pagado', fechaPago: '2024-02-09' },
        { numero: 3, vencimiento: '2024-03-10', monto: 1950, estado: 'Pagado', fechaPago: '2024-03-10' },
        { numero: 4, vencimiento: '2024-04-10', monto: 1950, estado: 'En revisión', fechaPago: '2024-04-10', comprobante: 'comprobante_abril.jpg' },
        { numero: 5, vencimiento: '2024-05-10', monto: 1950, estado: 'Pendiente' }
    ],
    detalles: {
      dni: '27-11111111-1',
      email: 'gaby.s@email.com',
      telefono: '+54 11 1111-1111',
      documentacion: [
        { nombre: 'Escritura', estado: 'Cargado' }
      ]
    }
  },

  // --- CANCELADO / FINALIZADO (2 Casos) ---
  {
    id: '15',
    nroLegajo: 'LEG-2023-015',
    fechaSolicitud: '2023-01-10',
    cliente: 'Ricardo Darín',
    montoSolicitado: 10000,
    montoAprobado: 10000,
    valorInmueble: 50000,
    oficina: 'Palermo',
    broker: 'Ana Silva',
    estado: 'Cancelado / Finalizado',
    liquidacion: {
        fechaEscritura: '2023-02-01',
        montoDesembolsado: 10000,
        cantidadCuotas: 6,
        montoPrimerCuota: 1750,
        escribano: 'Esc. Pinti'
    },
    pagos: [
        { numero: 1, vencimiento: '2023-03-01', monto: 1750, estado: 'Pagado', fechaPago: '2023-02-28' },
        { numero: 2, vencimiento: '2023-04-01', monto: 1750, estado: 'Pagado', fechaPago: '2023-03-30' },
        { numero: 3, vencimiento: '2023-05-01', monto: 1750, estado: 'Pagado', fechaPago: '2023-04-29' },
        { numero: 4, vencimiento: '2023-06-01', monto: 1750, estado: 'Pagado', fechaPago: '2023-05-28' },
        { numero: 5, vencimiento: '2023-07-01', monto: 1750, estado: 'Pagado', fechaPago: '2023-06-28' },
        { numero: 6, vencimiento: '2023-08-01', monto: 1750, estado: 'Pagado', fechaPago: '2023-07-28' }
    ],
    detalles: {
      dni: '20-22222222-2',
      email: 'ricardo.d@email.com',
      telefono: '+54 11 2222-2222',
      documentacion: [
        { nombre: 'Libre Deuda', estado: 'Cargado' }
      ]
    }
  },
  {
    id: '16',
    nroLegajo: 'LEG-2023-016',
    fechaSolicitud: '2023-03-15',
    cliente: 'Susana Giménez',
    montoSolicitado: 25000,
    montoAprobado: 25000,
    valorInmueble: 150000,
    oficina: 'Recoleta',
    broker: 'Sin Broker',
    estado: 'Cancelado / Finalizado',
    liquidacion: {
        fechaEscritura: '2023-04-01',
        montoDesembolsado: 25000,
        cantidadCuotas: 12, // Cancelación anticipada
        montoPrimerCuota: 2200,
        escribano: 'Esc. Gasalla'
    },
    pagos: [
        { numero: 1, vencimiento: '2023-05-01', monto: 2200, estado: 'Pagado', fechaPago: '2023-05-01' },
        { numero: 2, vencimiento: '2023-06-01', monto: 23000, estado: 'Pagado', fechaPago: '2023-06-15' } // Pago grande de cancelación
    ],
    detalles: {
      dni: '27-33333333-3',
      email: 'su.g@email.com',
      telefono: '+54 11 3333-3333',
      documentacion: [
        { nombre: 'Cancelación Hipoteca', estado: 'Cargado' }
      ]
    }
  }
];
