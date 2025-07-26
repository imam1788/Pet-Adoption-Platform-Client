// hooks/useSaveUser.js

import axios from "axios";

const useSaveUser = () => {
  const saveUser = async (userData) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Failed to save user:", err);
      throw err;
    }
  };

  return saveUser;
};

export default useSaveUser;
