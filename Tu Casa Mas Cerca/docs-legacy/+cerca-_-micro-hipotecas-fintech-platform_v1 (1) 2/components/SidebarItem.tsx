
import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false, onClick, badge }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group
        ${active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'}
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white text-blue-600' : 'bg-red-500 text-white group-hover:bg-red-400'}`}>
          {badge}
        </span>
      )}
    </button>
  );
};

export default SidebarItem;
