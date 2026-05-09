import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/layouts/components/Sidebar';
import Header from '@/layouts/components/Header';

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}