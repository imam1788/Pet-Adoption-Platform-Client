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
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const links = [
  { to: "/", label: "Dashboard Home", icon: <FaHome /> },
  { to: "/dashboard/add-pet", label: "Add Pet", icon: <FaPlus /> },
  { to: "/dashboard/my-pets", label: "My Pets", icon: <FaPaw /> },
  { to: "/dashboard/adoption-requests", label: "Adoption Requests", icon: <FaHeart /> },
  { to: "/dashboard/create-campaign", label: "Create Donation Campaign", icon: <FaDonate /> },
  { to: "/dashboard/my-donations", label: "My Donations", icon: <FaListAlt /> },
  { to: "/dashboard/my-campaigns", label: "My Donation Campaigns", icon: <FaListAlt /> },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 400, easing: "ease-in-out" });
  }, []);

  // Auto-close sidebar on mobile route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          bg-rose-100 p-6 space-y-4 w-64 z-40
          lg:static lg:block
          fixed top-0 left-0 h-full
          ${sidebarOpen ? "block" : "hidden"}
        `}
      >
        <nav className="space-y-2 flex flex-col">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 py-2 px-3 rounded-md text-rose-900 hover:bg-rose-200 transition
                ${location.pathname === to ? "bg-rose-300 font-semibold" : ""}
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-rose-100 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            className="text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            {sidebarOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
          <h1 className="text-rose-700 font-bold text-lg">Dashboard</h1>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 bg-white overflow-y-auto min-h-[calc(100vh-56px)]" data-aos="fade-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
