// src/components/common/Logo.tsx

import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
}) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 ${className}`}
    >
      <img
        src="/images/logo.png"
        alt="Logo"
        className="w-10 h-10 object-contain"
      />

      <div className="flex flex-col leading-none">
        <span className="font-black text-[#00b5f1] text-lg">
          MEDPRO
        </span>

        <span className="text-[11px] text-slate-500">
          Healthcare Platform
        </span>
      </div>
    </Link>
  );
};