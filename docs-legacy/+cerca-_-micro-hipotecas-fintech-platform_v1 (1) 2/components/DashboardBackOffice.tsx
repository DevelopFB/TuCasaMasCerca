
import React, { useState } from 'react';
import { 
  Users, 
  HandCoins, 
  FileClock, 
  Download, 
  ArrowUpRight, 
  Eye,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Banknote,
  Check,
  FileText,
  ExternalLink,
  User,
  Mail,
  Phone,
  Building,
  Save,
  X,
  FileSignature
} from 'lucide-react';
import { LoanRecord, LoanStatus } from '../types';
import KPICard from './KPICard';

interface Props {
  loans: LoanRecord[];
  onOpenDetail: (loan: LoanRecord) => void;
  onConfirmPayment?: (loanId: string, installmentNumber: number) => void;
  onAddLoan?: (loan: LoanRecord) => void;
}

const StatusBadge: React.FC<{ status: LoanStatus }> = ({ status }) => {
  const styles: Record<LoanStatus, string> = {
    'Pendiente': 'bg-gray-100 text-gray-700 border-gray-200',
    'En proceso': 'bg-blue-50 text-blue-700 border-blue-200',
    'Observado': 'bg-orange-50 text-orange-700 border-orange-200',
    'Aprobado': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pendiente de liquidación': 'bg-purple-50 text-purple-700 border-purple-200',
    'Activo': 'bg-emerald-600 text-white border-emerald-700',
    'Rechazado': 'bg-red-50 text-red-700 border-red-200',
    'Cancelado / Finalizado': 'bg-slate-200 text-slate-600 border-slate-300'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

// --- VIEW 1: DASHBOARD OVERVIEW (Strategic View) ---
export const DashboardOverview: React.FC<Props> = ({ loans, onOpenDetail, onConfirmPayment, onAddLoan }) => {
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  
  // New Request Form State
  const [formData, setFormData] = useState({
      nombre: '',
      dni: '',
      email: '',
      telefono: '',
      monto: '',
      valorPropiedad: ''
  });
  const [dniSearched, setDniSearched] = useState(false);

  // Filter for priority items
  const priorityLoans = loans.filter(l => l.estado === 'Observado' || l.estado === 'Pendiente').slice(0, 4);
  const liquidationLoans = loans.filter(l => l.estado === 'Pendiente de liquidación');

  // Filter for Pending Payments (En revisión)
  const pendingPayments = loans.flatMap(l => 
    l.pagos ? l.pagos.filter(p => p.estado === 'En revisión').map(p => ({
        ...p, 
        loanId: l.id, 
        legajo: l.nroLegajo, 
        cliente: l.cliente
    })) : []
  );

  const handleDniSearch = () => {
    if (formData.dni.length > 6) {
        // Mock search: if DNI is "11111111", assume existing client
        if (formData.dni === '11111111') {
            setFormData(prev => ({
                ...prev,
                nombre: 'Cliente Existente Demo',
                email: 'cliente@demo.com',
                telefono: '+54 11 1234-5678'
            }));
        }
        setDniSearched(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddLoan) {
      const newLoan: LoanRecord = {
        id: Date.now().toString(),
        nroLegajo: `LEG-2024-${Math.floor(Math.random() * 9000) + 1000}`,
        fechaSolicitud: new Date().toISOString().split('T')[0],
        cliente: formData.nombre,
        montoSolicitado: Number(formData.monto),
        valorInmueble: Number(formData.valorPropiedad),
        oficina: 'Central', 
        broker: 'Originación Directa BO', 
        estado: 'Pendiente',
        detalles: {
          dni: formData.dni,
          email: formData.email,
          telefono: formData.telefono,
          documentacion: [
            { nombre: 'DNI Frontal', estado: 'Faltante' },
            { nombre: 'Reserva de Compra', estado: 'Faltante' },
            { nombre: 'Tasación', estado: 'Faltante' } 
          ]
        }
      };
      onAddLoan(newLoan);
      setShowNewClientModal(false);
      setFormData({ nombre: '', dni: '', email: '', telefono: '', monto: '', valorPropiedad: '' });
      setDniSearched(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
          <p className="text-slate-500 mt-1">Resumen ejecutivo y alertas de gestión.</p>
        </div>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
           Última actualización: <span className="font-bold text-slate-700">Hace 5 minutos</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Créditos Activos" 
          value={loans.filter(l => l.estado === 'Activo').length.toString()} 
          trend="+8%" 
          icon={<HandCoins size={24} />} 
        />
        <KPICard 
          label="Monto Total Prestable" 
          value="USD 2.450.000" 
          trend="+12%" 
          icon={<ArrowUpRight size={24} />} 
        />
        <KPICard 
          label="Solicitudes Pendientes" 
          value={loans.filter(l => l.estado === 'Pendiente' || l.estado === 'En proceso').length.toString()} 
          trend="-3%" 
          icon={<FileClock size={24} />} 
        />
      </div>

      {/* LIQUIDATION QUEUE (High Priority) */}
      {liquidationLoans.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 text-white shadow-xl shadow-purple-900/20 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FileSignature size={24} className="text-purple-300"/>
                            Mesa de Escritura y Liquidación
                        </h2>
                        <p className="text-purple-200 mt-1 text-sm opacity-80">
                            Hay <span className="font-bold text-white">{liquidationLoans.length} operaciones</span> con oferta aceptada por el cliente listas para escriturar.
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {liquidationLoans.map(loan => (
                        <div 
                            key={loan.id} 
                            onClick={() => onOpenDetail(loan)}
                            className="bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-md flex justify-between items-center hover:bg-white/20 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center font-bold text-white border border-purple-400/50">
                                    {loan.cliente.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm group-hover:underline">{loan.cliente}</p>
                                    <p className="text-xs text-purple-200 font-mono">{loan.nroLegajo}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm">USD {loan.montoAprobado?.toLocaleString()}</p>
                                <span className="text-[10px] bg-purple-400 text-purple-900 px-2 py-0.5 rounded font-bold uppercase shadow-sm">
                                    A Escriturar
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Column */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Collection Management (Priority) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-orange-50">
                    <h3 className="font-bold text-orange-900 flex items-center gap-2">
                        <Banknote size={20} className="text-orange-600" />
                        Gestión de Cobranzas
                    </h3>
                    <div className="flex items-center gap-2">
                        {pendingPayments.length > 0 && (
                            <span className="bg-orange-200 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                                {pendingPayments.length} Pendientes
                            </span>
                        )}
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {pendingPayments.length > 0 ? (
                        pendingPayments.map((p, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{p.cliente}</p>
                                        <p className="text-xs text-slate-500">{p.legajo} • Cuota {p.numero}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Monto</p>
                                        <p className="font-bold text-slate-900">USD {p.monto.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 border border-blue-100">
                                            <Eye size={14} />
                                            Ver
                                        </button>
                                        <button 
                                            onClick={() => onConfirmPayment && onConfirmPayment(p.loanId, p.numero)}
                                            className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-700 shadow-sm"
                                        >
                                            <Check size={14} />
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-slate-400">
                            <Check className="mx-auto mb-2 opacity-30" size={24} />
                            <p className="text-sm">Todo al día. No hay pagos pendientes de confirmación.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Priority Tasks / Attention Required */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="text-slate-400" size={20} />
                    Alertas Operativas
                </h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">Ver todo</button>
                </div>
                <div className="divide-y divide-slate-100">
                {priorityLoans.map(loan => (
                    <div key={loan.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${loan.estado === 'Observado' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {loan.estado === 'Observado' ? '!' : '?'}
                            </div>
                            <div>
                            <p className="font-bold text-slate-800">{loan.cliente}</p>
                            <p className="text-xs text-slate-500">{loan.nroLegajo} • {loan.broker}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <StatusBadge status={loan.estado} />
                            <button 
                            onClick={() => onOpenDetail(loan)}
                            className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                            Revisar
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
         </div>

         {/* Quick Actions / System Status (Sidebar) */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg shadow-blue-600/20">
               <h3 className="font-bold text-lg mb-2">Originación Rápida</h3>
               <p className="text-blue-100 text-sm mb-6">Inicia una solicitud manual para un cliente presencial.</p>
               <button 
                  onClick={() => setShowNewClientModal(true)}
                  className="w-full py-3 bg-white text-blue-600 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
               >
                  <Plus size={20} />
                  Nueva Solicitud
               </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
               <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Estado del Sistema</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        Motor de Riesgo
                     </div>
                     <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Operativo</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        Firma Digital
                     </div>
                     <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Operativo</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={16} className="text-orange-500" />
                        Conexión Buró Crédito
                     </div>
                     <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Lentitud</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

       {/* NEW REQUEST MODAL */}
       {showNewClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                 <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <User className="text-blue-600" />
                    Solicitud Formal de Crédito
                 </h3>
                 <button onClick={() => setShowNewClientModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                 <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Identificación del Cliente</h4>
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-700 mb-1">DNI / CUIT</label>
                            <input 
                                required type="text" 
                                className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 ${dniSearched ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-200'}`}
                                value={formData.dni} 
                                onChange={e => setFormData({...formData, dni: e.target.value})} 
                                placeholder="Ingrese DNI para buscar..."
                                disabled={dniSearched}
                            />
                        </div>
                        {!dniSearched ? (
                            <button type="button" onClick={handleDniSearch} className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">
                                Buscar
                            </button>
                        ) : (
                            <button type="button" onClick={() => {setDniSearched(false); setFormData({...formData, nombre: '', email: '', telefono: ''})}} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50">
                                Limpiar
                            </button>
                        )}
                    </div>
                    
                    {/* Collapsible Client Data */}
                    <div className={`grid grid-cols-2 gap-6 transition-all duration-300 ${dniSearched ? 'opacity-100' : 'opacity-50 grayscale pointer-events-none'}`}>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required type="text" className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" 
                                    value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Juan Perez"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required type="email" className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" 
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="cliente@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required type="tel" className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" 
                                    value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} placeholder="+54 11..."
                                />
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className={`space-y-4 transition-all duration-300 ${dniSearched ? 'opacity-100' : 'opacity-50 grayscale pointer-events-none'}`}>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">2. Datos de la Operación</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Monto a Solicitar (USD)</label>
                            <div className="relative">
                                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required type="number" className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" 
                                    value={formData.monto} onChange={e => setFormData({...formData, monto: e.target.value})} placeholder="25000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Valor Propiedad (USD)</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required type="number" className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" 
                                    value={formData.valorPropiedad} onChange={e => setFormData({...formData, valorPropiedad: e.target.value})} placeholder="80000"
                                />
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setShowNewClientModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                        Cancelar
                    </button>
                    <button type="submit" disabled={!dniSearched} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save size={18} />
                        Generar Legajo
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// --- VIEW 2: LEGAJOS MANAGER (List View) ---
interface LegajosManagerProps {
  loans: LoanRecord[];
  onOpenDetail: (loan: LoanRecord) => void;
}

export const LegajosManager: React.FC<LegajosManagerProps> = ({ loans, onOpenDetail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filtered = loans.filter(l => {
      const matchSearch = l.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.nroLegajo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'Todos' || l.estado === statusFilter;
      return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Legajos</h1>
          <p className="text-slate-500 mt-1">Base de datos centralizada de créditos.</p>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <Download size={18} />
                Exportar CSV
             </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por cliente, legajo..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select 
                className="bg-white border border-slate-200 text-slate-700 font-bold rounded-lg px-4 py-2 outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="Todos">Todos los Estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Observado">Observado</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Pendiente de liquidación">Pendiente de Liq.</option>
                <option value="Activo">Activo</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Cancelado / Finalizado">Finalizado</option>
            </select>
        </div>

        {/* Table */}
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-100">
                <tr>
                    <th className="px-6 py-4">Legajo / Cliente</th>
                    <th className="px-6 py-4">Oficina / Broker</th>
                    <th className="px-6 py-4 text-right">Monto (USD)</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filtered.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{loan.cliente}</p>
                                    <p className="text-xs text-slate-500 font-mono">{loan.nroLegajo}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-700">{loan.oficina}</p>
                            <p className="text-xs text-slate-500">{loan.broker}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <p className="font-mono font-bold text-slate-900">
                                {(loan.montoAprobado || loan.montoSolicitado).toLocaleString()}
                             </p>
                             <p className="text-[10px] text-slate-400 uppercase font-bold">
                                Val: {loan.valorInmueble.toLocaleString()}
                             </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <StatusBadge status={loan.estado} />
                        </td>
                        <td className="px-6 py-4 text-center">
                            <button 
                                onClick={() => onOpenDetail(loan)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Eye size={20} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        {filtered.length === 0 && (
            <div className="p-12 text-center text-slate-400">
                <Search size={32} className="mx-auto mb-2 opacity-30" />
                <p>No se encontraron legajos con los filtros actuales.</p>
            </div>
        )}
      </div>
    </div>
  );
};
