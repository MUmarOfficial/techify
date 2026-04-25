import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface Props {
  allowedRoles: ('student' | 'instructor' | 'admin')[];
}

export default function ProtectedRoute({ allowedRoles }: Readonly<Props>) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-alabaster">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-charcoal border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-label text-warm-grey">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
