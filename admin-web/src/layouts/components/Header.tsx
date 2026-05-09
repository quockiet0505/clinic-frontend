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
      
      {/* CỤM BÊN TRÁI: NÚT MENU + THANH SEARCH */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        
        {/* Nút Hamburger để đóng/mở Sidebar */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 transition-all font-medium" 
            placeholder="Search patients, invoices (Ctrl+K)..." 
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200">
          <Plus size={16} /><span>Add New</span>
        </button>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
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