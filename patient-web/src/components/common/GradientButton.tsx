import React from 'react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        group
        inline-flex items-center justify-center gap-2
        h-11 px-6
        rounded-full
        font-bold text-sm

        bg-white text-primary-500
        ring-1 ring-primary-500
        border-0

        transition-all duration-300 ease-out

        hover:ring-0
        hover:bg-gradient-to-r
        hover:from-sky-600
        hover:via-sky-500
        hover:to-cyan-400
        hover:text-white
        hover:-translate-y-[1px]

        focus:outline-none
        focus:ring-0

        active:translate-y-0

        disabled:opacity-50
        disabled:pointer-events-none

        cursor-pointer

        ${className}
      `}
    >
      {icon && (
        <span
          className="
            text-primary-500
            transition-colors duration-300
            group-hover:text-white
          "
        >
          {icon}
        </span>
      )}

      <span>{children}</span>
    </button>
  );
};