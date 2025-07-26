import axios from "axios";

const useAuthToken = () => {
  const getToken = async (email) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email });

      localStorage.setItem("access_token", data.token);
      return true;
    } catch (err) {
      if (err.response?.status === 403) {
        throw new Error("Your account has been banned.");
      }
      throw new Error("Token generation failed.");
    }
  };

  return getToken;
};

export default useAuthToken;
