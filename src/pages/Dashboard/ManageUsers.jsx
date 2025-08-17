import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxiosSecure from "@/hooks/UseAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out" });
  }, []);

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleMakeAdmin = async (userId) => {
    const confirmResult = await Swal.fire({
      title: "Make admin?",
      text: "Are you sure you want to promote this user to admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make admin!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/make-admin/${userId}`);
        if (res.data.success) {
          Swal.fire({
            title: "Success!",
            text: "User is now an admin.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => refetch());
        }
      } catch (error) {
        Swal.fire("Error", "Failed to promote user.", "error");
        console.error(error);
      }
    }
  };

  const handleBanUser = async (userId) => {
    const confirmResult = await Swal.fire({
      title: "Ban user?",
      text: "This will prevent the user from logging in.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e02424",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, ban user!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/ban/${userId}`);
        if (res.data.modifiedCount > 0) {
          Swal.fire("Banned!", "User has been banned.", "success");
          refetch();
        }
      } catch (error) {
        Swal.fire("Error", "Failed to ban user.", "error");
        console.error(error);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-rose-500"></span>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-rose-800 dark:text-rose-400">
        Manage Users
      </h2>

      {/* Desktop Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg hidden md:block">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-rose-200 text-rose-900 dark:bg-rose-700 dark:text-rose-200">
            <tr>
              <th className="py-3 px-6 text-left">Profile</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-900 transition"
              >
                <td className="py-3 px-6">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="py-3 px-6 text-gray-900 dark:text-gray-100">{user.name || "No Name"}</td>
                <td className="py-3 px-6 text-gray-700 dark:text-gray-300">{user.email}</td>
                <td className="py-3 px-6 text-center capitalize font-medium text-gray-900 dark:text-gray-100">
                  {user.role || "user"}
                </td>
                <td className="py-3 px-6 text-center space-x-2">
                  {user.role !== "admin" && !user.banned && (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition"
                    >
                      Make Admin
                    </button>
                  )}
                  {!user.banned && (
                    <button
                      onClick={() => handleBanUser(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                    >
                      Ban
                    </button>
                  )}
                  {user.banned && (
                    <span className="text-red-600 font-semibold">Banned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg border border-rose-200 dark:border-rose-700 p-4 flex flex-col gap-3"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-4">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {user.name || "No Name"}
                </h3>
                <p className="text-rose-700 dark:text-rose-400">{user.email}</p>
                <p className="capitalize font-medium mt-1 text-gray-900 dark:text-gray-100">
                  {user.role || "user"}
                </p>
                {user.banned && (
                  <span className="text-red-600 font-semibold">Banned</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {user.role !== "admin" && !user.banned && (
                <button
                  onClick={() => handleMakeAdmin(user._id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                >
                  Make Admin
                </button>
              )}
              {!user.banned && (
                <button
                  onClick={() => handleBanUser(user._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                >
                  Ban
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
