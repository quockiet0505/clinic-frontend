import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/hooks/useToast';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Toaster position="top-right" richColors closeButton />
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;