import { Navigate, useLocation } from 'react-router';
import useAdmin from '@/hooks/useAdmin';
import useAuth from '@/hooks/UseAuth';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, adminLoading] = useAdmin();
  const location = useLocation();

  if (loading || adminLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Logged in but not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
