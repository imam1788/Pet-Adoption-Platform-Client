import { useState, useEffect } from "react";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";

const ProfilePage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile
  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    axiosSecure
      .get(`/users/${user.email}`)
      .then(res => setProfile(res.data))
      .catch(err => setError(err?.response?.data?.message || "Failed to fetch profile"))
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-700 dark:text-gray-300">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={profile.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-rose-300 dark:border-rose-700"
        />
        <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-200">{profile.name}</h2>
        <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-rose-100 dark:bg-rose-900 rounded-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Phone</h3>
          <p className="text-gray-600 dark:text-gray-300">{profile.phone || "N/A"}</p>
        </div>
        <div className="p-4 bg-rose-100 dark:bg-rose-900 rounded-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Address</h3>
          <p className="text-gray-600 dark:text-gray-300">{profile.address || "N/A"}</p>
        </div>
        <div className="p-4 bg-rose-100 dark:bg-rose-900 rounded-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Role</h3>
          <p className="text-gray-600 dark:text-gray-300">{profile.role}</p>
        </div>
        <div className="p-4 bg-rose-100 dark:bg-rose-900 rounded-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">UID</h3>
          <p className="text-gray-600 dark:text-gray-300">{profile.uid}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
