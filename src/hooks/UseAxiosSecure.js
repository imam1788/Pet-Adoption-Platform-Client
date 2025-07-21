import axios from 'axios';

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
  });

  axiosSecure.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return axiosSecure;
};

export default useAxiosSecure;
