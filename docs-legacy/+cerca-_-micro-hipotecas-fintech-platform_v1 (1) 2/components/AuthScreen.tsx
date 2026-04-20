
import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Briefcase, 
  ArrowRight, 
  Mail, 
  Lock, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Role } from '../types';
import { Logo } from './Logo';

interface Props {
  onLogin: (role: Role) => void;
}

const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [userType, setUserType] = useState<'client' | 'investor'>('client');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      // Map internal type to App Role
      const targetRole: Role = userType === 'client' ? 'Cliente' : 'Inversor';
      onLogin(targetRole);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding & Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <div className="mb-8">
            <Logo className="h-12 w-auto" theme="dark" />
          </div>
          
          <div className="mt-20 max-w-lg">
             <h1 className="text-5xl font-bold leading-tight mb-6">
               {userType === 'client' 
                 ? 'Tu nuevo hogar está más cerca.' 
                 : 'Rentabilidad segura con garantía real.'}
             </h1>
             <p className="text-lg text-slate-300 leading-relaxed mb-8">
               {userType === 'client'
                 ? 'Accede a microcréditos hipotecarios con la tasa más competitiva del mercado y aprobación en 48 horas.'
                 : 'Participa en fideicomisos de administración con transparencia total y monitoreo en tiempo real de tu cartera.'}
             </p>
             
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-white/10 rounded-lg"><ShieldCheck size={20} className="text-emerald-400" /></div>
                   <div>
                      <p className="font-bold">Seguridad Bancaria</p>
                      <p className="text-sm text-slate-400">Validación de identidad biométrica</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-white/10 rounded-lg"><CheckCircle2 size={20} className="text-blue-400" /></div>
                   <div>
                      <p className="font-bold">100% Digital</p>
                      <p className="text-sm text-slate-400">Sin trámites presenciales innecesarios</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
           © 2024 +cerca. Todos los derechos reservados.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
         <div className="max-w-md w-full">
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-center mb-8">
              <Logo className="h-10 w-auto" theme="light" />
            </div>

            <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-slate-900">
                 {isLoginMode ? 'Bienvenido de nuevo' : 'Crear Cuenta'}
               </h2>
               <p className="text-slate-500 mt-2">
                 {isLoginMode ? 'Ingresa tus credenciales para acceder' : 'Selecciona tu perfil para comenzar el registro'}
               </p>
            </div>

            {/* Type Selector (Only in Register Mode) */}
            {!isLoginMode && (
              <div className="grid grid-cols-2 gap-4 mb-8 p-1 bg-white border border-slate-200 rounded-xl">
                 <button 
                   onClick={() => setUserType('client')}
                   className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${userType === 'client' ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                    <User size={18} />
                    Soy Cliente
                 </button>
                 <button 
                   onClick={() => setUserType('investor')}
                   className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${userType === 'investor' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                    <Briefcase size={18} />
                    Soy Inversor
                 </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
               {!isLoginMode && (
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                       {userType === 'client' ? 'Nombre Completo' : 'Razón Social / Entidad'}
                    </label>
                    <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" placeholder={userType === 'client' ? "Ej: Juan Pérez" : "Ej: Grupo Inversor S.A."} required />
                 </div>
               )}

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
                  <div className="relative">
                     <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="email" className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="nombre@ejemplo.com" required />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
                  <div className="relative">
                     <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="password" className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="••••••••" required />
                  </div>
               </div>
               
               {!isLoginMode && (
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">
                          {userType === 'client' ? 'DNI' : 'CUIT'}
                       </label>
                       <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="..." required />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono</label>
                       <input type="tel" className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="+54..." required />
                    </div>
                 </div>
               )}

               <button 
                 type="submit" 
                 disabled={isLoading}
                 className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-6 ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 hover:scale-[1.01]'}`}
               >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      {isLoginMode ? 'Ingresar' : 'Registrarme'}
                      <ArrowRight size={18} />
                    </>
                  )}
               </button>
            </form>

            <div className="mt-6 text-center">
               <p className="text-sm text-slate-500">
                  {isLoginMode ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                  <button 
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="ml-2 font-bold text-blue-600 hover:underline"
                  >
                     {isLoginMode ? 'Regístrate' : 'Inicia Sesión'}
                  </button>
               </p>
            </div>
            
            {/* Helper for prototype */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-700 text-center">
               <p className="font-bold mb-1">Nota del Prototipo:</p>
               El registro simula la creación y te redirige automáticamente al rol seleccionado ({userType === 'client' ? 'Cliente' : 'Inversor'}).
            </div>
         </div>
      </div>
    </div>
  );
};

export default AuthScreen;
