// src/components/common/ActionButton.tsx
import React from 'react';

interface ActionButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        font-bold rounded-xl transition-colors duration-200 cursor-pointer
        bg-primary-500 text-white border border-transparent
        hover:bg-white hover:text-primary-500 hover:border-primary-500
        ${className}
      `}
    >
      {children}
    </button>
  );
};