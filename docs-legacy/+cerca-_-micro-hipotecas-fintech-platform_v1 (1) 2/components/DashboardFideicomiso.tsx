
import React from 'react';
import { 
  ShieldCheck, 
  Landmark, 
  BarChart4, 
  Activity, 
  AlertTriangle,
  Download,
  EyeOff,
  Banknote,
  Check,
  FileText,
  Clock
} from 'lucide-react';
import { LoanRecord } from '../types';

interface Props {
  loans: LoanRecord[];
}

const DashboardFideicomiso: React.FC<Props> = ({ loans }) => {
  // Calculate aggregated metrics
  const totalDeployed = loans
    .filter(l => l.estado === 'Activo' || l.estado === 'Pendiente de liquidación')
    .reduce((acc, curr) => acc + (curr.liquidacion?.montoDesembolsado || curr.montoSolicitado), 0);

  // Amortization Metrics
  let amortReceived = 0;
  let amortPending = 0;
  let cashAvailable = 500000; // Mock initial cash
  
  loans.forEach(l => {
      if (l.pagos) {
          l.pagos.forEach(p => {
              if (p.estado === 'Pagado') {
                  amortReceived += p.monto;
                  cashAvailable += p.monto; // Mock logic
              } else {
                  amortPending += p.monto;
              }
          });
      }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Auditoría del Fideicomiso</h1>
          <p className="text-slate-500 mt-1">Supervisión financiera y control de garantías.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
           <EyeOff size={16} />
           <span className="text-xs font-bold uppercase tracking-wide">Datos Sensibles Ocultos</span>
        </div>
      </div>

      {/* Financial Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-slate-400 font-medium text-sm">Disponibilidad Consolidada</p>
              <h3 className="text-3xl font-bold mt-2">USD {cashAvailable.toLocaleString()}</h3>
              <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">
                 <Activity size={14} />
                 Alta Liquidez
              </p>
           </div>
           <Landmark className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32" />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 font-medium text-sm">Cartera Activa</p>
           <h3 className="text-2xl font-bold text-slate-900 mt-2">USD {totalDeployed.toLocaleString()}</h3>
           <p className="text-slate-400 text-xs mt-2">Fondos colocados</p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm">
           <p className="text-emerald-700 font-medium text-sm">Amortizaciones Recibidas</p>
           <h3 className="text-2xl font-bold text-emerald-900 mt-2">USD {amortReceived.toLocaleString()}</h3>
           <p className="text-emerald-600/70 text-xs mt-2 font-bold">Cobranza efectiva</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 font-medium text-sm">Por Recibir (Future)</p>
           <h3 className="text-2xl font-bold text-slate-900 mt-2">USD {amortPending.toLocaleString()}</h3>
           <p className="text-slate-400 text-xs mt-2">Flujo proyectado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              
              {/* Anonymized Portfolio Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-blue-600" />
                    Registro de Operaciones (Sin PII)
                    </h3>
                    <button className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                    <Download size={16} />
                    Reporte Regulatorio
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold">
                    <tr>
                        <th className="px-6 py-4">ID Legajo</th>
                        <th className="px-6 py-4">Fecha Alta</th>
                        <th className="px-6 py-4 text-right">Monto (USD)</th>
                        <th className="px-6 py-4 text-right">Aforo Garantía</th>
                        <th className="px-6 py-4 text-center">Estado</th>
                        <th className="px-6 py-4 text-center">Riesgo</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {loans.map((loan) => (
                        <tr key={loan.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-mono text-sm font-bold text-slate-700">{loan.nroLegajo}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{loan.fechaSolicitud}</td>
                            <td className="px-6 py-4 text-right font-mono text-sm text-slate-900 font-bold">
                                {loan.montoSolicitado.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-sm text-slate-500">
                                {Math.round((loan.montoSolicitado / loan.valorInmueble) * 100)}% LTV
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                loan.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {loan.estado}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="text-emerald-600 font-bold text-xs">Bajo</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
          </div>
          
          <div className="space-y-6">
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Vencimientos Próximos</h3>
                <div className="space-y-3">
                    {loans.flatMap(l => l.pagos ? l.pagos.filter(p => p.estado === 'Pendiente').slice(0,3).map(p => ({...p, legajo: l.nroLegajo})) : []).map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                             <div>
                                <p className="text-xs font-bold text-slate-900">{p.legajo}</p>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                   <Clock size={12} />
                                   {p.vencimiento}
                                </div>
                             </div>
                             <span className="font-mono font-bold text-sm">USD {p.monto}</span>
                        </div>
                    ))}
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardFideicomiso;
