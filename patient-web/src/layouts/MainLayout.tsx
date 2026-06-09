// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingChatbot } from '@/features/chatbot/components/FloatingChatbot';
import { ScrollToHash, ScrollToTop } from '@/components/common'; 

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-white-blue text-slate-800 antialiased font-sans">
      <ScrollToTop />
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