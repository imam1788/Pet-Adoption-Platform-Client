import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { Link, useNavigate } from "react-router";
import { FaUser, FaArrowUp } from "react-icons/fa";
import SocialLogin from "@/components/SocialLogin/SocialLogin";
import useSaveUser from "@/hooks/UseSaveUser";

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const saveUser = useSaveUser();

  // Watch the photoFile field to check if a file is selected
  const photoFile = watch("photoFile");

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("photoFile", file, { shouldValidate: true });
      clearErrors("photoFile"); // Clear file error if any
    }
  };

  const uploadImageToImgbb = async (imageFile) => {
    const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data?.data?.url;
  };

  const getJWTToken = async (email) => {
    try {
      const response = await fetch("https://pet-adoption-server-mu.vercel.app/jwt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("access_token", data.token);
      }
    } catch (err) {
      console.error("Failed to get JWT token:", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Manual validation for photoFile because react-hook-form can't validate file inputs well
      if (!data.photoFile) {
        setError("photoFile", {
          type: "manual",
          message: "Profile image is required",
        });
        return;
      }

      // Upload image to imgbb
      const imageUrl = await uploadImageToImgbb(data.photoFile);

      // Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update user profile with displayName and photoURL
      await updateProfile(userCredential.user, {
        displayName: data.fullName,
        photoURL: imageUrl,
      });

      // Prepare clean user object to save in backend DB
      const cleanUser = {
        name: data.fullName,
        email: data.email,
        photoURL: imageUrl,
        uid: userCredential.user.uid,
        role: "user", // backend also defaults this, but explicit is better
      };

      // Save user to backend DB
      await saveUser(cleanUser);

      // Get and save JWT token
      await getJWTToken(data.email);

      // Navigate to home or wherever you want
      navigate("/");
    } catch (error) {
      console.error("Firebase signup error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "Email is already registered. Please login or use a different email.",
        });
      } else {
        alert(error.message);
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="photoFile"
              className="group cursor-pointer relative w-20 h-20 rounded-full overflow-hidden border-4 transition shadow-md hover:scale-105"
              title="Click to upload profile image"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 relative">
                  <FaUser className="text-5xl text-gray-400 group-hover:text-indigo-500 transition" />
                  <FaArrowUp className="absolute bottom-1 right-1 bg-white text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white p-1 rounded-full text-xl shadow" />
                </div>
              )}
              <input
                type="file"
                id="photoFile"
                accept="image/*"
                className="hidden"
                {...register("photoFile")}
                onChange={onFileChange}
              />
            </label>
            {errors.photoFile && (
              <p className="mt-1 text-sm text-red-600">{errors.photoFile.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block mb-1 font-semibold text-gray-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Your full name"
              {...register("fullName", { required: "Full name is required" })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Choose a strong password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login here
          </Link>
        </p>

        <SocialLogin />
      </div>
    </div>
  );
}
