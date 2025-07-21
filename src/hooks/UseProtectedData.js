import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './UseAxiosSecure';

const useProtectedData = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['protectedData'],
    queryFn: async () => {
      const res = await axiosSecure.get('/protected');
      return res.data;
    },
  });

  return { data, isLoading, isError };
};

export default useProtectedData;
