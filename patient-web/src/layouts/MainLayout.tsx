// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingChatbot } from '@/features/chatbot/components/FloatingChatbot';
import { ScrollToHash } from '@/components/common'; // 👈 thêm dòng này

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <ScrollToHash /> 
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingChatbot />
    </div>
  );
};