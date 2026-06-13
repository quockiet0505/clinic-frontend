import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/layouts/components/Sidebar';
import Header from '@/layouts/components/Header';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  // Chờ AuthContext khởi tạo xong (đọc localStorage)
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <img src="http://localhost:8080/images/logo.png" alt="Logo" className="w-20 h-20 object-contain animate-pulse" />
          <p className="text-slate-500 font-semibold text-sm">Đang tải hệ thống...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập → về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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