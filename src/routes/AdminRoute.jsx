import { Navigate, useLocation } from "react-router";
import useAdmin from "@/hooks/useAdmin";
import useAuth from "@/hooks/UseAuth";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, adminLoading] = useAdmin();
  const location = useLocation();

  if (authLoading || adminLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
