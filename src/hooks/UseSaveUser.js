import axios from "axios";

const useSaveUser = () => {
  const saveUser = async (user) => {
    if (!user?.email) return;

    const userInfo = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: "user", // default role
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/users",
        userInfo
      );
      return res.data;
    } catch (err) {
      console.error("Error saving user:", err);
      throw err;
    }
  };

  return saveUser;
};

export default useSaveUser;
