import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  FaHome,
  FaPaw,
  FaHeart,
  FaDonate,
  FaPlus,
  FaListAlt,
  FaBars,
  FaTimes,
  FaUsers,
  FaDog,
  FaHandHoldingUsd,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "@/hooks/UseAuth";
import useAdmin from "@/hooks/UseAdmin";

const userLinks = [
  { to: "/", label: "Go to Home", icon: <FaHome /> },
  { to: "/dashboard", label: "Dashboard Home", icon: <FaHome /> },
  { to: "/dashboard/add-pet", label: "Add Pet", icon: <FaPlus /> },
  { to: "/dashboard/my-pets", label: "My Pets", icon: <FaPaw /> },
  { to: "/dashboard/adoption-requests", label: "Adoption Requests", icon: <FaHeart /> },
  { to: "/dashboard/create-campaign", label: "Create Donation Campaign", icon: <FaDonate /> },
  { to: "/dashboard/my-donations", label: "My Donations", icon: <FaListAlt /> },
  { to: "/dashboard/my-campaigns", label: "My Donation Campaigns", icon: <FaListAlt /> },
];

const adminLinks = [
  { to: "/dashboard/manage-users", label: "Manage Users", icon: <FaUsers /> },
  { to: "/dashboard/manage-pets", label: "Manage Pets", icon: <FaDog /> },
  { to: "/dashboard/manage-donations", label: "Manage Donations", icon: <FaHandHoldingUsd /> },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();

  useEffect(() => {
    AOS.init({ duration: 400, easing: "ease-in-out" });
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <span className="loading loading-spinner loading-lg text-rose-500"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-rose-100 dark:bg-rose-900 z-50 transition-transform duration-300 ease-in-out
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:block`}
      >
        <div className="p-6 space-y-4 overflow-y-auto h-full sticky top-0">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 pb-4 border-b border-rose-200 dark:border-rose-700">
              <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-rose-900 dark:text-rose-200 font-semibold">{user.displayName}</p>
                <p className="text-xs text-rose-700 dark:text-rose-300">{user.email}</p>
              </div>
            </div>
          )}

          <nav className="space-y-2 flex flex-col mt-4">
            {userLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 py-2 px-3 rounded-md text-rose-900 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-800 transition
                  ${location.pathname === to ? "bg-rose-300 dark:bg-rose-700 font-semibold" : ""}`}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <hr className="my-3 border-rose-300 dark:border-rose-700" />
                {adminLinks.map(({ to, label, icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 py-2 px-3 rounded-md text-rose-900 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-800 transition
                    ${location.pathname === to ? "bg-rose-300 dark:bg-rose-700 font-semibold" : ""}`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span>{label}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile Header */}
        <header className="lg:hidden bg-rose-100 dark:bg-rose-900 p-4 flex items-center justify-between shadow">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            className="text-rose-700 dark:text-rose-300 focus:outline-none"
          >
            {sidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
          <h1 className="text-rose-700 dark:text-rose-300 font-bold text-lg">Dashboard</h1>
        </header>

        {/* Main Outlet Area */}
        <main
          className="flex-1 p-6 bg-white dark:bg-gray-900 overflow-y-auto min-h-[calc(100vh-56px)]"
          data-aos="fade-up"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
