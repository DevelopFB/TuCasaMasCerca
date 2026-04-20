
export type Role = 'Back Office' | 'Broker' | 'Cliente' | 'Inversor' | 'Oficina' | 'Fideicomiso';

export type LoanStatus = 
  | 'Pendiente' 
  | 'En proceso' 
  | 'Observado' 
  | 'Aprobado' 
  | 'Pendiente de liquidación' 
  | 'Activo'
  | 'Rechazado'
  | 'Cancelado / Finalizado';

export interface PaymentInstallment {
  numero: number;
  vencimiento: string;
  monto: number;
  estado: 'Pendiente' | 'En revisión' | 'Pagado' | 'Vencido';
  comprobante?: string; // Nombre del archivo
  fechaPago?: string;
}

export interface LoanRecord {
  id: string;
  nroLegajo: string;
  fechaSolicitud: string;
  cliente: string;
  montoSolicitado: number;
  montoAprobado?: number; // New field for the actual approved amount
  valorInmueble: number;
  oficina: string;
  broker: string;
  estado: LoanStatus;
  ofertaAceptada?: boolean; // Client explicit acceptance
  motivoRechazo?: string; // Reason for rejection
  // Settlement details
  liquidacion?: {
    fechaEscritura: string;
    montoDesembolsado: number;
    cantidadCuotas: number;
    montoPrimerCuota: number;
    escribano: string;
  };
  // Payment Schedule
  pagos?: PaymentInstallment[];
  detalles: {
    dni: string;
    email: string;
    telefono: string;
    documentacion: {
      nombre: string;
      estado: 'Cargado' | 'Faltante' | 'Observado';
    }[];
  };
}
