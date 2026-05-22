import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Universal top sticky navbar header component */}
      <Header />
      
      {/* Main dynamic routing content window injects here */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Universal company footer directory metadata */}
      <Footer />
    </div>
  );
};