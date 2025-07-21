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

  if (!user || !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
