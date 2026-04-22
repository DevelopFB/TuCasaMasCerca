
import React from 'react';

interface KPICardProps {
  label: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, trend, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <span>{trend}</span>
            <span>vs. mes anterior</span>
          </p>
        )}
      </div>
      <div className="p-3 bg-slate-50 rounded-lg text-blue-600 border border-slate-100">
        {icon}
      </div>
    </div>
  );
};

export default KPICard;
