
import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Eye, 
  Users, 
  ArrowRight, 
  ClipboardList,
  X,
  User,
  Mail,
  Phone,
  Banknote,
  Building,
  Save,
  TrendingUp,
  Percent,
  AlertTriangle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { LoanRecord } from '../types';

interface Props {
  loans: LoanRecord[];
  onOpenDetail: (loan: LoanRecord) => void;
  onAddLoan?: (loan: LoanRecord) => void; 
}

const DashboardBroker: React.FC<Props> = ({ loans, onOpenDetail, onAddLoan }) => {
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    monto: '',
    valorPropiedad: ''
  });
  const [dniSearched, setDniSearched] = useState(false);

  const handleDniSearch = () => {
    // Mock Logic: If DNI is valid length, unlock fields. 
    // If DNI is specific mock, prefill.
    if (formData.dni.length > 6) {
        if (formData.dni === '11111111') {
             setFormData(prev => ({...prev, nombre: 'Cliente Existente Demo', email: 'cliente@demo.com', telefono: '+54 11 1234-5678'}));
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
        broker: 'Maria Gonzalez', 
        estado: 'Pendiente',
        detalles: {
          dni: formData.dni,
          email: formData.email,
          telefono: formData.telefono,
          documentacion: [
            { nombre: 'DNI Frontal', estado: 'Faltante' },
            { nombre: 'Reserva de Compra', estado: 'Faltante' },
            { nombre: 'Tasación', estado: 'Cargado' } 
          ]
        }
      };
      onAddLoan(newLoan);
      setShowNewClientModal(false);
      setFormData({ nombre: '', dni: '', email: '', telefono: '', monto: '', valorPropiedad: '' });
      setDniSearched(false);
    }
  };

  // KPI Calculations
  const activeLoans = loans.filter(l => l.estado !== 'Rechazado' && l.estado !== 'Cancelado / Finalizado');
  const totalVolume = activeLoans.reduce((acc, curr) => acc + curr.montoSolicitado, 0);
  const potentialCommission = totalVolume * 0.02; // Mock 2% commission
  const urgentTasks = loans.filter(l => l.estado === 'Observado' || l.estado === 'Pendiente');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
          <p className="text-slate-500 mt-1">Resumen de performance y gestión de oportunidades.</p>
        </div>
        <button 
          onClick={() => setShowNewClientModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.02]"
        >
          <PlusCircle size={20} />
          Alta Rápida de Cliente
        </button>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Cartera Activa</p>
                  <h3 className="text-3xl font-bold text-slate-900">{activeLoans.length}</h3>
                  <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                      <TrendingUp size={14} /> +3 este mes
                  </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Users size={24} />
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Volumen Gestionado</p>
                  <h3 className="text-3xl font-bold text-slate-900">USD {(totalVolume / 1000).toFixed(0)}k</h3>
                  <p className="text-xs font-bold text-slate-400 mt-2">Monto total solicitado</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Banknote size={24} />
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Comisiones Estimadas</p>
                  <h3 className="text-3xl font-bold text-emerald-600">USD {potentialCommission.toLocaleString()}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-2">Proyección actual</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Percent size={24} />
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Urgent Tasks */}
         <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <AlertTriangle className="text-orange-500" size={20} />
                     Tareas Prioritarias
                 </h3>
                 <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">{urgentTasks.length} Casos</span>
             </div>
             <div className="divide-y divide-slate-100">
                 {urgentTasks.length > 0 ? urgentTasks.map(loan => (
                     <div key={loan.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${loan.estado === 'Observado' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                 {loan.cliente.charAt(0)}
                             </div>
                             <div>
                                 <p className="font-bold text-slate-900">{loan.cliente}</p>
                                 <div className="flex items-center gap-2 mt-0.5">
                                     <span className="text-xs text-slate-500 font-mono">{loan.nroLegajo}</span>
                                     <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${loan.estado === 'Observado' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                                         {loan.estado}
                                     </span>
                                 </div>
                             </div>
                         </div>
                         <div className="flex items-center gap-4">
                             <div className="text-right hidden sm:block">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">Acción Requerida</p>
                                 <p className="text-xs font-bold text-slate-700">
                                     {loan.estado === 'Observado' ? 'Subir documentación corregida' : 'Seguimiento de evaluación'}
                                 </p>
                             </div>
                             <button onClick={() => onOpenDetail(loan)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                 <ArrowRight size={20} />
                             </button>
                         </div>
                     </div>
                 )) : (
                     <div className="p-8 text-center text-slate-400">
                         <Clock size={32} className="mx-auto mb-2 opacity-30" />
                         <p>No tienes tareas urgentes pendientes.</p>
                     </div>
                 )}
             </div>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-6">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl shadow-xl text-white relative overflow-hidden group cursor-pointer">
                <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2">Ayuda al Cliente</h3>
                    <p className="text-slate-300 text-sm mb-6">¿Tu cliente tiene dudas con la documentación? Descarga nuestra guía rápida para Brokers.</p>
                    <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                        Descargar Guía
                        <ArrowUpRight size={16} />
                    </button>
                </div>
                <Users className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform duration-500" />
             </div>
             
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Accesos Rápidos</h3>
                 <div className="space-y-3">
                     <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100"><ClipboardList size={18} /></div>
                         <div>
                             <p className="text-sm font-bold text-slate-700">Ver Pipeline Completo</p>
                             <p className="text-xs text-slate-500">Ir a métricas de venta</p>
                         </div>
                     </button>
                     <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                         <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100"><Users size={18} /></div>
                         <div>
                             <p className="text-sm font-bold text-slate-700">Base de Clientes</p>
                             <p className="text-xs text-slate-500">Administrar legajos</p>
                         </div>
                     </button>
                 </div>
             </div>
         </div>
      </div>

      {/* NEW CLIENT MODAL */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                 <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <User className="text-blue-600" />
                    Alta de Cliente y Solicitud
                 </h3>
                 <button onClick={() => setShowNewClientModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                 <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Identificación</h4>
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
                        Crear Legajo
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBroker;
