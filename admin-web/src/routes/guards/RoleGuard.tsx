import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps) {

  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const effectiveRoles: string[] = [user.role];
  const hasPermission = allowedRoles.some(role => effectiveRoles.includes(role));

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 bg-slate-50">
        <h1 className="text-4xl font-bold text-red-500 mb-2">
          403
        </h1>

        <h2 className="text-xl font-semibold text-slate-800">
          Access Denied
        </h2>

        <p className="text-slate-500 mt-2 text-center">
          You do not have permission to view this module.
          <br />
          Please contact the Administrator.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}