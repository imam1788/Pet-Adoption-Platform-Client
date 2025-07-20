import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { Link, useNavigate } from "react-router";
import { FaUser, FaArrowUp } from 'react-icons/fa';
import SocialLogin from "@/components/SocialLogin/SocialLogin";

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // Handle file select and preview
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("photoFile", file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    try {
      const photoURL = preview || "";

      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, {
        displayName: data.fullName,
        photoURL,
      });
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Image Upload with Stylish Icons */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="photoFile"
              className="group cursor-pointer relative w-20 h-20 rounded-full overflow-hidden border-4  transition shadow-md hover:scale-105"
              title="Click to upload profile image"
            >
              {preview ? (
                <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
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
                onChange={onFileChange}
              />
            </label>
          </div>


          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block mb-1 font-semibold text-gray-700">
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
            <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">
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
            <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Choose a strong password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
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

        <SocialLogin></SocialLogin>

      </div>
    </div>
  );
}
