import axios from "axios";

const useAuthToken = () => {
  const getToken = async (email) => {
    try {
      const { data } = await axios.post("http://localhost:5000/jwt", { email });
      localStorage.setItem("access_token", data.token);
    } catch (err) {
      console.error("Token generation failed:", err);
    }
  };

  return getToken;
};

export default useAuthToken;
