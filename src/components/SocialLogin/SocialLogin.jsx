import React, { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import Swal from "sweetalert2";
import { FaGoogle, FaGithub } from "react-icons/fa";
import useSaveUser from "@/hooks/UseSaveUser";
import { useNavigate } from "react-router";

export default function SocialLogin() {
  const { googleLogin, githubLogin } = useContext(AuthContext);
  const saveUser = useSaveUser();
  const navigate = useNavigate();

  const fetchAndStoreJwt = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        throw new Error("Failed to get token");
      }
      const data = await res.json();
      localStorage.setItem("access_token", data.token);
    } catch (error) {
      console.error("JWT fetch error:", error);
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      const user = result.user;

      await saveUser(user); // Save user to DB
      await fetchAndStoreJwt(user.email); // Get and store JWT

      Swal.fire("Success", "Logged in with Google!", "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await githubLogin();
      const user = result.user;

      await saveUser(user); // Save user to DB
      await fetchAndStoreJwt(user.email); // Get and store JWT

      Swal.fire("Success", "Logged in with GitHub!", "success");
      navigate("/");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData.email;
        Swal.fire({
          icon: "error",
          title: "Account Exists",
          text: `An account with the email ${email} already exists with a different sign-in method. Please use that method to login.`,
        });
      } else {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 mt-6">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 px-6 py-3 rounded-lg border-2 border-red-500 bg-red-100 text-red-700 font-semibold shadow-md hover:bg-red-500 hover:text-white transition mx-auto"
        aria-label="Login with Google"
      >
        <FaGoogle className="w-6 h-6" />
        <span>Login with Google</span>
      </button>

      <button
        onClick={handleGithubLogin}
        className="flex items-center gap-3 px-6 py-3 rounded-lg border-2 border-gray-800 bg-gray-900 text-white font-semibold shadow-md hover:bg-gray-700 transition mx-auto"
        aria-label="Login with GitHub"
      >
        <FaGithub className="w-6 h-6" />
        <span>Login with GitHub</span>
      </button>
    </div>
  );
}
