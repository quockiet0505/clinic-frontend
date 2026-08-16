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
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { loading } = useAuth();
  


  return <RouterProvider router={router} />;
}

export default App;