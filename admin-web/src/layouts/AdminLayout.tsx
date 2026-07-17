import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/layouts/components/Sidebar';
import Header from '@/layouts/components/Header';
import { useAuth } from '@/context/AuthContext';
import { logoApi } from '@/features/settings/api/logoApi';
import { getImageUrl } from '@/utils/image';

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string>('/images/logo.png');

  // Lấy logo hiển thị sidebar
  useEffect(() => {
    logoApi.getLogo('main')
      .then(data => {
        if (data && data.imageUrl) {
          setLogoUrl(getImageUrl(data.imageUrl));
        }
      })
      .catch(err => {
        console.warn('Could not load logo from backend, using local fallback.', err);
      });
  }, []);

  // Chờ AuthContext khởi tạo xong (đọc localStorage)
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <img src={logoUrl} alt="Logo" className="w-20 h-20 object-contain animate-pulse" />
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
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden relative">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        logoUrl={logoUrl}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => {
          // On mobile, toggle mobile menu. On desktop, toggle collapse.
          if (window.innerWidth < 768) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
          } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }
        }} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}