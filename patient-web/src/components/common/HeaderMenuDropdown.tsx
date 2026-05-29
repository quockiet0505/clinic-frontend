import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface HeaderMenuItem {
  label: string;
  to?: string;
  onClick?: () => void;
  active?: boolean;
  isSpecial?: boolean;
}

interface HeaderMenuDropdownProps {
  title: string;
  items: HeaderMenuItem[];
  active?: boolean;
  width?: string;
}

export const HeaderMenuDropdown: React.FC<HeaderMenuDropdownProps> = ({
  title,
  items,
  active = false,
  width = 'min-w-[180px]',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); 

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleItemClick = (onClick?: () => void) => {
    if (onClick) onClick();
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        className={`
          relative flex items-center gap-1 px-4 py-2
          font-semibold text-sm
          transition-all cursor-pointer
          focus:outline-none
        
          ${
            active
              ? 'text-primary-500'
              : 'text-slate-700 group-hover:text-primary-500'
          }
        
          after:absolute
          after:left-4
          after:right-4
          after:-bottom-1
        
          after:h-[2px]
          after:rounded-full
          after:bg-primary-500
        
          ${
            active
              ? 'after:opacity-100'
              : 'after:opacity-0 group-hover:after:opacity-100'
          }
        
          after:transition-all
        `}
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute top-full left-0 pt-2
          transition-all duration-200 z-50
          ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}
        `}
      >
        <div
          className={`
            ${width} overflow-hidden rounded-2xl bg-white
            border border-slate-100 shadow-lg
          `}
        >
          {items.map((item, idx) => {
            if (item.to) {
              return (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => handleItemClick(item.onClick)}
                  className={`
                    block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors
                    ${item.isSpecial ? 'text-primary-500 font-semibold' : ''}
                    ${
                      item.active
                        ? 'bg-primary-50 text-primary-500'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-primary-500'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={idx}
                onClick={() => handleItemClick(item.onClick)}
                className={`
                  w-full text-left px-4 py-2.5 text-sm font-medium transition-colors
                  ${item.isSpecial ? 'text-primary-500 font-semibold' : ''}
                  ${
                    item.active
                      ? 'bg-primary-50 text-primary-500'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary-500'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};