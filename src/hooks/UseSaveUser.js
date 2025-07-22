// src/hooks/useSaveUser.js
import axios from "axios";

const useSaveUser = () => {
  const saveUser = async (firebaseUser) => {
    const { displayName, email, photoURL } = firebaseUser;

    try {
      // Step 1: Check if user already exists
      const { data: existingUser } = await axios.get(`${import.meta.env.VITE_API_URL}/users/${email}`);

      if (!existingUser?._id) {
        // Step 2: Save new user if not found
        const newUser = {
          name: displayName || "No Name",
          email,
          photoURL: photoURL || "",
          role: "user",
        };

        await axios.post(`${import.meta.env.VITE_API_URL}/users`, newUser);
      }
    } catch (err) {
      console.error("Error checking/saving user:", err);
    }
  };

  return saveUser;
};

export default useSaveUser;
