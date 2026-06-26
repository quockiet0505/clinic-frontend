import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/hooks/useToast';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;