import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './UseAxiosSecure';
import useAuth from './UseAuth';

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isAdmin, isLoading: adminLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ['isAdmin', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data?.role === 'admin';
    }
  });

  return [isAdmin, adminLoading];
};

export default useAdmin;
