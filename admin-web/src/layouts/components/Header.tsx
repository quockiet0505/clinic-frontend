import React from 'react';
import { Search, Bell, Calendar, Plus, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  const userEmail = user?.email || 'Unknown User';
  const displayRole = user?.roles?.[0] || 'GUEST';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      
      {/* CỤM BÊN TRÁI: NÚT MENU */}
      <div className="flex items-center gap-4 flex-1">
        
        {/* Nút Hamburger để đóng/mở Sidebar */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"><Calendar size={20} /></button>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"><Settings size={20} /></button>
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <div className="ml-1 flex items-center gap-3 p-1 pr-3 rounded-full border border-slate-200 bg-slate-50">
          <img 
            className="h-8 w-8 rounded-full object-cover border border-slate-200 bg-white" 
            src={`https://ui-avatars.com/api/?name=${userEmail}&background=eff6ff&color=2563eb`} 
            alt="Avatar" 
          />
          <div className="hidden md:flex flex-col text-left mr-2">
            <span className="font-bold text-slate-800 text-xs leading-tight truncate max-w-[120px]">{userEmail}</span>
            <span className="text-[10px] font-semibold text-blue-600">{displayRole}</span>
          </div>
          <button 
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}