
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  TrendingUp, 
  PieChart, 
  Settings, 
  ChevronDown, 
  Bell, 
  UserCircle,
  HelpCircle,
  LogOut,
  Building2,
  Wallet,
  ShieldCheck,
  Briefcase,
  FileBarChart
} from 'lucide-react';
import { Role, LoanRecord } from './types';
import { MOCK_LOANS } from './mockData';
import { DashboardOverview, LegajosManager } from './components/DashboardBackOffice';
import DashboardClient from './components/DashboardClient';
import DashboardBroker from './components/DashboardBroker';
import DashboardInvestor from './components/DashboardInvestor';
import DashboardFideicomiso from './components/DashboardFideicomiso';
import AuthScreen from './components/AuthScreen'; 
import SidebarItem from './components/SidebarItem';
import LegajoModal from './components/LegajoModal';
import ReportsView from './components/ReportsView';
import { Logo } from './components/Logo';
import { 
  SettingsView, 
  InversoresView, 
  MetricsView, 
  PipelineView, 
  BrokerDocsView, 
  PagosView, 
  SoporteView,
  MiSolicitudView,
  WalletView,
  CobranzasView,
  BrokerClientsView
} from './components/SecondaryViews';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  
  const [role, setRole] = useState<Role>('Back Office');
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Data State
  const [allLoans, setAllLoans] = useState<LoanRecord[]>(MOCK_LOANS);
  
  const [selectedLoan, setSelectedLoan] = useState<LoanRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reset view to dashboard when role changes to avoid invalid states
  useEffect(() => {
    setCurrentView('dashboard');
  }, [role]);

  const handleLogin = (targetRole: Role) => {
    setRole(targetRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('Back Office');
  };

  const handleOpenDetail = (loan: LoanRecord) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  // Handler to add a new loan from Client Dashboard
  const handleAddLoan = (newLoan: LoanRecord) => {
    setAllLoans(prev => [newLoan, ...prev]);
    // Redirect user to 'Mi Solicitud' view to see their new loan
    if (role === 'Cliente') {
        setCurrentView('mi-solicitud'); 
    }
  };

  // Handler to update an existing loan (e.g. modify amount)
  const handleUpdateLoan = (updatedLoan: LoanRecord) => {
    setAllLoans(prev => prev.map(l => l.id === updatedLoan.id ? updatedLoan : l));
    setSelectedLoan(updatedLoan); // Keep the modal updated with new data
  };

  // Handler for Rejecting Loan with Reason
  const handleRejectLoan = (loanId: string, reason: string) => {
      setAllLoans(prev => prev.map(l => {
          if (l.id === loanId) {
              return { ...l, estado: 'Rechazado', motivoRechazo: reason };
          }
          return l;
      }));
      setIsModalOpen(false);
  };

  // Handler for Document Upload (Simulated)
  const handleUploadDoc = (loanId: string, docName: string) => {
     setAllLoans(prev => prev.map(l => {
         if (l.id === loanId) {
             const newDocs = l.detalles.documentacion.map(d => {
                 if (d.nombre === docName) {
                     return { ...d, estado: 'Cargado' as const };
                 }
                 return d;
             });
             const updatedLoan = { ...l, detalles: { ...l.detalles, documentacion: newDocs } };
             
             // Update selected loan if it's currently open
             if (selectedLoan?.id === loanId) {
                 setSelectedLoan(updatedLoan);
             }
             return updatedLoan;
         }
         return l;
     }));
  };

  // Handler for Client to Accept the Offer
  const handleAcceptLoan = (loanId: string) => {
    setAllLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          estado: 'Pendiente de liquidación', // Move to next status
          ofertaAceptada: true
        };
      }
      return l;
    }));
  };

  // Handler for Back Office to Activate Loan (Escritura y Liquidación)
  const handleActivateLoan = (loanId: string, liquidationData: any) => {
    setAllLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        // Generate mock schedule based on liquidation data
        const newPagos = Array.from({ length: liquidationData.cantidadCuotas }, (_, i) => ({
            numero: i + 1,
            vencimiento: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString().split('T')[0],
            monto: liquidationData.montoPrimerCuota,
            estado: 'Pendiente' as const
        }));

        return {
          ...l,
          estado: 'Activo',
          liquidacion: liquidationData,
          pagos: newPagos
        };
      }
      return l;
    }));
    setIsModalOpen(false); // Close modal after activation
  };

  // Handler for Client to REPORT Payment (Upload proof)
  const handleReportPayment = (loanId: string, installmentNumber: number, fileName: string) => {
    setAllLoans(prev => prev.map(l => {
      if (l.id === loanId && l.pagos) {
         const updatedPagos = l.pagos.map(p => {
             if (p.numero === installmentNumber) {
                 return { ...p, estado: 'En revisión' as const, comprobante: fileName, fechaPago: new Date().toISOString().split('T')[0] };
             }
             return p;
         });
         return { ...l, pagos: updatedPagos };
      }
      return l;
    }));
  };

  // Handler for Fideicomiso to CONFIRM Payment
  const handleConfirmPayment = (loanId: string, installmentNumber: number) => {
    setAllLoans(prev => prev.map(l => {
      if (l.id === loanId && l.pagos) {
         const updatedPagos = l.pagos.map(p => {
             if (p.numero === installmentNumber) {
                 return { ...p, estado: 'Pagado' as const };
             }
             return p;
         });
         return { ...l, pagos: updatedPagos };
      }
      return l;
    }));
  };

  // --- 1. Notification Counts ---
  const counts = useMemo(() => {
      const c = {
          pendingLegajos: allLoans.filter(l => l.estado === 'Pendiente' || l.estado === 'En proceso').length,
          pendingPayments: allLoans.flatMap(l => l.pagos || []).filter(p => p.estado === 'En revisión').length,
          observed: allLoans.filter(l => l.estado === 'Observado').length,
      };
      return c;
  }, [allLoans]);

  // --- 2. Navigation Rules Definition ---
  const navItems = useMemo<{ id: string; label: string; icon: React.ReactNode; badge?: number }[]>(() => {
    const base = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    ];

    switch (role) {
      case 'Back Office':
        return [
          ...base,
          { id: 'legajos', label: 'Gestión de Legajos', icon: <FileText size={20} />, badge: counts.pendingLegajos },
          { id: 'reportes', label: 'Reportes', icon: <FileBarChart size={20} /> }, 
          { id: 'inversores', label: 'Inversores', icon: <Users size={20} /> },
          { id: 'metrics', label: 'Métricas Financieras', icon: <PieChart size={20} /> },
          { id: 'settings', label: 'Configuración', icon: <Settings size={20} /> },
        ];
      case 'Oficina':
        return [
          ...base,
          { id: 'legajos', label: 'Legajos de Oficina', icon: <FileText size={20} /> },
          { id: 'seguimiento', label: 'Rendimiento Brokers', icon: <TrendingUp size={20} /> },
          { id: 'docs', label: 'Recursos', icon: <FileText size={20} /> },
        ];
      case 'Broker':
        return [
          ...base,
          { id: 'mis-clientes', label: 'Mis Clientes', icon: <Users size={20} />, badge: counts.observed },
          { id: 'seguimiento', label: 'Pipeline', icon: <TrendingUp size={20} /> },
          { id: 'docs', label: 'Documentación', icon: <FileText size={20} /> },
        ];
      case 'Inversor':
        return [
          ...base,
          { id: 'mi-cartera', label: 'Mi Cartera', icon: <Wallet size={20} /> },
          { id: 'reportes', label: 'Reportes', icon: <PieChart size={20} /> },
          { id: 'soporte', label: 'Ayuda', icon: <HelpCircle size={20} /> },
        ];
      case 'Fideicomiso':
         return [
          ...base,
          { id: 'cobranzas', label: 'Cobranzas', icon: <Briefcase size={20} />, badge: counts.pendingPayments },
          { id: 'reportes', label: 'Reportes', icon: <FileBarChart size={20} /> }, 
          { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={20} /> },
         ];
      case 'Cliente':
        return [
          ...base,
          { id: 'mi-solicitud', label: 'Mi Solicitud', icon: <FileText size={20} /> },
          { id: 'pagos', label: 'Mis Pagos', icon: <TrendingUp size={20} /> },
          { id: 'soporte', label: 'Ayuda', icon: <HelpCircle size={20} /> },
        ];
      default:
        return base;
    }
  }, [role, counts]);

  // --- 3. Data Filtering ---
  const getFilteredLoans = () => {
    switch (role) {
      case 'Back Office': return allLoans;
      case 'Oficina': return allLoans.filter(l => l.oficina === 'Central');
      case 'Broker': return allLoans.filter(l => l.broker === 'Maria Gonzalez'); // Simulating logged-in broker
      case 'Cliente': return allLoans.filter(l => l.cliente === 'Carlos Gomez');
      case 'Fideicomiso': return allLoans; 
      case 'Inversor': return [];
      default: return [];
    }
  };

  const filteredLoans = getFilteredLoans();

  // --- 4. View Rendering Logic ---
  const renderContent = () => {
    if (currentView === 'settings') return <SettingsView />;
    if (currentView === 'soporte') return <SoporteView />;
    if (currentView === 'docs') return <BrokerDocsView />;
    if (currentView === 'reportes') return <ReportsView loans={filteredLoans} />; 
    
    switch (role) {
      case 'Back Office':
        if (currentView === 'inversores') return <InversoresView />;
        if (currentView === 'metrics') return <MetricsView loans={allLoans} />;
        if (currentView === 'legajos') return <LegajosManager loans={filteredLoans} onOpenDetail={handleOpenDetail} />;
        return <DashboardOverview loans={filteredLoans} onOpenDetail={handleOpenDetail} onConfirmPayment={handleConfirmPayment} onAddLoan={handleAddLoan} />;
      case 'Oficina':
        if (currentView === 'seguimiento') return <MetricsView loans={filteredLoans} />; 
        if (currentView === 'legajos') return <LegajosManager loans={filteredLoans} onOpenDetail={handleOpenDetail} />;
        return <DashboardOverview loans={filteredLoans} onOpenDetail={handleOpenDetail} onAddLoan={handleAddLoan} />;
      case 'Broker':
        if (currentView === 'seguimiento') return <PipelineView />;
        if (currentView === 'mis-clientes') return <BrokerClientsView loans={filteredLoans} onOpenDetail={handleOpenDetail} />;
        return <DashboardBroker loans={filteredLoans} onOpenDetail={handleOpenDetail} onAddLoan={handleAddLoan} />;
      case 'Fideicomiso':
        if (currentView === 'cobranzas') return <CobranzasView loans={filteredLoans} onConfirmPayment={handleConfirmPayment} />; 
        return <DashboardFideicomiso loans={filteredLoans} />;
      case 'Inversor':
        if (currentView === 'mi-cartera') return <WalletView />;
        if (currentView === 'reportes') return <MetricsView />;
        return <DashboardInvestor />;
      case 'Cliente':
        if (currentView === 'mi-solicitud') return <MiSolicitudView loans={filteredLoans} onAccept={handleAcceptLoan} onUploadDoc={handleUploadDoc} />;
        if (currentView === 'pagos') return <PagosView loans={filteredLoans} onReportPayment={handleReportPayment} />;
        return <DashboardClient loans={filteredLoans} onAddLoan={handleAddLoan} />;
      default:
         return <div>Rol no configurado</div>;
    }
  };

  // --- CONDITIONAL RENDER: AUTH SCREEN vs APP ---
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans animate-in fade-in duration-500">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20 shadow-xl transition-all duration-300">
        <div className="p-6 flex items-center justify-center border-b border-slate-800">
          <Logo className="h-10 w-auto" theme="dark" />
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-1">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.id} 
              icon={item.icon} 
              label={item.label} 
              active={currentView === item.id} 
              badge={item.badge}
              onClick={() => setCurrentView(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
           <SidebarItem 
             icon={<Settings size={20} />} 
             label="Perfil" 
             active={currentView === 'settings'}
             onClick={() => setCurrentView('settings')}
           />
           <SidebarItem 
             icon={<LogOut size={20} />} 
             label="Cerrar Sesión" 
             onClick={handleLogout} 
           />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-10 shadow-sm">
          
          <div className="flex items-center gap-6">
            {/* Improved Role Simulator */}
            <div className="flex items-center gap-3 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Modo Vista</span>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="relative group">
                    <button className="flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors">
                        {role}
                        <ChevronDown size={14} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl hidden group-hover:block z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                        {(['Back Office', 'Oficina', 'Broker', 'Fideicomiso', 'Inversor', 'Cliente'] as Role[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 transition-colors ${role === r ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                 <Bell size={20} />
                 {/* Logic to show header dot if any important count exists */}
                 {(counts.pendingLegajos > 0 || counts.pendingPayments > 0) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                 )}
               </button>
               <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800">Usuario Demo</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm">
                    <UserCircle size={28} />
                  </div>
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      {/* Modal Detail */}
      {isModalOpen && selectedLoan && (role === 'Back Office' || role === 'Oficina' || role === 'Broker') && (
        <LegajoModal 
          loan={selectedLoan} 
          onClose={() => setIsModalOpen(false)} 
          onUpdate={handleUpdateLoan} 
          onReject={handleRejectLoan}
          onActivate={handleActivateLoan}
          onUploadDoc={handleUploadDoc}
        />
      )}
    </div>
  );
};

export default App;
