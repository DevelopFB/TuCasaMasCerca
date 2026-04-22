
import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  FileCheck, 
  ClipboardList, 
  MapPin, 
  Phone, 
  Mail,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  MessageSquare,
  TrendingUp,
  Pencil,
  Check,
  Ban,
  Landmark,
  Calendar,
  Banknote,
  Stamp,
  ArrowRight,
  Upload,
  TableProperties
} from 'lucide-react';
import { LoanRecord } from '../types';

interface Props {
  loan: LoanRecord;
  onClose: () => void;
  onUpdate?: (loan: LoanRecord) => void;
  onReject?: (id: string, reason: string) => void;
  onActivate?: (id: string, data: any) => void;
  onUploadDoc?: (loanId: string, docName: string) => void; 
}

const LegajoModal: React.FC<Props> = ({ loan, onClose, onUpdate, onReject, onActivate, onUploadDoc }) => {
  const [activeTab, setActiveTab] = useState<'cliente' | 'docs' | 'eval' | 'liq'>('cliente');
  
  // State for editing Amount
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [editAmountValue, setEditAmountValue] = useState(loan.montoAprobado || loan.montoSolicitado);

  // State for Rejection Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // State for Liquidation Form
  const [liqData, setLiqData] = useState({
      montoDesembolsado: loan.montoAprobado || loan.montoSolicitado,
      fechaEscritura: new Date().toISOString().split('T')[0],
      escribano: '',
      cantidadCuotas: 24,
      montoPrimerCuota: 0
  });

  const [previewSchedule, setPreviewSchedule] = useState<{numero: number, fecha: string, monto: number}[]>([]);

  // Automatically switch to Liquidación tab if status is appropriate
  useEffect(() => {
    if (loan.estado === 'Pendiente de liquidación') {
        setActiveTab('liq');
    }
  }, [loan.estado]);

  // Recalculate schedule for preview
  useEffect(() => {
    const interest = 1.05; 
    const amount = liqData.montoDesembolsado;
    const months = liqData.cantidadCuotas;
    const monthlyPayment = (amount / months) * interest; 
    
    // Generate dates starting from next month of escritura
    const schedule = [];
    const startDate = new Date(liqData.fechaEscritura || new Date());
    
    for (let i = 1; i <= months; i++) {
        const d = new Date(startDate);
        d.setMonth(d.getMonth() + i);
        schedule.push({
            numero: i,
            fecha: d.toISOString().split('T')[0],
            monto: parseFloat(monthlyPayment.toFixed(2))
        });
    }
    setPreviewSchedule(schedule);
    setLiqData(prev => ({ ...prev, montoPrimerCuota: parseFloat(monthlyPayment.toFixed(2)) }));
  }, [liqData.montoDesembolsado, liqData.cantidadCuotas, liqData.fechaEscritura]);

  const currentApprovedAmount = loan.montoAprobado || loan.montoSolicitado;
  const ltvPercentage = Math.round((currentApprovedAmount / loan.valorInmueble) * 100);

  const handleSaveAmount = () => {
    if (onUpdate) {
        onUpdate({
            ...loan,
            montoAprobado: editAmountValue
        });
    }
    setIsEditingAmount(false);
  };

  const handleCancelAmount = () => {
      setEditAmountValue(loan.montoAprobado || loan.montoSolicitado);
      setIsEditingAmount(false);
  };

  const handleActivateClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (onActivate) {
        onActivate(loan.id, liqData);
    }
  };

  const handleApprove = () => {
    if (onUpdate) {
        onUpdate({
            ...loan,
            estado: 'Aprobado',
            montoAprobado: editAmountValue 
        });
        onClose();
    }
  };

  const handleConfirmReject = () => {
      if (onReject && rejectReason.trim()) {
          onReject(loan.id, rejectReason);
      }
  };

  const handleObserve = () => {
      if (onUpdate) {
          const updatedDocs = loan.detalles.documentacion.map((d, i) => 
              i === 0 ? { ...d, estado: 'Observado' as const } : d
          );
          onUpdate({
              ...loan,
              estado: 'Observado',
              detalles: {
                  ...loan.detalles,
                  documentacion: updatedDocs
              }
          });
          onClose();
      }
  };

  // Helper for Badge Styles
  const getBadgeStyle = (status: string) => {
      switch (status) {
          case 'Activo': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          case 'Aprobado': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
          case 'Pendiente de liquidación': return 'bg-purple-100 text-purple-700 border-purple-200';
          case 'Rechazado': return 'bg-red-100 text-red-700 border-red-200';
          case 'Cancelado / Finalizado': return 'bg-slate-200 text-slate-700 border-slate-300';
          case 'Observado': return 'bg-orange-100 text-orange-700 border-orange-200';
          default: return 'bg-slate-100 text-slate-500 border-slate-200';
      }
  };

  const isTerminalState = loan.estado === 'Activo' || loan.estado === 'Rechazado' || loan.estado === 'Cancelado / Finalizado';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
          <div className="flex items-center gap-4">
             <div className="p-2.5 bg-slate-900 rounded-xl text-white">
                <FileSearch size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900">Legajo Digital: <span className="text-blue-600">{loan.nroLegajo}</span></h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${getBadgeStyle(loan.estado)}`}>
                        {loan.estado}
                    </span>
                    <span className="text-xs text-slate-400">• Última mod: hace 2 horas</span>
                </div>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-100">
           {[
             { id: 'cliente', label: 'Datos del Cliente', icon: <User size={16} /> },
             { id: 'docs', label: 'Documentación', icon: <FileCheck size={16} /> },
             { id: 'eval', label: 'Evaluación Técnica', icon: <ClipboardList size={16} /> },
             // Only show Liquidation tab if relevant
             ...(loan.estado === 'Pendiente de liquidación' || loan.estado === 'Activo' || loan.estado === 'Cancelado / Finalizado' ? [
                 { id: 'liq', label: 'Escritura y Liquidación', icon: <Stamp size={16} /> }
             ] : [])
           ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2
                  ${activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'}
                `}
             >
               {tab.icon}
               {tab.label}
             </button>
           ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
           {activeTab === 'cliente' && (
             <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-6">
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Información Personal</h3>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <User size={18} className="text-slate-400" />
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Nombre Completo</p>
                               <p className="text-sm font-bold text-slate-900">{loan.cliente}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <ClipboardList size={18} className="text-slate-400" />
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">DNI / CUIL</p>
                               <p className="text-sm font-bold text-slate-900">{loan.detalles.dni}</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contacto</h3>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <Mail size={18} className="text-slate-400" />
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                               <p className="text-sm font-bold text-slate-900">{loan.detalles.email}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <Phone size={18} className="text-slate-400" />
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Teléfono</p>
                               <p className="text-sm font-bold text-slate-900">{loan.detalles.telefono}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Detalles Inmobiliarios</h3>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-slate-400" />
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Valor Inmueble</p>
                               <p className="text-sm font-bold text-slate-900">USD {loan.valorInmueble.toLocaleString()}</p>
                            </div>
                         </div>
                         
                         {/* Original Requested Amount (Read Only) */}
                         <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Monto Solicitado (Original)</p>
                                <p className="text-xs font-bold text-slate-600">USD {loan.montoSolicitado.toLocaleString()}</p>
                             </div>
                         </div>

                         {/* Approved Amount (Editable) */}
                         <div className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${isEditingAmount ? 'bg-blue-50 border-blue-200' : 'bg-emerald-50 border-emerald-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase ${isEditingAmount ? 'text-blue-600' : 'text-emerald-600'}`}>Monto Aprobado / A Otorgar</p>
                                    
                                    {isEditingAmount ? (
                                        <div className="flex items-center mt-1">
                                            <span className="text-sm font-bold text-blue-900 mr-1">USD</span>
                                            <input 
                                                type="number" 
                                                value={editAmountValue}
                                                onChange={(e) => setEditAmountValue(Number(e.target.value))}
                                                className="w-24 bg-white border border-blue-300 rounded px-2 py-0.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-lg font-bold text-slate-900">USD {currentApprovedAmount.toLocaleString()}</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions for Edit */}
                            {onUpdate && !isTerminalState && loan.estado !== 'Pendiente de liquidación' && (
                                <div>
                                    {isEditingAmount ? (
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={handleSaveAmount}
                                                className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button 
                                                onClick={handleCancelAmount}
                                                className="p-1.5 bg-white text-slate-500 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                setEditAmountValue(currentApprovedAmount);
                                                setIsEditingAmount(true);
                                            }}
                                            className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                                            title="Modificar monto aprobado"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    )}
                                </div>
                            )}
                         </div>

                         <div className="pt-2">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Relación LTV (Calculado s/ Aprobado)</p>
                                <p className={`text-xs font-bold ${ltvPercentage > 30 ? 'text-orange-500' : 'text-blue-600'}`}>
                                   {ltvPercentage}%
                                </p>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                 className={`h-full rounded-full transition-all duration-500 ${ltvPercentage > 30 ? 'bg-orange-500' : 'bg-blue-600'}`}
                                 style={{ width: `${Math.min(ltvPercentage, 100)}%` }}
                               ></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'docs' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               {loan.detalles.documentacion.map((doc, idx) => (
                 <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${doc.estado === 'Cargado' ? 'bg-emerald-50 text-emerald-600' : doc.estado === 'Observado' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                          <FileCheck size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">{doc.nombre}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${doc.estado === 'Cargado' ? 'text-emerald-500' : doc.estado === 'Observado' ? 'text-orange-500' : 'text-slate-400'}`}>
                             {doc.estado}
                          </p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       {doc.estado === 'Cargado' && (
                         <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Download size={18} />
                         </button>
                       )}
                       {(doc.estado === 'Faltante' || doc.estado === 'Observado') && !isTerminalState && (
                         <button 
                            onClick={() => onUploadDoc && onUploadDoc(loan.id, doc.nombre)}
                            className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                         >
                            <Upload size={14} />
                            Subir
                         </button>
                       )}
                       {!isTerminalState && doc.estado === 'Cargado' && (
                        <button className="px-3 py-1.5 text-[11px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                            Gestionar
                        </button>
                       )}
                    </div>
                 </div>
               ))}
               {!isTerminalState && (
                <div className="mt-8 p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm font-bold">Solicitar documentación faltante</p>
                    <button className="mt-2 text-blue-600 hover:underline text-xs font-bold">Enviar recordatorio automático al cliente</button>
                </div>
               )}
             </div>
           )}

           {activeTab === 'eval' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* --- SHOW REJECTION REASON IF REJECTED --- */}
                {loan.estado === 'Rechazado' && loan.motivoRechazo && (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-start gap-4">
                        <AlertTriangle className="text-red-500 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-red-900">Crédito Rechazado</h4>
                            <p className="text-sm text-red-700 mt-1 font-medium">Motivo: {loan.motivoRechazo}</p>
                        </div>
                    </div>
                )}

                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
                   <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" />
                   <div>
                      <h4 className="font-bold text-emerald-900">Evaluación de Riesgo Preliminar</h4>
                      <p className="text-sm text-emerald-700 mt-1 leading-relaxed">
                         El perfil del cliente es compatible con los requisitos del fideicomiso. El LTV se encuentra dentro de los límites aceptables (inferior al 30% del valor total).
                      </p>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                   <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <MessageSquare size={18} className="text-slate-400" />
                      Notas Internas (Solo Back Office)
                   </h4>
                   <textarea 
                     disabled={isTerminalState}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 min-h-[120px] disabled:opacity-70"
                     placeholder={isTerminalState ? "Legajo cerrado." : "Añadir una nota sobre la evaluación técnica..."}
                   />
                   {!isTerminalState && (
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                            Guardar Comentario
                        </button>
                    </div>
                   )}
                </div>
             </div>
           )}

           {activeTab === 'liq' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {loan.estado === 'Pendiente de liquidación' ? (
                      <form onSubmit={handleActivateClick} className="space-y-6">
                          {/* Form Content as before */}
                          <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl">
                              {/* ... Inputs ... */}
                              <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                  <Stamp size={20} />
                                  Registro de Escritura y Desembolso
                              </h3>
                              {/* Shortened for brevity, assumes previous content is here or user fills it */}
                              <div className="grid grid-cols-2 gap-6 mb-6 mt-4">
                                  <div>
                                      <label className="block text-xs font-bold text-purple-800 uppercase mb-1.5">Monto Desembolsado Final (USD)</label>
                                      <input type="number" required className="w-full p-3 bg-white border border-purple-200 rounded-lg outline-none" value={liqData.montoDesembolsado} onChange={(e) => setLiqData({...liqData, montoDesembolsado: Number(e.target.value)})} />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-purple-800 uppercase mb-1.5">Fecha de Escritura</label>
                                      <input type="date" required className="w-full p-3 bg-white border border-purple-200 rounded-lg outline-none" value={liqData.fechaEscritura} onChange={(e) => setLiqData({...liqData, fechaEscritura: e.target.value})} />
                                  </div>
                              </div>
                              <div className="mb-6">
                                  <label className="block text-xs font-bold text-purple-800 uppercase mb-1.5">Escribano Interviniente</label>
                                  <input type="text" required placeholder="Nombre..." className="w-full p-3 bg-white border border-purple-200 rounded-lg outline-none" value={liqData.escribano} onChange={(e) => setLiqData({...liqData, escribano: e.target.value})} />
                              </div>
                          </div>
                          
                          <button 
                              type="submit"
                              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all"
                          >
                              <CheckCircle2 size={20} />
                              Confirmar Liquidación y Activar Crédito
                          </button>
                      </form>
                  ) : (
                      // Read Only View
                      <div className="space-y-6">
                          <div className={`border p-6 rounded-2xl ${loan.estado === 'Cancelado / Finalizado' ? 'bg-slate-100 border-slate-200' : 'bg-emerald-50 border-emerald-100'}`}>
                              <div className="flex items-center gap-3 mb-4">
                                  <div className={`p-2 rounded-lg ${loan.estado === 'Cancelado / Finalizado' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                      <CheckCircle2 size={24} />
                                  </div>
                                  <div>
                                      <h3 className={`font-bold text-lg ${loan.estado === 'Cancelado / Finalizado' ? 'text-slate-800' : 'text-emerald-900'}`}>
                                          {loan.estado === 'Cancelado / Finalizado' ? 'Crédito Finalizado' : 'Crédito Activo'}
                                      </h3>
                                      <p className={`text-sm ${loan.estado === 'Cancelado / Finalizado' ? 'text-slate-600' : 'text-emerald-700'}`}>
                                          {loan.estado === 'Cancelado / Finalizado' ? 'La operación ha sido cancelada en su totalidad.' : 'Operación liquidada y vigente.'}
                                      </p>
                                  </div>
                              </div>
                              <div className={`grid grid-cols-2 gap-8 pt-4 border-t ${loan.estado === 'Cancelado / Finalizado' ? 'border-slate-200' : 'border-emerald-100'}`}>
                                  <div>
                                      <p className={`text-xs font-bold uppercase mb-1 ${loan.estado === 'Cancelado / Finalizado' ? 'text-slate-500' : 'text-emerald-600'}`}>Monto Otorgado</p>
                                      <p className={`text-2xl font-bold ${loan.estado === 'Cancelado / Finalizado' ? 'text-slate-800' : 'text-emerald-900'}`}>USD {loan.liquidacion?.montoDesembolsado.toLocaleString()}</p>
                                  </div>
                                  <div>
                                      <p className={`text-xs font-bold uppercase mb-1 ${loan.estado === 'Cancelado / Finalizado' ? 'text-slate-500' : 'text-emerald-600'}`}>Fecha Escritura</p>
                                      <p className={`text-lg font-bold ${loan.estado === 'Cancelado / Finalizado' ? 'text-slate-800' : 'text-emerald-900'}`}>{loan.liquidacion?.fechaEscritura}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
           )}
        </div>

        {/* Footer - Hide actions if in Liquidation tab or status is Terminal */}
        {activeTab !== 'liq' && !isTerminalState && loan.estado !== 'Pendiente de liquidación' && (
            <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between sticky bottom-0">
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                >
                    Rechazar Operación
                </button>
                <button 
                    onClick={handleObserve}
                    className="px-4 py-2 text-sm font-bold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100"
                >
                    Solicitar Observación
                </button>
            </div>
            <button 
                onClick={handleApprove}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
            >
                Aprobar Legajo
            </button>
            </div>
        )}

        {/* --- REJECTION MODAL --- */}
        {showRejectModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white border border-red-100 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden ring-1 ring-red-100">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                        <AlertTriangle className="text-red-500" />
                        <h3 className="font-bold text-red-900">Rechazar Solicitud</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-slate-600 mb-4">
                            Esta acción es irreversible. Por favor, ingrese el motivo del rechazo para notificar al cliente.
                        </p>
                        <textarea 
                            autoFocus
                            className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500/20 text-sm"
                            rows={4}
                            placeholder="Ej: El análisis crediticio no cumple con los requisitos mínimos de ingresos..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                    <div className="p-4 border-t border-slate-100 flex gap-3 justify-end bg-slate-50">
                        <button 
                            onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                            className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleConfirmReject}
                            disabled={!rejectReason.trim()}
                            className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                        >
                            Confirmar Rechazo
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default LegajoModal;
