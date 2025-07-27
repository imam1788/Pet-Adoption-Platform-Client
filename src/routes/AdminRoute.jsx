import { Navigate, useLocation } from "react-router";
import useAuth from "@/hooks/UseAuth";
import useAdmin from "@/hooks/UseAdmin";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, adminLoading] = useAdmin();
  const location = useLocation();

  if (authLoading || adminLoading || isAdmin === null || isAdmin === undefined) {
    return <div className="text-center text-lg py-10">Loading...</div>;
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
