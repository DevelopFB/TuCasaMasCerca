
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  FileText, 
  PlusCircle, 
  CheckCircle2,
  Clock,
  Landmark,
  ArrowRight,
  Download,
  FileCheck,
  BarChart4
} from 'lucide-react';

const DashboardInvestor: React.FC = () => {
  const [showCommitModal, setShowCommitModal] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portal de Inversor</h1>
          <p className="text-slate-500 mt-1">Resumen de rendimiento y oportunidades de inversión.</p>
        </div>
        <button 
          onClick={() => setShowCommitModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.02]"
        >
          <PlusCircle size={20} />
          Nuevo Aporte de Capital
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-slate-500 font-medium text-sm">Capital Integrado</p>
                 <h3 className="text-3xl font-bold text-slate-900 mt-2">USD 150,000</h3>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                 <Wallet size={24} />
              </div>
           </div>
           <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[85%] rounded-full"></div>
           </div>
           <p className="text-xs text-slate-400 mt-2">85% del capital comprometido integrado</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-slate-500 font-medium text-sm">Tir Estimada (Anual)</p>
                 <h3 className="text-3xl font-bold text-blue-600 mt-2">9.2%</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <TrendingUp size={24} />
              </div>
           </div>
           <p className="text-xs font-medium text-emerald-600 mt-auto flex items-center gap-1">
             <ArrowUpRight size={14} />
             +0.5% vs Benchmark Mercado
           </p>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-40 relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-slate-400 font-medium text-sm">Intereses Ganados</p>
              <h3 className="text-3xl font-bold mt-2">USD 12,450</h3>
              <button className="mt-4 text-xs font-bold bg-white/10 hover:bg-white/20 py-1.5 px-3 rounded-lg transition-colors border border-white/10">
                 Ver liquidaciones
              </button>
           </div>
           <PieChart className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Charts Section (Replacing the detailed table) */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="font-bold text-slate-800 flex items-center gap-2">
                   <BarChart4 size={20} className="text-blue-600" />
                   Evolución de Rentabilidad
                 </h2>
                 <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-3 py-1 outline-none">
                    <option>Últimos 12 meses</option>
                    <option>YTD (Año corriente)</option>
                 </select>
              </div>
              
              {/* Simulated Chart */}
              <div className="flex items-end justify-between h-64 px-4 gap-2">
                 {[40, 65, 55, 78, 85, 92, 100, 110, 105, 120, 125, 135].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                       <div className="w-full relative h-full flex items-end">
                          <div 
                             style={{ height: `${(h/150)*100}%` }} 
                             className="w-full bg-blue-100 rounded-t-sm group-hover:bg-blue-600 transition-colors duration-300 relative"
                          >
                             {/* Tooltip */}
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                +{h/10}%
                             </div>
                          </div>
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][i]}
                       </span>
                    </div>
                 ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 text-center">
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Valor Cuotaparte</p>
                    <p className="text-lg font-black text-slate-800">1.1245</p>
                 </div>
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Retorno Acumulado</p>
                    <p className="text-lg font-black text-emerald-600">+12.4%</p>
                 </div>
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Duración Promedio</p>
                    <p className="text-lg font-black text-slate-800">18 Meses</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Opportunities / Next Steps */}
        <div className="space-y-6">
           <h2 className="font-bold text-slate-800 flex items-center gap-2">
             <Landmark size={20} className="text-slate-400" />
             Fondeo Activo
           </h2>
           
           {/* Pending Action Card */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    <Clock size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900">Integración Pendiente</h4>
                    <p className="text-xs text-slate-500">Compromiso firmado el 10/05</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                       <span className="text-slate-500">Capital a integrar</span>
                       <span className="font-bold text-slate-900">USD 25,000</span>
                    </div>
                    <p className="text-xs text-orange-600 font-medium mt-1">Vence en 48 horas</p>
                 </div>
                 <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    Informar Transferencia
                    <ArrowRight size={16} />
                 </button>
              </div>
           </div>

           <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
              <h4 className="font-bold text-blue-900 mb-2">¿Quieres aumentar tu participación?</h4>
              <p className="text-sm text-blue-800/80 mb-4">
                 Actualmente hay cupo disponible en el Fideicomiso Alpha I con una tasa preferencial para socios actuales.
              </p>
              <button className="text-sm font-bold text-blue-600 hover:underline">
                 Contactar con Oficial de Cuenta
              </button>
           </div>
        </div>
      </div>

      {/* Modal Simulation for Self-Registration (New Capital) */}
      {showCommitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Nuevo Aporte de Capital</h3>
              <p className="text-sm text-slate-500 mb-6">Generación de contrato de suscripción digital.</p>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Monto a Comprometer (USD)</label>
                    <input type="number" className="w-full p-3 border border-slate-200 rounded-lg font-mono text-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="50000" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Fondo de Destino</label>
                    <select className="w-full p-3 border border-slate-200 rounded-lg outline-none bg-white">
                       <option>Fideicomiso Alpha I (Abierto)</option>
                       <option disabled>Fondo Beta (Cerrado)</option>
                    </select>
                 </div>
                 <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowCommitModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-lg">Cancelar</button>
                    <button onClick={() => setShowCommitModal(false)} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Firmar Compromiso</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardInvestor;
