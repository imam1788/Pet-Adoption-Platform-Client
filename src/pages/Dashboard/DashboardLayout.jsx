import { Link, Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-rose-100 p-6 space-y-4">
        <nav className="space-y-2 flex flex-col">
          <Link to="/">Dashboard Home</Link>
          <Link to="/dashboard/add-pet">Add Pet</Link>
          <Link to="/dashboard/my-pets">My Pets</Link>
          <Link to="/dashboard/adoption-requests">Adoption Requests</Link>
          <Link to="/dashboard/my-donations">My Donations</Link>
          <Link to="/dashboard/my-campaigns">My Donation Campaigns</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
