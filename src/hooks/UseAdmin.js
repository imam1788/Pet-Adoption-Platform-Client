import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './UseAxiosSecure';
import useAuth from './UseAuth';

const useAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: isAdmin = null,
    isLoading: adminLoading,
    isError,
    error,
  } = useQuery({
    enabled: !authLoading && !!user?.email,
    queryKey: ['isAdmin', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data?.role === 'admin';
    },
  });

  return [isAdmin, adminLoading, isError, error];
};

export default useAdmin;
