
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Info,
  Banknote,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  User,
  Home,
  Upload,
  FileText
} from 'lucide-react';
import { LoanRecord } from '../types';
import { MOCK_PROPERTIES } from '../mockData';

interface Props {
  loans: LoanRecord[];
  onAddLoan: (loan: LoanRecord) => void;
}

const DashboardClient: React.FC<Props> = ({ loans, onAddLoan }) => {
  // Simulator State
  const [propertyValue, setPropertyValue] = useState(100000);
  const [loanAmount, setLoanAmount] = useState(25000);
  const [term, setTerm] = useState(24);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Constants
  const LTV_LIMIT = 0.30;
  const MAX_GLOBAL_AMOUNT = 40000;
  const INTEREST_RATE = 1.05;

  const maxLoanByLTV = propertyValue * LTV_LIMIT;
  const actualMaxLoan = Math.min(maxLoanByLTV, MAX_GLOBAL_AMOUNT);

  useEffect(() => {
    if (loanAmount > actualMaxLoan) {
      setLoanAmount(actualMaxLoan);
    }
  }, [propertyValue, actualMaxLoan, loanAmount]);

  const estimatedMonthly = ((loanAmount / term) * INTEREST_RATE).toFixed(2);

  // --- LOAN CREATION MODAL STATE ---
  const [selectedPropId, setSelectedPropId] = useState('');
  const [customPropValue, setCustomPropValue] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [reqAmount, setReqAmount] = useState('');
  
  const [noBroker, setNoBroker] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');

  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      setSelectedPropId(id);
      if (id && id !== 'other') {
          const prop = MOCK_PROPERTIES.find(p => p.id === id);
          if (prop) {
              setCustomPropValue(prop.valor.toString());
              setSelectedOffice(prop.oficina); // Auto-assign office based on property
          }
      } else {
          setCustomPropValue('');
          setSelectedOffice('');
      }
  };

  const handleSubmitLoan = (e: React.FormEvent) => {
    e.preventDefault();
    
    const propValue = selectedPropId === 'other' ? Number(customPropValue) : MOCK_PROPERTIES.find(p => p.id === selectedPropId)?.valor || 0;
    
    const newLoan: LoanRecord = {
        id: Date.now().toString(),
        nroLegajo: `LEG-2024-${Math.floor(Math.random() * 9000) + 1000}`,
        fechaSolicitud: new Date().toISOString().split('T')[0],
        cliente: 'Carlos Gomez',
        montoSolicitado: Number(reqAmount),
        valorInmueble: propValue,
        oficina: selectedOffice || 'Central',
        broker: noBroker ? 'Asignación Automática' : selectedBroker,
        estado: 'Pendiente',
        detalles: {
            dni: '20-33445566-9',
            email: 'carlos.gomez@email.com',
            telefono: '+54 11 4455-6677',
            documentacion: [
                { nombre: 'DNI Frontal/Dorso', estado: 'Faltante' },
                { nombre: 'Comprobante Ingresos', estado: 'Faltante' },
                { nombre: 'Título/Escritura', estado: 'Faltante' }
            ]
        }
    };
    onAddLoan(newLoan);
    setIsModalOpen(false);
    // Reset
    setSelectedPropId('');
    setReqAmount('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Simulador de Crédito</h1>
        <p className="text-slate-500">Calcula tu cuota antes de solicitar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- SIMULATOR SECTION --- */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
              <div className="space-y-8 relative z-10">
                  <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                          <Building size={18} className="text-blue-600" />
                          Valor Estimado Propiedad (USD)
                      </label>
                      <input 
                          type="number" 
                          value={propertyValue}
                          onChange={(e) => setPropertyValue(Math.max(0, Number(e.target.value)))}
                          className="w-64 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Info size={12} /> Máximo a prestar: 30% del valor (Tope USD 40k).</p>
                  </div>

                  <div>
                      <div className="flex justify-between mb-4">
                          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                              <Banknote size={18} className="text-emerald-600" />
                              Monto a Solicitar
                          </label>
                          <div className="text-xl font-bold text-emerald-700">USD {loanAmount.toLocaleString()}</div>
                      </div>
                      <input 
                          type="range" min="5000" max={actualMaxLoan} step="500"
                          value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 border border-slate-100"
                      />
                      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>Min: USD 5,000</span>
                          <span>Max: USD {actualMaxLoan.toLocaleString()}</span>
                      </div>
                  </div>

                  <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                          <Calculator size={18} className="text-purple-600" />
                          Plazo
                      </label>
                      <div className="grid grid-cols-4 gap-4">
                          {[12, 24, 36, 48].map((m) => (
                              <button key={m} onClick={() => setTerm(m)} className={`py-3 rounded-xl text-sm font-bold transition-all border ${term === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'}`}>{m} Meses</button>
                          ))}
                      </div>
                  </div>
              </div>
           </div>
        </div>

        {/* --- SUMMARY & CTA --- */}
        <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-lg relative">
                <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Resultado Simulación</h3>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
                    <p className="text-xs text-blue-600 uppercase font-bold tracking-widest mb-2 text-center">Cuota Mensual Estimada</p>
                    <p className="text-4xl font-black text-blue-900 text-center">USD {estimatedMonthly}</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    Iniciar solicitud formal de crédito <ArrowRight size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* --- CREATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-slate-900">Solicitud de Crédito</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleSubmitLoan} className="p-8">
                    <div className="space-y-8">
                        {/* 1. PROPERTY SELECTION */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Home size={18} className="text-blue-600"/> Propiedad en Garantía</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seleccionar Propiedad</label>
                                    <select 
                                        className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                                        value={selectedPropId}
                                        onChange={handlePropertyChange}
                                        required
                                    >
                                        <option value="">Seleccione...</option>
                                        {MOCK_PROPERTIES.map(p => (
                                            <option key={p.id} value={p.id}>{p.direccion} - (Valuación: {p.valor} USD)</option>
                                        ))}
                                        <option value="other">Otra / No listada</option>
                                    </select>
                                </div>

                                {selectedPropId === 'other' && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección</label>
                                            <input type="text" required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Calle 123" value={customAddress} onChange={e => setCustomAddress(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor Estimado (USD)</label>
                                            <input type="number" required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="80000" value={customPropValue} onChange={e => setCustomPropValue(e.target.value)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. BROKER SELECTION */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><User size={18} className="text-blue-600"/> Broker y Oficina</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Office */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Oficina Asignada</label>
                                    <select 
                                        className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-none disabled:bg-slate-100 disabled:text-slate-500"
                                        value={selectedOffice}
                                        onChange={e => setSelectedOffice(e.target.value)}
                                        disabled={selectedPropId !== 'other' && selectedPropId !== ''} 
                                    >
                                        <option value="">Seleccione Oficina...</option>
                                        <option value="Central">Casa Central</option>
                                        <option value="Belgrano">Sucursal Belgrano</option>
                                        <option value="Norte">Sucursal Norte</option>
                                        <option value="Puerto Madero">Sucursal Puerto Madero</option>
                                        <option value="Recoleta">Sucursal Recoleta</option>
                                    </select>
                                    {selectedPropId !== 'other' && selectedPropId !== '' && <p className="text-[10px] text-blue-600 mt-1 flex items-center gap-1"><Info size={10}/> Asignada automáticamente.</p>}
                                </div>

                                {/* Broker */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase">Broker Inmobiliario</label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input type="checkbox" className="accent-blue-600 w-3 h-3" checked={noBroker} onChange={e => setNoBroker(e.target.checked)} />
                                            <span className="text-[10px] font-bold text-slate-700">No tengo Broker</span>
                                        </label>
                                    </div>
                                    <select 
                                        className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-none disabled:bg-slate-100 disabled:text-slate-400"
                                        disabled={noBroker}
                                        value={selectedBroker}
                                        onChange={e => setSelectedBroker(e.target.value)}
                                        required={!noBroker}
                                    >
                                        <option value="">Seleccionar Broker...</option>
                                        <option value="Maria Gonzalez">Maria Gonzalez</option>
                                        <option value="Ricardo Perez">Ricardo Perez</option>
                                        <option value="Julio Sosa">Julio Sosa</option>
                                        <option value="Ana Silva">Ana Silva</option>
                                        <option value="Carlos Ruiz">Carlos Ruiz</option>
                                        <option value="Fernanda Diaz">Fernanda Diaz</option>
                                        <option value="Roberto Gomez">Roberto Gomez</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 3. FINAL AMOUNT */}
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Monto Final a Solicitar (USD)</label>
                            <input 
                                type="number" 
                                className="w-48 p-3 border border-blue-200 rounded-xl text-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/30 outline-none"
                                placeholder="Ej: 25000"
                                value={reqAmount}
                                onChange={e => setReqAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-slate-50">Cancelar</button>
                        <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2">
                            <Upload size={18} />
                            Enviar Solicitud
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default DashboardClient;
