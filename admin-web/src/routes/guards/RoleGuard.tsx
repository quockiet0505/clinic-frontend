import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps) {

  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // user.role là string đơn
  const hasPermission = allowedRoles.includes(user.role);

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