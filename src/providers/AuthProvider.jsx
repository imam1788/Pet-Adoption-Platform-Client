import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize providers
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  // Function for Google Login
  const googleLogin = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Function for GitHub Login
  const githubLogin = () => {
    return signInWithPopup(auth, githubProvider);
  };

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user?.email) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/${user.email}`
          );
          setDbUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user from DB:", error);
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setDbUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        user: dbUser || firebaseUser, // prefer DB user, fallback to Firebase user
        loading,
        logout,
        googleLogin,
        githubLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming context easily
export const useAuth = () => useContext(AuthContext);
