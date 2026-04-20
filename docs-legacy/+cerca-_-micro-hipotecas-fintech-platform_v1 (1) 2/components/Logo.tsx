
import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className, theme = 'light' }) => {
  const textColor = theme === 'light' ? '#1E293B' : '#FFFFFF'; // slate-800 : white
  const orange = '#F97316'; // orange-500

  return (
    <svg 
      viewBox="0 0 145 40" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="+cerca"
    >
      {/* Plus Symbol */}
      <path d="M12 10V30M2 20H22" stroke={orange} strokeWidth="5" strokeLinecap="round" />
      
      {/* Text "cerc" */}
      <text 
        x="26" 
        y="31" 
        fontFamily="'Inter', sans-serif" 
        fontWeight="700" 
        fontSize="34" 
        fill={textColor} 
        letterSpacing="-1.5"
      >
        cerc
      </text>
      
      {/* House Icon (representing 'a') */}
      <g transform="translate(100, 4)">
        {/* Roof */}
        <path d="M2 15 L16 2 L30 15" stroke={orange} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* Walls */}
        <path d="M6 15 V30 H26 V15" stroke={orange} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* Door (filled with text color) */}
        <path d="M12 30 V20 A 4 4 0 0 1 20 20 V30 H12" fill={textColor} />
      </g>
    </svg>
  );
};
