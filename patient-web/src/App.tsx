import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/hooks/useToast';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;