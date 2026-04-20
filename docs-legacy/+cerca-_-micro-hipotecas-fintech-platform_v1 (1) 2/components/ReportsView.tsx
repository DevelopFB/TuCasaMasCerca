
import React, { useState, useMemo } from 'react';
import { 
  FileBarChart, 
  Download, 
  ChevronRight, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  PieChart, 
  Wallet, 
  Calendar,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { LoanRecord, LoanStatus } from '../types';

interface Props {
  loans: LoanRecord[];
}

type ReportType = 
  | 'unconfirmed' 
  | 'due_30' 
  | 'due_7' 
  | 'overdue' 
  | 'pipeline' 
  | 'trust_availability';

const ReportsView: React.FC<Props> = ({ loans }) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('unconfirmed');

  // --- Helper Logic ---
  const today = new Date('2024-05-20'); // MOCK TODAY DATE to match Mock Data context

  const getDaysDiff = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffTime = d.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  // --- Report Calculations ---
  
  const reportData = useMemo(() => {
    switch (selectedReport) {
      case 'unconfirmed':
        return loans.flatMap(l => 
          (l.pagos || []).filter(p => p.estado === 'En revisión').map(p => ({
            id: l.nroLegajo,
            col1: l.cliente,
            col2: `Cuota ${p.numero}`,
            col3: p.vencimiento,
            amount: p.monto,
            status: 'Requiere Acción'
          }))
        );

      case 'due_30':
        return loans.flatMap(l => 
          (l.pagos || []).filter(p => {
            const days = getDaysDiff(p.vencimiento);
            return p.estado === 'Pendiente' && days >= 0 && days <= 30;
          }).map(p => ({
            id: l.nroLegajo,
            col1: l.cliente,
            col2: `Cuota ${p.numero}`,
            col3: `${getDaysDiff(p.vencimiento)} días rest.`,
            amount: p.monto,
            status: 'Próximo'
          }))
        );

      case 'due_7':
        return loans.flatMap(l => 
          (l.pagos || []).filter(p => {
            const days = getDaysDiff(p.vencimiento);
            return p.estado === 'Pendiente' && days >= 0 && days <= 7;
          }).map(p => ({
            id: l.nroLegajo,
            col1: l.cliente,
            col2: `Cuota ${p.numero}`,
            col3: `${getDaysDiff(p.vencimiento)} días rest.`,
            amount: p.monto,
            status: 'Urgente'
          }))
        );

      case 'overdue':
        return loans.flatMap(l => 
          (l.pagos || []).filter(p => {
            const days = getDaysDiff(p.vencimiento);
            return (p.estado === 'Pendiente' && days < 0) || p.estado === 'Vencido';
          }).map(p => ({
            id: l.nroLegajo,
            col1: l.cliente,
            col2: `Cuota ${p.numero}`,
            col3: `Venció hace ${Math.abs(getDaysDiff(p.vencimiento))} días`,
            amount: p.monto,
            status: 'Mora'
          }))
        );

      case 'pipeline':
        // Group by Broker/Office
        const grouped: Record<string, { count: number, volume: number }> = {};
        loans.forEach(l => {
            const key = l.broker === 'Sin Broker' ? l.oficina : l.broker;
            if (!grouped[key]) grouped[key] = { count: 0, volume: 0 };
            grouped[key].count += 1;
            grouped[key].volume += l.montoSolicitado;
        });
        return Object.entries(grouped).map(([key, val]) => ({
            id: key,
            col1: key, // Broker/Oficina
            col2: `${val.count} Operaciones`,
            col3: '-',
            amount: val.volume,
            status: 'Pipeline'
        }));

      case 'trust_availability':
        // Mocked Calculation
        const totalDeployed = loans
          .filter(l => l.estado === 'Activo')
          .reduce((acc, curr) => acc + (curr.liquidacion?.montoDesembolsado || 0), 0);
        
        return [
            { id: 'disp', col1: 'Disponible Líquido', col2: 'Caja USD', col3: '-', amount: 500000, status: 'Líquido' },
            { id: 'dep', col1: 'Capital Colocado', col2: 'Cartera Activa', col3: '-', amount: totalDeployed, status: 'Invertido' },
            { id: 'res', col1: 'Fondo de Reserva', col2: 'Garantía', col3: '-', amount: 50000, status: 'Bloqueado' },
            { id: 'com', col1: 'Comprometido', col2: 'Pendiente Liq.', col3: '-', amount: 95000, status: 'Reservado' },
        ];
    }
  }, [selectedReport, loans]);

  // --- UI Components ---

  const reportsList = [
    { id: 'unconfirmed', label: 'Pagos sin Confirmar', icon: <AlertTriangle size={18} />, desc: 'Transferencias informadas pendientes de revisión.' },
    { id: 'due_7', label: 'Vencimientos (7 días)', icon: <Clock size={18} />, desc: 'Cuotas a vencer en la próxima semana.' },
    { id: 'due_30', label: 'Vencimientos (30 días)', icon: <Calendar size={18} />, desc: 'Proyección de cobranza mensual.' },
    { id: 'overdue', label: 'Cartera en Mora', icon: <AlertTriangle size={18} className="text-red-500" />, desc: 'Cuotas vencidas o impagas.' },
    { id: 'pipeline', label: 'Pipeline Comercial', icon: <FileBarChart size={18} />, desc: 'Volumen de créditos por Broker/Oficina.' },
    { id: 'trust_availability', label: 'Posición Fideicomiso', icon: <Wallet size={18} />, desc: 'Disponibilidad de fondos y colocación.' },
  ];

  const totalAmount = reportData.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Sidebar Reports List */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-1">Centro de Reportes</h2>
            <p className="text-xs text-slate-500 mb-4">Selecciona un reporte para visualizar.</p>
            <div className="space-y-1">
                {reportsList.map((rep) => (
                    <button
                        key={rep.id}
                        onClick={() => setSelectedReport(rep.id as ReportType)}
                        className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${
                            selectedReport === rep.id 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                    >
                        <div className={`mt-0.5 ${selectedReport === rep.id ? 'text-blue-600' : 'text-slate-400'}`}>
                            {rep.icon}
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${selectedReport === rep.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                {rep.label}
                            </p>
                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{rep.desc}</p>
                        </div>
                        {selectedReport === rep.id && <ChevronRight size={16} className="text-blue-600 ml-auto self-center" />}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Main Content Report */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
         {/* Report Header */}
         <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
            <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {reportsList.find(r => r.id === selectedReport)?.icon}
                    {reportsList.find(r => r.id === selectedReport)?.label}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Generado el {new Date().toLocaleDateString()} • {reportData.length} registros encontrados.
                </p>
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <Filter size={16} />
                    Filtrar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm">
                    <Download size={16} />
                    Exportar
                </button>
            </div>
         </div>

         {/* Summary Banner */}
         <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-white">
             <div className="p-4 text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registros</p>
                 <p className="text-2xl font-black text-slate-800">{reportData.length}</p>
             </div>
             <div className="p-4 text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Volumen Total</p>
                 <p className="text-2xl font-black text-blue-600">USD {totalAmount.toLocaleString()}</p>
             </div>
             <div className="p-4 text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Impacto</p>
                 <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold mt-1">
                    <ArrowUpRight size={16} />
                    <span>Alto</span>
                 </div>
             </div>
         </div>

         {/* Data Table */}
         <div className="flex-1 overflow-auto">
             <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50 sticky top-0 z-10">
                     <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                         <th className="px-6 py-3 border-b border-slate-200">
                             {selectedReport === 'pipeline' ? 'Broker / Oficina' : 
                              selectedReport === 'trust_availability' ? 'Concepto' : 'Cliente / Legajo'}
                         </th>
                         <th className="px-6 py-3 border-b border-slate-200">
                             {selectedReport === 'pipeline' ? 'Cantidad' : 
                              selectedReport === 'trust_availability' ? 'Detalle' : 'Detalle / Cuota'}
                         </th>
                         <th className="px-6 py-3 border-b border-slate-200">
                             {selectedReport === 'pipeline' ? '-' : 
                              selectedReport === 'trust_availability' ? '-' : 'Vencimiento'}
                         </th>
                         <th className="px-6 py-3 border-b border-slate-200 text-right">Monto (USD)</th>
                         <th className="px-6 py-3 border-b border-slate-200 text-center">Estado</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {reportData.length > 0 ? (
                         reportData.map((row, idx) => (
                             <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-6 py-4">
                                     <div className="font-bold text-slate-900">{row.col1}</div>
                                     {selectedReport !== 'pipeline' && selectedReport !== 'trust_availability' && (
                                         <div className="text-xs text-slate-400 font-mono">{row.id}</div>
                                     )}
                                 </td>
                                 <td className="px-6 py-4 text-sm text-slate-600">{row.col2}</td>
                                 <td className="px-6 py-4 text-sm text-slate-500">{row.col3}</td>
                                 <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                                     {row.amount.toLocaleString()}
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                     <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase 
                                        ${row.status === 'Mora' ? 'bg-red-100 text-red-700' : 
                                          row.status === 'Urgente' ? 'bg-orange-100 text-orange-700' :
                                          row.status === 'Líquido' ? 'bg-emerald-100 text-emerald-700' :
                                          'bg-blue-50 text-blue-700'}`}>
                                         {row.status}
                                     </span>
                                 </td>
                             </tr>
                         ))
                     ) : (
                         <tr>
                             <td colSpan={5} className="p-12 text-center text-slate-400">
                                 <div className="flex flex-col items-center gap-2">
                                     <CheckCircle2 size={32} className="opacity-30" />
                                     <p>No se encontraron registros para este reporte.</p>
                                 </div>
                             </td>
                         </tr>
                     )}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

export default ReportsView;
